const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Define paths
const contentDir = path.resolve(__dirname, '../content')
const outputFile = path.resolve(__dirname, '../src/images.json')

// Get all image files with dimensions from the content directory
async function getImageFiles() {
  const files = fs.readdirSync(contentDir)
  const imageFiles = files.filter((file) => /\.(jpg|jpeg)$/i.test(file))

  const imageData = await Promise.all(
    imageFiles.map(async (file) => {
      const filePath = path.join(contentDir, file)
      const metadata = await sharp(filePath).metadata()
      return {
        src: `/content/${file}`,
        width: metadata.width,
        height: metadata.height,
        title: 'Photo of Hazuki Handa',
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
