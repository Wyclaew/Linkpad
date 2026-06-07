import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const isElectron = process.env.ELECTRON === 'true';

export default defineConfig({
  // For Electron: './' | For GitHub Pages: '/linkpad/' (change to your repo name)
  base: isElectron ? './' : (process.env.BASE_URL || './'),
  plugins: [
    react(),
    // PWA only for web builds
    ...(isElectron ? [] : [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
        manifest: {
          name: 'LinkPad',
          short_name: 'LinkPad',
          description: 'Your personal bookmark manager',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          start_url: '.',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            { urlPattern: /^https:\/\/fonts\.googleapis\.com/, handler: 'StaleWhileRevalidate', options: { cacheName: 'google-fonts-stylesheets' } },
            { urlPattern: /^https:\/\/fonts\.gstatic\.com/, handler: 'CacheFirst', options: { cacheName: 'google-fonts-webfonts', expiration: { maxEntries: 10, maxAgeSeconds: 365*24*60*60 } } },
            { urlPattern: /^https:\/\/www\.google\.com\/s2\/favicons/, handler: 'CacheFirst', options: { cacheName: 'favicons', expiration: { maxEntries: 200, maxAgeSeconds: 7*24*60*60 } } },
          ],
        },
      }),
    ]),
  ],
});
