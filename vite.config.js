import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      injectRegister: false,
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        id: '/',
        name: 'Daily Balance',
        short_name: 'Balance',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'en',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      // Final, robust workbox configuration
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [{
          urlPattern: ({ url }) => url.origin === self.location.origin,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'assets',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 7 Days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }]
      }
    })
  ]
});