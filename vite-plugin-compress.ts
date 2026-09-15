import { join, resolve } from 'path'
import { readdir, stat, unlink, writeFile } from 'fs/promises'
import sharp from 'sharp'
import type { Plugin } from 'vite'

const batchSize = 50

const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)
const savedPct = (from: number, to: number) => (from === 0 ? '0.0' : (((from - to) / from) * 100).toFixed(1))

async function inBatches(files: string[], run: (file: string) => Promise<void>) {
  for (let i = 0; i < files.length; i += batchSize) {
    await Promise.all(files.slice(i, i + batchSize).map(run))
  }
}

/**
 * Re-encode every JPEG in place with mozjpeg q80.
 */
async function optimizeJpeg(contentDir: string, files: string[]) {
  const targets = files.filter((f) => /\.jpe?g$/i.test(f))
  if (targets.length === 0) {
    console.log('[image-optimizer] No JPEG files found')
    return
  }

  console.log(`[image-optimizer] Optimizing ${targets.length} JPEG images...`)

  let original = 0
  let optimized = 0
  let processed = 0

  await inBatches(targets, async (file) => {
    const filePath = join(contentDir, file)
    try {
      const originalSize = (await stat(filePath)).size
      const buffer = await sharp(filePath)
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toBuffer()

      if (buffer.length < originalSize) {
        // Write the encoded bytes verbatim. sharp(buffer).toFile() decodes and
        // re-encodes them with default settings, handing back a file ~17% larger
        // than the buffer we just measured — the reported savings never shipped.
        await writeFile(filePath, buffer)
        original += originalSize
        optimized += buffer.length
      } else {
        original += originalSize
        optimized += originalSize
      }

      processed++
      if (processed % 200 === 0) {
        console.log(`[image-optimizer] Processed ${processed}/${targets.length}`)
      }
    } catch (err) {
      console.error(`[image-optimizer] Error processing ${file}:`, err)
    }
  })

  console.log(`[image-optimizer] jpeg: ${mb(original)}MB -> ${mb(optimized)}MB (-${savedPct(original, optimized)}%)`)
}

/**
 * Photos that arrive as PNG are losslessly re-encoded to WebP: no palette
 * quantisation, no quality knob, so the decoded pixels stay bit-identical.
 * PNG itself cannot be improved much losslessly (re-encoding at max compression
 * actually grows these files), which is why the container changes.
 */
async function convertPngToWebp(contentDir: string, files: string[]) {
  const targets = files.filter((f) => /\.png$/i.test(f))
  if (targets.length === 0) {
    console.log('[image-optimizer] No PNG files found')
    return
  }

  console.log(`[image-optimizer] Converting ${targets.length} PNG images to lossless WebP...`)

  let original = 0
  let optimized = 0
  let converted = 0
  let kept = 0

  await inBatches(targets, async (file) => {
    const filePath = join(contentDir, file)
    try {
      const originalSize = (await stat(filePath)).size
      const buffer = await sharp(filePath).webp({ lossless: true, effort: 6 }).toBuffer()

      if (buffer.length >= originalSize) {
        original += originalSize
        optimized += originalSize
        kept++
        return
      }

      await writeFile(`${filePath.slice(0, -'.png'.length)}.webp`, buffer)
      await unlink(filePath)
      original += originalSize
      optimized += buffer.length
      converted++
    } catch (err) {
      console.error(`[image-optimizer] Error processing ${file}:`, err)
    }
  })

  const note = kept > 0 ? `, kept ${kept} as png (no gain)` : ''
  console.log(
    `[image-optimizer] png->webp: ${mb(original)}MB -> ${mb(optimized)}MB ` +
      `(-${savedPct(original, optimized)}%), ${converted} converted${note}`,
  )
}

export function imageOptimizerPlugin(): Plugin {
  let outDir: string

  return {
    name: 'image-optimizer',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const contentDir = join(outDir, 'content')

      let files: string[]
      try {
        files = await readdir(contentDir)
      } catch {
        console.log('[image-optimizer] No content directory found, skipping')
        return
      }

      await optimizeJpeg(contentDir, files)
      await convertPngToWebp(contentDir, files)
    },
  }
}
