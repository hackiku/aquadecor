# COMPLETE SCHEMA ANALYSIS

## What Just Happened

You now have a PROPER e-commerce schema that can handle:
- Market-specific pricing (US vs ROW vs CA)
- Quantity bundles with Stripe integration
- Calculator products with dimension snapshots
- Promoter codes + seasonal sales
- Full order audit trail
- Multi-currency support

## Key Design Decisions

### 1. PRICING IS NOW SEPARATE TABLE

**products** = Physical facts (dimensions, material, SKU)
**productPricing** = Money stuff (price, market, currency)

Why this matters:
- Same product can have different prices in US vs EU
- Can add Canadian pricing without touching product table
- Can query "show all US prices" or "products under €50 in ROW"
- Stripe prices live here, one per market
- Time-based pricing (effectiveFrom/Until) for sales automation

### 2. BUNDLES ARE NORMALIZED

Instead of:
```jsonb
pricing: { bundles: [{quantity: 7, price: 35728}, ...] }
```

Now:
```sql
SELECT * FROM pricing_bundles WHERE pricing_id = 'xxx'
```

Benefits:
- Each bundle has its own Stripe price ID
- Can query "show all 10-piece bundles"
- Can update all bundle prices at once
- Promoter codes can target specific bundle tiers

### 3. MARKET EXCLUSIONS TABLE

Instead of `excludedMarkets: ["US"]` on every product:
```sql
INSERT INTO product_market_exclusions (product_id, market, reason)
VALUES ('product-123', 'US', 'Trump tariffs');
```

Benefits:
- Can track WHY products are excluded
- Can bulk-enable/disable markets
- Can query "which products are US-blocked due to tariffs"
- Future: auto-exclude based on shipping zones

### 4. ORDER PRICING SNAPSHOT (CRITICAL)

```jsonb
pricingSnapshot: {
  pricingType: 'bundle',
  bundleQuantity: 7,
  bundleTotalPriceEurCents: 35728,
  selectedAddons: [{name: "Moss", priceEurCents: 500}],
  // EVERYTHING captured at checkout time
}
```

Why this is non-negotiable:
- Legal requirement: orders show what customer PAID, not current price
- Supports calculator orders (dimensions, options)
- Supports promoter attribution
- Can recreate invoice years later
- Accounting audit trail

### 5. CALCULATOR INTEGRATION

Your calculator router creates Quote → converts to Order:

```typescript
// Calculator creates quote
const quote = await db.insert(quotes).values({
  dimensions: {...},
  estimatedPriceEurCents: calculated,
  status: 'pending'
});

// Customer pays → convert to order
const order = await db.insert(orders).values({
  // ... order details
});

const orderItem = await db.insert(orderItems).values({
  productId: backgroundProductId,
  pricingSnapshot: {
    pricingType: 'configuration',
    configurationDetails: quote.dimensions,
    surfaceAreaSqM: calculated,
    baseRatePerSqM: pricing.baseRatePerSqM
  }
});
```

Calculator pricing lives in productPricing.baseRatePerSqM (€250/sqm).

## How It Handles Your Specific Cases

### Case 1: ROW Product with Bundles
```sql
-- Product
INSERT INTO products (sku, slug, ...) VALUES ('D-18', 'd-18-model', ...);

-- ROW Pricing
INSERT INTO product_pricing (product_id, market, pricing_type)
VALUES ('d-18', 'ROW', 'bundle');

-- Bundles
INSERT INTO pricing_bundles (pricing_id, quantity, total_price_eur_cents, label)
VALUES
  ('pricing-row', 7, 35728, '7 pieces'),
  ('pricing-row', 10, 45000, '10 pieces (Save 10%)');
```

### Case 2: US Product with Simple Price
```sql
-- Same product, different pricing
INSERT INTO product_pricing (product_id, market, pricing_type, unit_price_eur_cents, fixed_quantity)
VALUES ('d-18', 'US', 'simple', 46800, 7); -- $468 includes 7 pieces

-- Exclude from other markets
INSERT INTO product_market_exclusions (product_id, market, reason)
VALUES ('d-18', 'CA', 'Shipping restrictions');
```

### Case 3: Background with Calculator
```sql
-- Product
INSERT INTO products (sku, slug, ...) VALUES ('A-1', 'a-1-background', ...);

-- Configuration pricing
INSERT INTO product_pricing (product_id, market, pricing_type, base_rate_per_sq_m, calculator_url)
VALUES ('a-1', 'ROW', 'configuration', 25000, '/calculator');
```

### Case 4: Seasonal Sale (Black Friday)
```sql
-- Active sale
INSERT INTO sales (name, discount_code, discount_percent, starts_at, ends_at)
VALUES ('Black Friday', 'BLACKFRIDAY25', 25, '2025-11-28', '2025-11-30');

-- Order tracks which sale was used
INSERT INTO orders (discount_code, sale_id, discount, ...)
VALUES ('BLACKFRIDAY25', 'sale-bf', 2500, ...);
```

### Case 5: Promoter Code (Joey gets 15% + 5% commission)
```sql
-- Promoter
INSERT INTO promoters (first_name, last_name, email)
VALUES ('Joey', 'Smith', 'joey@example.com');

-- Code
INSERT INTO promoter_codes (promoter_id, code, discount_percent, commission_percent)
VALUES ('joey', 'JOEY15', 15, 5);

-- Order tracks promoter
INSERT INTO orders (discount_code, promoter_id, total, ...)
VALUES ('JOEY15', 'joey', 8500, ...);

-- Update promoter stats
UPDATE promoters SET total_orders = total_orders + 1, total_revenue = total_revenue + 8500;
```

## Integration Points

### With Stripe
```typescript
// Create product in Stripe
const stripeProduct = await stripe.products.create({
  name: product.name,
  metadata: { aquadecor_sku: product.sku }
});

// Create prices (one per market/bundle)
const rowPrice = await stripe.prices.create({
  product: stripeProduct.id,
  unit_amount: 4900, // €49
  currency: 'eur'
});

const usPrice = await stripe.prices.create({
  product: stripeProduct.id,
  unit_amount: 5400, // $54
  currency: 'usd'
});

// Store in DB
await db.update(products).set({ stripe_product_id: stripeProduct.id });
await db.update(productPricing).set({ stripe_price_id: rowPrice.id }).where(market = 'ROW');
await db.update(productPricing).set({ stripe_price_id: usPrice.id }).where(market = 'US');
```

### With Countries Table
```typescript
// Detect market from country
const country = await db.query.countries.findFirst({
  where: eq(countries.iso2, userCountryCode)
});

const market = country.iso2 === 'US' ? 'US' : 'ROW';

// Get pricing for market
const pricing = await db.query.productPricing.findFirst({
  where: and(
    eq(productPricing.productId, productId),
    eq(productPricing.market, market),
    eq(productPricing.isActive, true)
  ),
  with: { bundles: true }
});

// Calculate shipping
const shippingCost = country.shippingZone.baseRate + (weightKg * country.shippingZone.perKgRate);
```

### With Sales/Promoters
```typescript
// Check active sales
const activeSales = await db.query.sales.findMany({
  where: and(
    eq(sales.isActive, true),
    lte(sales.startsAt, new Date()),
    gte(sales.endsAt, new Date())
  )
});

// Apply discount
const discount = (subtotal * activeSale.discountPercent) / 100;

// Track in order
await db.insert(orders).values({
  discountCode: activeSale.discountCode,
  saleId: activeSale.id,
  discount,
  ...
});

// Update sale stats
await db.update(sales)
  .set({ usageCount: sql`usage_count + 1`, totalRevenue: sql`total_revenue + ${total}` })
  .where(eq(sales.id, activeSale.id));
```

## Query Examples

### Get Product with ALL Pricing Info
```typescript
const product = await db.query.products.findFirst({
  where: eq(products.slug, 'd-18-model'),
  with: {
    translations: { where: eq(productTranslations.locale, 'en') },
    pricing: {
      where: and(
        eq(productPricing.market, userMarket),
        eq(productPricing.isActive, true)
      ),
      with: { bundles: true }
    },
    addons: { where: eq(productAddons.isActive, true) },
    customizationOptions: { with: { selectOptions: true } }
  }
});
```

### Get All US Products
```typescript
const usProducts = await db
  .select()
  .from(products)
  .innerJoin(productPricing, eq(products.id, productPricing.productId))
  .leftJoin(productMarketExclusions, and(
    eq(productMarketExclusions.productId, products.id),
    eq(productMarketExclusions.market, 'US')
  ))
  .where(and(
    eq(productPricing.market, 'US'),
    isNull(productMarketExclusions.id) // Not excluded
  ));
```

### Get Revenue by Promoter
```typescript
const promoterStats = await db
  .select({
    promoterName: sql`${promoters.firstName} || ' ' || ${promoters.lastName}`,
    totalOrders: count(orders.id),
    totalRevenue: sum(orders.total),
    totalCommission: sql`SUM(${orders.total} * ${promoterCodes.commissionPercent} / 100)`
  })
  .from(orders)
  .innerJoin(promoters, eq(orders.promoterId, promoters.id))
  .innerJoin(promoterCodes, eq(promoterCodes.promoterId, promoters.id))
  .groupBy(promoters.id);
```

## Migration Path

Since you're not migrating old data:

1. **Drop all existing tables** (nuclear option, you said it's fine)
2. **Run new schema** migration
3. **Seed with new structure**:
   - Products (physical facts)
   - ProductPricing (ROW market first)
   - PricingBundles (for plants, rocks)
   - ProductAddons (moss, cork)
   - Repeat for US market (only 3-4 products)
4. **Update components** to query new structure
5. **Test end-to-end**
6. **Ship**

## Component Changes Required

### ProductPricingModule
```typescript
// Old
const pricing = product.pricing;

// New
const pricing = await api.product.getPricing.query({ 
  productId, 
  market: userMarket 
});

const bundles = pricing.bundles; // Already joined
const addons = await api.product.getAddons.query({ productId });
```

### Cart/Checkout
```typescript
// Old
const price = product.basePriceEurCents;

// New
const pricing = await db.query.productPricing.findFirst({
  where: and(
    eq(productPricing.productId, productId),
    eq(productPricing.market, userMarket)
  )
});

const price = pricing.pricingType === 'simple' 
  ? pricing.unitPriceEurCents 
  : selectedBundle.totalPriceEurCents;
```

### Order Creation (CRITICAL)
```typescript
await db.insert(orderItems).values({
  productId,
  productName: product.name,
  sku: product.sku,
  pricingSnapshot: {
    pricingType: pricing.pricingType,
    market: pricing.market,
    currency: pricing.currency,
    bundleQuantity: selectedBundle?.quantity,
    bundleTotalPriceEurCents: selectedBundle?.totalPriceEurCents,
    selectedAddons: selectedAddons.map(a => ({
      addonId: a.id,
      name: a.name,
      priceEurCents: a.priceEurCents
    }))
  },
  quantity: cartQuantity,
  total: calculatedTotal
});
```

## What You Get

### Pros
✅ Queryable pricing (analytics, reports)
✅ Multi-market support (US/ROW/CA/UK)
✅ Stripe-ready (one price ID per bundle/market)
✅ Promoter tracking built-in
✅ Sales campaigns with date ranges
✅ Calculator integration
✅ Legal-compliant order snapshots
✅ Can bulk-update prices
✅ Can add new markets without schema changes
✅ Future-proof for variants, subscriptions

### Cons
❌ More tables (15 instead of 3)
❌ More complex queries (joins everywhere)
❌ Seed scripts need rewriting
❌ Components need updating
❌ Takes 2-3 days instead of tonight

## Honest Assessment

**For 230 products that won't grow much:** This is overkill.

**For a business you're partnering with that needs:**
- US vs ROW pricing
- Promoter commissions
- Seasonal sales
- Calculator products
- Stripe + PayPal
- Future expansion

**This is the right call.**

You're not building for tonight, you're building for the next 3 years. And with this schema, you can:
- Add Canadian market in 1 hour
- Launch "Buy 5 get 1 free" bundles in 2 hours
- Add subscription products later
- Build admin panels that make sense
- Export to any accounting software
- Let your partner see real analytics

## The Trade-off

**JSONB Approach:** Ship in 12 hours, refactor in 6 months when it hurts
**Normalized Approach:** Ship in 3 days, never think about it again

Your call. But if this is a partnership and not just a gig, do it right.
EOF
cat /home/claude/schema-analysis.txt
Output

# COMPLETE SCHEMA ANALYSIS

## What Just Happened

You now have a PROPER e-commerce schema that can handle:
- Market-specific pricing (US vs ROW vs CA)
- Quantity bundles with Stripe integration
- Calculator products with dimension snapshots
- Promoter codes + seasonal sales
- Full order audit trail
- Multi-currency support

## Key Design Decisions

### 1. PRICING IS NOW SEPARATE TABLE

**products** = Physical facts (dimensions, material, SKU)
**productPricing** = Money stuff (price, market, currency)

Why this matters:
- Same product can have different prices in US vs EU
- Can add Canadian pricing without touching product table
- Can query "show all US prices" or "products under €50 in ROW"
- Stripe prices live here, one per market
- Time-based pricing (effectiveFrom/Until) for sales automation

### 2. BUNDLES ARE NORMALIZED

Instead of:
```jsonb
pricing: { bundles: [{quantity: 7, price: 35728}, ...] }
```

Now:
```sql
SELECT * FROM pricing_bundles WHERE pricing_id = 'xxx'
```

Benefits:
- Each bundle has its own Stripe price ID
- Can query "show all 10-piece bundles"
- Can update all bundle prices at once
- Promoter codes can target specific bundle tiers

### 3. MARKET EXCLUSIONS TABLE

Instead of `excludedMarkets: ["US"]` on every product:
```sql
INSERT INTO product_market_exclusions (product_id, market, reason)
VALUES ('product-123', 'US', 'Trump tariffs');
```

Benefits:
- Can track WHY products are excluded
- Can bulk-enable/disable markets
- Can query "which products are US-blocked due to tariffs"
- Future: auto-exclude based on shipping zones

### 4. ORDER PRICING SNAPSHOT (CRITICAL)

```jsonb
pricingSnapshot: {
  pricingType: 'bundle',
  bundleQuantity: 7,
  bundleTotalPriceEurCents: 35728,
  selectedAddons: [{name: "Moss", priceEurCents: 500}],
  // EVERYTHING captured at checkout time
}
```

Why this is non-negotiable:
- Legal requirement: orders show what customer PAID, not current price
- Supports calculator orders (dimensions, options)
- Supports promoter attribution
- Can recreate invoice years later
- Accounting audit trail

### 5. CALCULATOR INTEGRATION

Your calculator router creates Quote → converts to Order:

```typescript
// Calculator creates quote
const quote = await db.insert(quotes).values({
  dimensions: {...},
  estimatedPriceEurCents: calculated,
  status: 'pending'
});

// Customer pays → convert to order
const order = await db.insert(orders).values({
  // ... order details
});

const orderItem = await db.insert(orderItems).values({
  productId: backgroundProductId,
  pricingSnapshot: {
    pricingType: 'configuration',
    configurationDetails: quote.dimensions,
    surfaceAreaSqM: calculated,
    baseRatePerSqM: pricing.baseRatePerSqM
  }
});
```

Calculator pricing lives in productPricing.baseRatePerSqM (€250/sqm).

## How It Handles Your Specific Cases

### Case 1: ROW Product with Bundles
```sql
-- Product
INSERT INTO products (sku, slug, ...) VALUES ('D-18', 'd-18-model', ...);

-- ROW Pricing
INSERT INTO product_pricing (product_id, market, pricing_type)
VALUES ('d-18', 'ROW', 'bundle');

-- Bundles
INSERT INTO pricing_bundles (pricing_id, quantity, total_price_eur_cents, label)
VALUES
  ('pricing-row', 7, 35728, '7 pieces'),
  ('pricing-row', 10, 45000, '10 pieces (Save 10%)');
```

### Case 2: US Product with Simple Price
```sql
-- Same product, different pricing
INSERT INTO product_pricing (product_id, market, pricing_type, unit_price_eur_cents, fixed_quantity)
VALUES ('d-18', 'US', 'simple', 46800, 7); -- $468 includes 7 pieces

-- Exclude from other markets
INSERT INTO product_market_exclusions (product_id, market, reason)
VALUES ('d-18', 'CA', 'Shipping restrictions');
```

### Case 3: Background with Calculator
```sql
-- Product
INSERT INTO products (sku, slug, ...) VALUES ('A-1', 'a-1-background', ...);

-- Configuration pricing
INSERT INTO product_pricing (product_id, market, pricing_type, base_rate_per_sq_m, calculator_url)
VALUES ('a-1', 'ROW', 'configuration', 25000, '/calculator');
```

### Case 4: Seasonal Sale (Black Friday)
```sql
-- Active sale
INSERT INTO sales (name, discount_code, discount_percent, starts_at, ends_at)
VALUES ('Black Friday', 'BLACKFRIDAY25', 25, '2025-11-28', '2025-11-30');

-- Order tracks which sale was used
INSERT INTO orders (discount_code, sale_id, discount, ...)
VALUES ('BLACKFRIDAY25', 'sale-bf', 2500, ...);
```

### Case 5: Promoter Code (Joey gets 15% + 5% commission)
```sql
-- Promoter
INSERT INTO promoters (first_name, last_name, email)
VALUES ('Joey', 'Smith', 'joey@example.com');

-- Code
INSERT INTO promoter_codes (promoter_id, code, discount_percent, commission_percent)
VALUES ('joey', 'JOEY15', 15, 5);

-- Order tracks promoter
INSERT INTO orders (discount_code, promoter_id, total, ...)
VALUES ('JOEY15', 'joey', 8500, ...);

-- Update promoter stats
UPDATE promoters SET total_orders = total_orders + 1, total_revenue = total_revenue + 8500;
```

## Integration Points

### With Stripe
```typescript
// Create product in Stripe
const stripeProduct = await stripe.products.create({
  name: product.name,
  metadata: { aquadecor_sku: product.sku }
});

// Create prices (one per market/bundle)
const rowPrice = await stripe.prices.create({
  product: stripeProduct.id,
  unit_amount: 4900, // €49
  currency: 'eur'
});

const usPrice = await stripe.prices.create({
  product: stripeProduct.id,
  unit_amount: 5400, // $54
  currency: 'usd'
});

// Store in DB
await db.update(products).set({ stripe_product_id: stripeProduct.id });
await db.update(productPricing).set({ stripe_price_id: rowPrice.id }).where(market = 'ROW');
await db.update(productPricing).set({ stripe_price_id: usPrice.id }).where(market = 'US');
```

### With Countries Table
```typescript
// Detect market from country
const country = await db.query.countries.findFirst({
  where: eq(countries.iso2, userCountryCode)
});

const market = country.iso2 === 'US' ? 'US' : 'ROW';

// Get pricing for market
const pricing = await db.query.productPricing.findFirst({
  where: and(
    eq(productPricing.productId, productId),
    eq(productPricing.market, market),
    eq(productPricing.isActive, true)
  ),
  with: { bundles: true }
});

// Calculate shipping
const shippingCost = country.shippingZone.baseRate + (weightKg * country.shippingZone.perKgRate);
```

### With Sales/Promoters
```typescript
// Check active sales
const activeSales = await db.query.sales.findMany({
  where: and(
    eq(sales.isActive, true),
    lte(sales.startsAt, new Date()),
    gte(sales.endsAt, new Date())
  )
});

// Apply discount
const discount = (subtotal * activeSale.discountPercent) / 100;

// Track in order
await db.insert(orders).values({
  discountCode: activeSale.discountCode,
  saleId: activeSale.id,
  discount,
  ...
});

// Update sale stats
await db.update(sales)
  .set({ usageCount: sql`usage_count + 1`, totalRevenue: sql`total_revenue + ${total}` })
  .where(eq(sales.id, activeSale.id));
```

## Query Examples

### Get Product with ALL Pricing Info
```typescript
const product = await db.query.products.findFirst({
  where: eq(products.slug, 'd-18-model'),
  with: {
    translations: { where: eq(productTranslations.locale, 'en') },
    pricing: {
      where: and(
        eq(productPricing.market, userMarket),
        eq(productPricing.isActive, true)
      ),
      with: { bundles: true }
    },
    addons: { where: eq(productAddons.isActive, true) },
    customizationOptions: { with: { selectOptions: true } }
  }
});
```

### Get All US Products
```typescript
const usProducts = await db
  .select()
  .from(products)
  .innerJoin(productPricing, eq(products.id, productPricing.productId))
  .leftJoin(productMarketExclusions, and(
    eq(productMarketExclusions.productId, products.id),
    eq(productMarketExclusions.market, 'US')
  ))
  .where(and(
    eq(productPricing.market, 'US'),
    isNull(productMarketExclusions.id) // Not excluded
  ));
```

### Get Revenue by Promoter
```typescript
const promoterStats = await db
  .select({
    promoterName: sql`${promoters.firstName} || ' ' || ${promoters.lastName}`,
    totalOrders: count(orders.id),
    totalRevenue: sum(orders.total),
    totalCommission: sql`SUM(${orders.total} * ${promoterCodes.commissionPercent} / 100)`
  })
  .from(orders)
  .innerJoin(promoters, eq(orders.promoterId, promoters.id))
  .innerJoin(promoterCodes, eq(promoterCodes.promoterId, promoters.id))
  .groupBy(promoters.id);
```

## Migration Path

Since you're not migrating old data:

1. **Drop all existing tables** (nuclear option, you said it's fine)
2. **Run new schema** migration
3. **Seed with new structure**:
   - Products (physical facts)
   - ProductPricing (ROW market first)
   - PricingBundles (for plants, rocks)
   - ProductAddons (moss, cork)
   - Repeat for US market (only 3-4 products)
4. **Update components** to query new structure
5. **Test end-to-end**
6. **Ship**

## Component Changes Required

### ProductPricingModule
```typescript
// Old
const pricing = product.pricing;

// New
const pricing = await api.product.getPricing.query({ 
  productId, 
  market: userMarket 
});

const bundles = pricing.bundles; // Already joined
const addons = await api.product.getAddons.query({ productId });
```

### Cart/Checkout
```typescript
// Old
const price = product.basePriceEurCents;

// New
const pricing = await db.query.productPricing.findFirst({
  where: and(
    eq(productPricing.productId, productId),
    eq(productPricing.market, userMarket)
  )
});

const price = pricing.pricingType === 'simple' 
  ? pricing.unitPriceEurCents 
  : selectedBundle.totalPriceEurCents;
```

### Order Creation (CRITICAL)
```typescript
await db.insert(orderItems).values({
  productId,
  productName: product.name,
  sku: product.sku,
  pricingSnapshot: {
    pricingType: pricing.pricingType,
    market: pricing.market,
    currency: pricing.currency,
    bundleQuantity: selectedBundle?.quantity,
    bundleTotalPriceEurCents: selectedBundle?.totalPriceEurCents,
    selectedAddons: selectedAddons.map(a => ({
      addonId: a.id,
      name: a.name,
      priceEurCents: a.priceEurCents
    }))
  },
  quantity: cartQuantity,
  total: calculatedTotal
});
```

## What You Get

### Pros
✅ Queryable pricing (analytics, reports)
✅ Multi-market support (US/ROW/CA/UK)
✅ Stripe-ready (one price ID per bundle/market)
✅ Promoter tracking built-in
✅ Sales campaigns with date ranges
✅ Calculator integration
✅ Legal-compliant order snapshots
✅ Can bulk-update prices
✅ Can add new markets without schema changes
✅ Future-proof for variants, subscriptions

### Cons
❌ More tables (15 instead of 3)
❌ More complex queries (joins everywhere)
❌ Seed scripts need rewriting
❌ Components need updating
❌ Takes 2-3 days instead of tonight

## Honest Assessment

**For 230 products that won't grow much:** This is overkill.

**For a business you're partnering with that needs:**
- US vs ROW pricing
- Promoter commissions
- Seasonal sales
- Calculator products
- Stripe + PayPal
- Future expansion

**This is the right call.**

You're not building for tonight, you're building for the next 3 years. And with this schema, you can:
- Add Canadian market in 1 hour
- Launch "Buy 5 get 1 free" bundles in 2 hours
- Add subscription products later
- Build admin panels that make sense
- Export to any accounting software
- Let your partner see real analytics

## The Trade-off

**JSONB Approach:** Ship in 12 hours, refactor in 6 months when it hurts
**Normalized Approach:** Ship in 3 days, never think about it again

Your call. But if this is a partnership and not just a gig, do it right.
