<script setup lang="ts">
import NavBar from '@/components/organisms/NavBar.vue'
import BottomNav from '@/components/organisms/BottomNav.vue'
import AppFooter from '@/components/organisms/AppFooter.vue'
</script>

<template>
  <div class="main-layout">
    <NavBar />

    <main class="container-tix main-layout-content">
      <slot />
    </main>

    <AppFooter />
    <BottomNav />
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/templates/main-layout.scss"></style>

