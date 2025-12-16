import fs from 'fs';
import path from 'path';
import https from 'https';

// Configuration
const ROOTS = [
  '../src/server/db/seed/data/productLines/3d-backgrounds',
  '../src/server/db/seed/data/productLines/aquarium-decorations'
];

// Helper to download a file
const downloadFile = (url: string, dest: string) => {
  return new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to consume ${url}: Status Code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file async. (But we don't check the result)
      reject(err);
    });
  });
};

// Helper to extract data from the raw TS file content text
// We do this via Regex to avoid compiling the Typescript project or dealing with imports
const extractMediaFromText = (content: string) => {
  const items: { slug: string; url: string }[] = [];
  
  // Split the content by object blocks to ensure we keep slug/url pairs together
  const objectBlocks = content.split('},');

  for (const block of objectBlocks) {
    // Regex to find productSlug (quotes or no quotes)
    const slugMatch = block.match(/['"]?productSlug['"]?\s*:\s*["']([^"']+)["']/);
    // Regex to find storageUrl
    const urlMatch = block.match(/['"]?storageUrl['"]?\s*:\s*["']([^"']+)["']/);

    if (slugMatch && urlMatch) {
      items.push({
        slug: slugMatch[1],
        url: urlMatch[1]
      });
    }
  }

  return items;
};

// Recursive function to find media.ts files
const walkDir = async (dir: string) => {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      await walkDir(filePath);
    } else if (file === 'media.ts') {
      console.log(`\n📂 Found media.ts in: ${dir}`);
      await processMediaFile(filePath, dir);
    }
  }
};

const processMediaFile = async (filePath: string, dirPath: string) => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const mediaItems = extractMediaFromText(content);

    if (mediaItems.length === 0) {
      console.log(`   ⚠️  No items found in ${filePath}`);
      return;
    }

    console.log(`   ⬇️  Downloading ${mediaItems.length} images...`);

    for (const item of mediaItems) {
      // Determine extension from URL (default to .webp if missing)
      const ext = path.extname(item.url) || '.webp';
      
      // Clean the slug to be a valid filename
      const cleanSlug = item.slug.replace(/[^a-z0-9-]/gi, '_');
      
      // Construct filename: dir/slug.extension
      const fileName = `${cleanSlug}${ext}`;
      const savePath = path.join(dirPath, fileName);

      // Check if file exists to avoid re-downloading
      if (fs.existsSync(savePath)) {
        // console.log(`      ⏭️  Skipping (exists): ${fileName}`);
        continue;
      }

      try {
        await downloadFile(item.url, savePath);
        console.log(`      ✅ Saved: ${fileName}`);
      } catch (err) {
        console.error(`      ❌ Error downloading ${item.slug}:`, err);
      }
    }
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
  }
};

// Main execution
(async () => {
  const scriptDir = __dirname;
  
  console.log("🚀 Starting Image Downloader...");

  for (const relativeRoot of ROOTS) {
    const rootPath = path.resolve(scriptDir, relativeRoot);
    if (fs.existsSync(rootPath)) {
      await walkDir(rootPath);
    } else {
      console.error(`❌ Directory not found: ${rootPath}`);
    }
  }

  console.log("\n✨ All done!");
})();