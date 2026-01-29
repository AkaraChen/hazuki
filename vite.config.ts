import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'

function imageOptimizerPlugin(): Plugin {
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

      const jpgFiles = files.filter((f) => /\.(jpe?g)$/i.test(f))
      if (jpgFiles.length === 0) {
        console.log('[image-optimizer] No JPEG files found')
        return
      }

      console.log(`[image-optimizer] Optimizing ${jpgFiles.length} images...`)

      let totalOriginal = 0
      let totalOptimized = 0
      let processed = 0

      const batchSize = 50
      for (let i = 0; i < jpgFiles.length; i += batchSize) {
        const batch = jpgFiles.slice(i, i + batchSize)

        await Promise.all(
          batch.map(async (file) => {
            const filePath = join(contentDir, file)
            try {
              const originalStats = await stat(filePath)
              const originalSize = originalStats.size

              const buffer = await sharp(filePath)
                .jpeg({ quality: 80, progressive: true, mozjpeg: true })
                .toBuffer()

              if (buffer.length < originalSize) {
                await sharp(buffer).toFile(filePath)
                totalOriginal += originalSize
                totalOptimized += buffer.length
              } else {
                totalOriginal += originalSize
                totalOptimized += originalSize
              }

              processed++
              if (processed % 200 === 0) {
                console.log(`[image-optimizer] Processed ${processed}/${jpgFiles.length}`)
              }
            } catch (err) {
              console.error(`[image-optimizer] Error processing ${file}:`, err)
            }
          }),
        )
      }

      const savedMB = ((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(1)
      const savedPercent = (((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)
      console.log(`[image-optimizer] Done! Saved ${savedMB}MB (${savedPercent}% reduction)`)
      console.log(
        `[image-optimizer] ${(totalOriginal / 1024 / 1024).toFixed(1)}MB -> ${(totalOptimized / 1024 / 1024).toFixed(1)}MB`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return ['github-corners'].includes(tag)
          },
        },
      },
    }),
    vueJsx(),
    vueDevTools(),
    viteStaticCopy({
      targets: [
        {
          src: 'content/*',
          dest: 'content',
        },
      ],
    }),
    imageOptimizerPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
  },
})
