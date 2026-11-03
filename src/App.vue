<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLayout from '@/components/templates/MainLayout.vue'
</script>

<template>
<<<<<<< HEAD
  <MainLayout>
    <RouterView />
  </MainLayout>
=======
  <div class="flex min-h-screen flex-col">
    <!-- ── NAVBAR ── -->
    <header class="roblox-navbar sticky top-0 z-50">
      <div class="pixel-divider" style="height:2px; position:absolute; top:0; left:0; right:0;"></div>

      <div class="container-tix flex flex-col items-stretch justify-between gap-2 py-3 sm:flex-row sm:items-center">
        <!-- Logo -->
        <RouterLink to="/" class="logo-brand" style="text-decoration:none;">
          <div class="logo-icon">
            <span style="font-size:1.1rem;">🎫</span>
          </div>
          <div class="logo-text">
            <span class="logo-tix">TIX</span>
            <span class="logo-sub">ROBLOX EDITION</span>
          </div>
        </RouterLink>

        <!-- Nav -->
        <nav class="flex justify-center gap-1">
          <RouterLink class="nav-link" to="/">
            Beranda
          </RouterLink>
          <RouterLink class="nav-link" to="/movies">
            Bioskop
          </RouterLink>
          <RouterLink class="nav-link" to="/concerts">
            Konser
          </RouterLink>
          <RouterLink class="nav-link" to="/tickets">
            Tiket Saya
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- ── MAIN ── -->
    <main class="container-tix flex-1 py-6 pb-16">
      <RouterView />
    </main>

    <!-- ── FOOTER ── -->
    <footer class="roblox-footer">
      <div class="pixel-divider" style="height:2px; margin-bottom:16px;"></div>
      <div class="container-tix text-center">
        <p style="font-size:0.75rem; color:var(--color-muted); font-weight:700; letter-spacing:0.05em;">
          TIX ROBLOX EDITION &nbsp;·&nbsp; Vue 3 + TypeScript + Pinia
          &nbsp;·&nbsp; <span style="color:var(--color-primary);">DEMO MODE</span>
        </p>
        <p style="font-size:0.65rem; color:var(--color-line); margin-top:4px; letter-spacing:0.03em;">
          © 2026 — Built for fun, not affiliation with Roblox Corporation
        </p>
      </div>
    </footer>
  </div>
>>>>>>> 46bdccfccc9a8ca29d927e97dca8ddf2462dc074
</template>
