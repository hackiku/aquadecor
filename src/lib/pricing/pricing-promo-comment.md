Alright, here's the brutal reality of what you're dealing with:

## The Pricing/Promo Clusterfuck - Complete Overview

### What You Have Right Now

**3 Discount Systems:**
1. **Sales** (seasonal, site-wide) - Black Friday, Summer Sale
2. **Promoter Codes** (affiliate links) - JOEY15, influencer codes
3. **Signup Discount** (first order) - WELCOME10

**Current State:**
- ✅ Schema exists for all three
- ✅ Validation function works (`validateDiscountCode`)
- ❌ Not shown on product cards
- ❌ Not applied to cart preview
- ❌ Only works at checkout

---

## How Product Card Pricing SHOULD Work

**Display Logic:**

```typescript
// On every product card, you need to show:

1. Base price: €49.00
2. Active sale price (if sale active): €39.00 (crossed out €49.00)
3. User's personal discount (if they have unused code): "Your code saves €5 more!"
```

**The Flow:**

```
Product Card Query
↓
1. Get base price from productPricing (ROW market)
↓
2. Check if ANY active sales apply to this product
   - Check sales.targetType ('all' | 'category' | 'product_line' | 'specific_products')
   - Check if product matches targetProductIds/targetCategoryIds
   - Check if sale.targetMarkets includes user's market
↓
3. If sale found, calculate sale price
   - If percentage: basePrice * (1 - discountPercent/100)
   - If fixed: basePrice - discountAmountCents
↓
4. Check if user has unused promo code (logged in users only)
   - Query user's orders to see if they used any codes
   - If unused code exists, calculate potential additional savings
↓
5. Return to frontend:
   {
     basePrice: 4900,
     salePrice: 3900, // or null
     userCodeDiscount: 500, // or null
     activeSale: { name: "Black Friday", endsAt: Date }
   }
```

---

## How To Implement This (Big Strokes)

### Step 1: Add Sale Price Calculation Helper

```typescript
// src/lib/pricing-helpers.ts

import type { Sale } from '~/server/db/schema'

export function calculateSalePrice(
  basePrice: number,
  productId: string,
  categoryId: string,
  productLine: string,
  activeSales: Sale[],
  market: string
): { salePrice: number | null; activeSale: Sale | null } {
  
  // Find first matching sale
  const matchingSale = activeSales.find(sale => {
    // Check market
    if (sale.targetMarkets && !sale.targetMarkets.includes(market)) {
      return false
    }
    
    // Check targeting
    if (sale.targetType === 'all') return true
    
    if (sale.targetType === 'product_line') {
      return sale.targetProductIds?.includes(productLine)
    }
    
    if (sale.targetType === 'category') {
      return sale.targetCategoryIds?.includes(categoryId)
    }
    
    if (sale.targetType === 'specific_products') {
      return sale.targetProductIds?.includes(productId)
    }
    
    return false
  })
  
  if (!matchingSale) {
    return { salePrice: null, activeSale: null }
  }
  
  // Calculate discount
  const discount = matchingSale.type === 'percentage'
    ? Math.floor(basePrice * (matchingSale.discountPercent! / 100))
    : matchingSale.discountAmountCents!
  
  const salePrice = Math.max(0, basePrice - discount)
  
  return { salePrice, activeSale: matchingSale }
}
```

### Step 2: Update Product List Query

```typescript
// src/server/api/routers/product.ts

list: publicProcedure
  .input(z.object({
    categorySlug: z.string().optional(),
    locale: z.string().default('en'),
    market: z.string().default('ROW'),
  }))
  .query(async ({ ctx, input }) => {
    const now = new Date()
    
    // 1. Fetch active sales ONCE
    const activeSales = await ctx.db.query.sales.findMany({
      where: and(
        eq(sales.isActive, true),
        lte(sales.startsAt, now),
        gte(sales.endsAt, now)
      )
    })
    
    // 2. Fetch products with pricing
    const products = await ctx.db.query.products.findMany({
      where: eq(products.isActive, true),
      with: {
        pricing: {
          where: and(
            eq(productPricing.market, input.market),
            eq(productPricing.isActive, true)
          ),
          limit: 1
        },
        translations: {
          where: eq(productTranslations.locale, input.locale),
          limit: 1
        },
        category: {
          columns: {
            id: true,
            slug: true,
            productLine: true
          }
        }
      }
    })
    
    // 3. Apply sale pricing to each product
    return products.map(product => {
      const pricing = product.pricing[0]
      const basePrice = pricing?.unitPriceEurCents ?? 0
      
      const { salePrice, activeSale } = calculateSalePrice(
        basePrice,
        product.id,
        product.category.id,
        product.category.productLine,
        activeSales,
        input.market
      )
      
      return {
        ...product,
        basePrice,
        salePrice,
        activeSale: activeSale ? {
          name: activeSale.name,
          endsAt: activeSale.endsAt,
          discountPercent: activeSale.discountPercent
        } : null
      }
    })
  })
```

### Step 3: Product Card Component

```typescript
// src/components/shop/ProductCard.tsx

interface ProductCardProps {
  product: {
    id: string
    name: string
    basePrice: number // cents
    salePrice: number | null // cents
    activeSale: {
      name: string
      endsAt: Date
      discountPercent: number
    } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const hasActiveSale = product.salePrice !== null
  const displayPrice = hasActiveSale ? product.salePrice : product.basePrice
  const savings = hasActiveSale ? product.basePrice - product.salePrice : 0
  
  return (
    <div className="product-card">
      {/* Sale badge */}
      {hasActiveSale && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {product.activeSale?.discountPercent}% OFF
        </div>
      )}
      
      {/* Image, etc */}
      
      {/* Pricing */}
      <div className="pricing">
        {hasActiveSale ? (
          <>
            <span className="text-2xl font-bold text-green-600">
              €{(displayPrice / 100).toFixed(2)}
            </span>
            <span className="text-sm line-through text-muted-foreground ml-2">
              €{(product.basePrice / 100).toFixed(2)}
            </span>
            <p className="text-xs text-green-600 mt-1">
              Save €{(savings / 100).toFixed(2)} ({product.activeSale?.name})
            </p>
          </>
        ) : (
          <span className="text-2xl font-bold">
            €{(displayPrice / 100).toFixed(2)}
          </span>
        )}
      </div>
    </div>
  )
}
```

---

## User Personal Coupons (If User Is Logged In)

**Scenario:** User signed up, got WELCOME10 code, hasn't used it yet. Show them potential savings on every product.

```typescript
// In product list query, add this:

let userUnusedCode: PromoterCode | null = null

if (ctx.session?.user?.email) {
  // Check if user has placed any orders
  const existingOrders = await ctx.db.query.orders.findMany({
    where: eq(orders.email, ctx.session.user.email),
    limit: 1
  })
  
  // If first-time buyer, they can use WELCOME10
  if (existingOrders.length === 0) {
    userUnusedCode = {
      code: 'WELCOME10',
      discountPercent: 10,
      type: 'percentage'
    }
  } else {
    // Check for unused promoter codes (affiliate links they clicked)
    // TODO: Track referral codes in session/cookies
  }
}

// Then in product mapping:
return products.map(product => {
  // ... existing sale price logic
  
  let additionalUserSavings = 0
  if (userUnusedCode && userUnusedCode.type === 'percentage') {
    const priceToDiscount = salePrice ?? basePrice
    additionalUserSavings = Math.floor(priceToDiscount * (userUnusedCode.discountPercent! / 100))
  }
  
  return {
    ...product,
    userUnusedCode,
    additionalUserSavings
  }
})
```

**Display in product card:**

```typescript
{product.userUnusedCode && (
  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
    <p className="text-xs text-blue-700 dark:text-blue-300">
      💰 Use code <strong>{product.userUnusedCode.code}</strong> at checkout for extra €{(product.additionalUserSavings / 100).toFixed(2)} off!
    </p>
  </div>
)}
```

---

## The Complete Pricing Hierarchy

**Order of operations:**

1. **Base price** from `productPricing` table (market-specific)
2. **Active sale** applied (if any match product targeting)
3. **User coupon** at checkout (WELCOME10, JOEY15, etc)
4. **Shipping** added
5. **Tax** calculated
6. **Final total**

**Important:** Sales and coupons DON'T stack. User gets whichever is better.

```typescript
// In checkout, you choose best discount:

const saleDiscount = calculateSalePrice(...)
const couponDiscount = await validateDiscountCode(...)

// Use whichever is larger
const finalDiscount = Math.max(saleDiscount, couponDiscount)
```

---

## What You Need To Do Tonight/Tomorrow

### Tonight (Database):
1. **Load product descriptions** from Google Sheets
2. **Add real prices** to `productPricing` table for ROW market
3. **Create 1-2 test sales** in `sales` table:
   ```sql
   INSERT INTO sale (name, slug, discount_code, type, discount_percent, target_type, starts_at, ends_at, is_active)
   VALUES 
   ('Summer Sale', 'summer-2025', 'SUMMER25', 'percentage', 25, 'all', NOW(), NOW() + INTERVAL '30 days', true);
   ```

### Tomorrow (Code):
1. **Add `calculateSalePrice` helper** function
2. **Update product list query** to fetch active sales + calculate sale prices
3. **Update ProductCard component** to show crossed-out prices
4. **Test with real data** - load a category page, see if discounts show

### Day 3 (Polish):
1. **Add sale badge/timer** to product cards (if sale ends soon)
2. **Add user coupon hint** for logged-in first-time buyers
3. **Test full flow**: Add to cart → Checkout → Apply code → Verify price matches

---

## The Brutal Truth

**Why this is painful:**

1. **3 discount systems** that need to coordinate
2. **Market-specific pricing** (ROW vs US)
3. **Product targeting** (some sales only apply to certain categories)
4. **User state** (logged in? first order? has referral code?)
5. **Display everywhere** (product cards, cart, checkout)

**Why you MUST show sale prices on cards:**

- User sees "€49" on card, "€39" at checkout = feels scammed
- Competitor sites show sale prices upfront = you lose sales
- SEO/ads need accurate pricing in rich snippets

**Shortcuts you can take:**

1. **Skip user coupon hints** on product cards initially - only show at checkout
2. **Don't stack discounts** - always use single best one
3. **Assume ROW market** for product listings until you have geo-detection
4. **Hardcode WELCOME10** logic instead of complex promoter tracking

---

## Final Checklist

**Before Launch:**
- [ ] Product prices loaded in DB
- [ ] At least 1 active sale created for testing
- [ ] Product cards show sale prices with strikethrough
- [ ] Cart shows accurate prices
- [ ] Checkout applies discount codes correctly
- [ ] Gift threshold logic works (€1000 = free gift)
- [ ] Webhook updates order status on payment
- [ ] Email confirmation sent (optional for launch)

**You're at 80% done.** The remaining 20% is:
1. Real product data in DB (3 hours)
2. Sale price display on cards (2 hours)
3. Testing full checkout flow (1 hour)
4. Bug fixes from testing (2 hours)

**Total: 8 hours to launch-ready.**

Ship it. Iterate later. Good luck soldier.