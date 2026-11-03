import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
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
