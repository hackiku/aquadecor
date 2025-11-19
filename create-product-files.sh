#!/bin/zsh
# Set the base directory for seed data (relative to project root)
BASE_DIR="src/server/db/seed/data"

# 1. Clean up old/placeholder files first (DANGER: Only run this if the files are empty or contain only old placeholders)
rm -rf "$BASE_DIR/3d-backgrounds"
rm -rf "$BASE_DIR/aquarium-decorations"
rm -f "$BASE_DIR/products.ts" # We are retiring the monolithic products.ts file

# Define all the new modular data files
FILES=(
    "3d-backgrounds/classic-rock-backgrounds.ts"
    "3d-backgrounds/slim-rock-backgrounds.ts"
    "3d-backgrounds/amazon-tree-trunks.ts"
    "aquarium-decorations/aquarium-plants.ts"
    "aquarium-decorations/loose-aquarium-rocks.ts"
    "aquarium-decorations/driftwood-logs-roots.ts"
    "aquarium-decorations/artificial-reefs.ts"
    "aquarium-decorations/rubber-protection-mats.ts"
    "aquarium-decorations/magnetic-rocks.ts"
    "aquarium-decorations/back-panel-roots.ts"
    "aquarium-decorations/centerpiece-decorations.ts"
    "aquarium-decorations/aquascaping-starter-sets.ts"
)

echo "Creating modular product data files with descriptive names in $BASE_DIR..."

for FILE in "${FILES[@]}"; do
    # 2. Ensure the subdirectory exists
    mkdir -p "$(dirname "$BASE_DIR/$FILE")"
    
    # 3. Define the boilerplate content with correct path comment
    COMMENT="// src/server/db/seed/data/$FILE"
    CONTENT="$COMMENT\n\nimport type { Product } from '~/server/db/schema'; // Assume type import is needed for large arrays\n\nexport const productData = [\n];"
    
    # 4. Write content to file
    echo -e "$CONTENT" > "$BASE_DIR/$FILE"
    echo "Created: $FILE"
done

echo -e "\nSetup complete. Remember to update the seed.ts file to import and process all these new files."