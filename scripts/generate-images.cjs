// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Define paths
const contentDir = path.resolve(__dirname, '../content');
const outputFile = path.resolve(__dirname, '../src/images.json');

// Get all image files from the content directory
function getImageFiles() {
  const files = fs.readdirSync(contentDir);
  return files
    .filter(file => /\.(jpg|jpeg)$/i.test(file))
    .map(file => `/content/${file}`);
}

// Generate the images.json file
function generateImagesJson() {
  const imageFiles = getImageFiles();
  fs.writeFileSync(outputFile, JSON.stringify(imageFiles, null, 2));
  console.log(`Generated images.json with ${imageFiles.length} images`);
}

// Run the script
generateImagesJson();
