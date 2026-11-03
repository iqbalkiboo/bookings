import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true, // mengekspos ke IP local network (0.0.0.0) agar bisa diakses dari HP/device lain
    port: 5173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // variabel & mixin global tersedia di semua <style lang="scss">
        loadPaths: [fileURLToPath(new URL('./src/assets/scss', import.meta.url))],
        additionalData: '@use "index" as *;',
      },
    },
  },
})
