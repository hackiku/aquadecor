#!/bin/zsh

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}🌍 Setting up i18n message structure...${NC}"

# Create base directories
mkdir -p src/messages/{en,de,nl,it,us}

# Define namespaces
NAMESPACES=(
  "common"
  "home"
  "shop"
  "product"
  "cart"
  "checkout"
  "setup"
  "calculator"
  "about"
  "blog"
  "legal"
)

# Function to create a valid empty JSON structure
create_json_file() {
  local locale=$1
  local namespace=$2
  local filepath="src/messages/${locale}/${namespace}.json"
  
  # Create file with basic empty structure
  cat > "$filepath" << EOF
{
  "${namespace}": {
    "placeholder": "Translations for ${namespace} in ${locale}"
  }
}
EOF
  
  echo "${GREEN}✓${NC} Created: $filepath"
}

# Generate files for each locale
for locale in en de nl it us; do
  echo "\n${BLUE}Creating files for locale: ${locale}${NC}"
  for namespace in "${NAMESPACES[@]}"; do
    create_json_file "$locale" "$namespace"
  done
done

echo "\n${GREEN}✨ Done! Created $(ls -1 src/messages/*/*.json | wc -l | xargs) message files${NC}"
echo "\n${BLUE}Structure:${NC}"
tree src/messages -L 2

echo "\n${BLUE}Next steps:${NC}"
echo "1. Update src/i18n/request.ts to load these namespaces"
echo "2. Start filling in en/*.json files"
echo "3. Use AI to blast translations into other locales"