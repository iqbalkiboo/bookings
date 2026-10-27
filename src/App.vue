<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
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
</template>

<style scoped>
/* ── Navbar ── */
.roblox-navbar {
  background: rgba(13, 14, 17, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-line);
  position: relative;
}

/* ── Logo ── */
.logo-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  justify-content: center;
}

.logo-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #e3001b, #a80014);
  display: grid;
  place-items: center;
  box-shadow: 0 0 14px rgba(227,0,27,0.6);
  flex-shrink: 0;
  border: 1px solid rgba(255,80,80,0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.logo-tix {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.95rem;
  color: var(--color-heading);
  letter-spacing: 0.08em;
  line-height: 1;
  text-shadow: 0 0 10px rgba(227,0,27,0.5);
}

.logo-sub {
  font-size: 0.5rem;
  color: var(--color-primary);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  line-height: 1;
}

/* ── Footer ── */
.roblox-footer {
  padding: 1.25rem 0 1.5rem;
  background: var(--color-surface);
  border-top: 1px solid var(--color-line);
}
</style>
