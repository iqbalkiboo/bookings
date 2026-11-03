<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { navItems } from '@/router/navigation'
</script>

<template>
  <header class="navbar">
    <div class="pixel-divider navbar-line"></div>

    <div class="container-tix navbar-inner">
      <RouterLink to="/" class="logo-brand">
        <div class="logo-icon">
          <span>🎫</span>
        </div>
        <div class="logo-text">
          <span class="logo-tix">TIX</span>
          <span class="logo-sub">ROBLOX EDITION</span>
        </div>
      </RouterLink>

      <nav class="navbar-links" aria-label="Menu utama">
        <RouterLink v-for="item in navItems" :key="item.to" class="nav-link" :to="item.to">
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/nav-bar.scss"></style>

