const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Define paths
const contentDir = path.resolve(__dirname, '../content')
const outputFile = path.resolve(__dirname, '../src/images.json')

// Photos are served straight from content/, except PNGs: the build re-encodes
// those to lossless WebP (vite-plugin-compress.ts), so the gallery has to point
// at the .webp the plugin actually writes.
function servedName(file) {
  return file.replace(/\.png$/i, '.webp')
}

// Get all image files with dimensions from the content directory
async function getImageFiles() {
  const files = fs.readdirSync(contentDir)
  const imageFiles = files.filter((file) => /\.(jpe?g|png)$/i.test(file))

  const imageData = await Promise.all(
    imageFiles.map(async (file) => {
      const metadata = await sharp(path.join(contentDir, file)).metadata()
      return {
        src: `/content/${servedName(file)}`,
        width: metadata.width,
        height: metadata.height,
      }
    }),
  )

  return imageData
}

// Generate the images.json file
async function generateImagesJson() {
  const imageFiles = await getImageFiles()
  fs.writeFileSync(outputFile, JSON.stringify(imageFiles, null, 2))
  console.log(`Generated images.json with ${imageFiles.length} images`)
}

// Run the script
generateImagesJson()
