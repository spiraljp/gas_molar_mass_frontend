import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = mode === 'pages' ? '/gas_molar_mass_frontend/' : '/'
  const https = mode === 'https' ? {
    key: readFileSync('.certs/localhost-key.pem'),
    cert: readFileSync('.certs/localhost.pem'),
  } : undefined
  const apiTarget = env.API_TARGET || 'http://127.0.0.1:8000'
  const proxy = {
    '/api': { target: apiTarget, changeOrigin: true },
    '/s3': {
      target: env.S3_TARGET || 'http://127.0.0.1:9000',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/s3/, ''),
    },
    '/backend': {
      target: apiTarget, changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/backend/, ''),
    },
  }
  return {
    base,
    plugins: [react(), VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Каталог газов', short_name: 'Газы', lang: 'ru',
        start_url: base, scope: base, display: 'standalone',
        theme_color: '#245f92', background_color: '#f1f1f3',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        // Cache static app files only; never cache API responses or auth sessions.
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [/^\/api\//, /^\/s3\//, /^\/backend\//],
      },
    })],
    server: { host: '0.0.0.0', port: 5173, strictPort: true, https, proxy },
    preview: { host: '0.0.0.0', port: 4173, strictPort: true, https, proxy },
  }
})
