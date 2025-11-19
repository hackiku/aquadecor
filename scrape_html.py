import re
from bs4 import BeautifulSoup
import json
import os

# --- Configuration ---
INPUT_FILE = os.path.join(os.getcwd(), 'public', 'scrape', 'rocks.html')
OUTPUT_DIR = os.path.join(os.getcwd(), 'src', 'server', 'db', 'seed', 'data', 'aquarium-decorations')
# OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'driftwood-logs-roots.ts')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'loose-aquarium-rocks.ts')

# Fixed Metadata based on the Category ID
CATEGORY_ID = "driftwood-logs-roots" 
BASE_PRICE_EUR_CENTS = 8900 # Estimate, D models are usually sets > €49
STOCK_STATUS = "made_to_order"
PRICE_NOTE = "Custom made set - Production takes 10-12 business days"
SORT_ORDER_START = 100 # Starting point for D models

# --- Utility Functions ---

def slugify(text):
    """Converts text into a URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text) # Remove non-alphanumeric chars
    text = re.sub(r'[-\s]+', '-', text).strip('-') # Collapse spaces and dashes
    return text

def parse_html_to_json(html_content):
    """Parses the HTML content and extracts product data."""
    soup = BeautifulSoup(html_content, 'html.parser')
    product_cards = soup.find_all('div', class_=lambda c: c and 'group flex h-full' in c)
    
    products_data = []
    
    for i, card in enumerate(product_cards):
        
        # 1. Extract Title, Name, SKU
        title_element = card.find('h3', class_='font-semibold')
        full_name = title_element.get_text(strip=True) if title_element else f"Unknown Product {i+1}"
        
        # Determine SKU (e.g., "D 1") and base name ("Standing roots")
        match_sku = re.match(r'(D \d+ Plus|D \d+)(?:\s+-\s+)?(.*)', full_name)
        if match_sku:
            sku_raw = match_sku.group(1).replace(' ', '') # D 1 -> D1
            name_suffix = match_sku.group(2).strip()
        else:
            sku_raw = f"D{i + 1}"
            name_suffix = full_name
            
        sku = sku_raw.upper()
        
        # Create unique ID (must be unique across all products)
        product_id = slugify(f"{sku_raw} {name_suffix}") 
        product_slug = slugify(full_name)
        
        # 2. Extract Description
        description_element = card.find('p', class_='text-muted-foreground')
        full_description = description_element.get_text(strip=True).replace('\n', ' ') if description_element else ""
        
        # 3. Extract Image URL
        image_element = card.find('img')
        image_src = image_element.get('src') if image_element else ""
        
        # Note: We are ignoring the 'shortDescription' for now, using a default.
        
        product = {
            "id": product_id,
            "categoryId": CATEGORY_ID,
            "slug": product_slug,
            "sku": sku,
            "basePriceEurCents": BASE_PRICE_EUR_CENTS,
            "priceNote": PRICE_NOTE,
            "specifications": {
                # We can add initial data here if it can be scraped, e.g., max height 70cm for D1/D2
                "featuredImage": image_src # Storing the CDN URL temporarily here
            },
            "stockStatus": STOCK_STATUS,
            "isActive": True,
            "isFeatured": False,
            "sortOrder": SORT_ORDER_START + i,
            "translations": {
                "en": {
                    "name": full_name,
                    "shortDescription": f"{sku} Model: {name_suffix}. Set available.",
                    "fullDescription": full_description,
                },
            },
        }
        products_data.append(product)
        
    return products_data

def format_as_typescript(data):
    """Formats the list of dictionaries into a TypeScript export string."""
    ts_export = "// src/server/db/seed/data/aquarium-decorations/driftwood-logs-roots.ts\n\n"
    ts_export += "// Note: The 'featuredImage' in specifications is a temporary field to hold the CDN URL.\n"
    ts_export += "export const productData = [\n"
    
    # Use json.dumps for safe representation, then post-process for TS structure
    for item in data:
        # Dump to JSON string, indenting for readability
        json_str = json.dumps(item, indent=4)
        
        # Replace JSON null with JS null
        json_str = json_str.replace("null", "null")
        
        # Remove surrounding quotes from keys (already ensured in Python dict)
        
        ts_export += json_str
        ts_export += ",\n"
        
    ts_export += "];\n"
    return ts_export

# --- Execution ---

if __name__ == "__main__":
    if not os.path.exists(INPUT_FILE):
        print(f"Error: Input file not found at {INPUT_FILE}")
    else:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            html_content = f.read()

        product_list = parse_html_to_json(html_content)
        ts_output = format_as_typescript(product_list)
        
        # Ensure output directory exists
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(ts_output)
            
        print(f"\n✅ Successfully extracted {len(product_list)} products.")
        print(f"File created/updated at {OUTPUT_FILE}")