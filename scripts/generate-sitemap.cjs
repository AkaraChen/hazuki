const fs = require('node:fs')
const path = require('node:path')

const SITE_URL = 'https://hazuki.akr.moe'

const contentDir = path.resolve(__dirname, '../content')
const outputFile = path.resolve(__dirname, '../public/sitemap.xml')

function getImageFiles() {
  const files = fs.readdirSync(contentDir)
  return files.filter((file) => /\.(jpg|jpeg)$/i.test(file))
}

function generateSitemap() {
  const imageFiles = getImageFiles()
  const today = new Date().toISOString().split('T')[0]

  const imageEntries = imageFiles
    .map(
      (file) => `    <image:image>
      <image:loc>${SITE_URL}/content/${file}</image:loc>
      <image:title>Photo of Hazuki Handa</image:title>
    </image:image>`,
    )
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
${imageEntries}
  </url>
</urlset>
`

  fs.writeFileSync(outputFile, sitemap)
  console.log(`Generated sitemap.xml with ${imageFiles.length} images`)
}

generateSitemap()
