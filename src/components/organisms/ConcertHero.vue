<script setup lang="ts">
import type { ConcertEvent } from '@/data/concerts'
import { formatNumber } from '@/utils/format'

defineProps<{
  concert: ConcertEvent
  showWar: boolean
  showBallot: boolean
  onlineUsers: number
  stock: number
}>()
</script>

<template>
  <div class="cd-hero" :style="{ '--c-color': concert.color }">
    <span class="cd-emoji">{{ concert.poster }}</span>

    <div class="cd-main">
      <RouterLink to="/concerts" class="cd-back">Semua Konser</RouterLink>
      <div class="cd-tags">
        <span class="cd-tag cd-tag--gold">KONSER</span>
        <span v-if="showWar" class="cd-tag">TICKET WAR</span>
        <span v-if="showBallot" class="cd-tag">BALLOT</span>
      </div>
      <h1 class="cd-artist">{{ concert.artist }}</h1>
      <p class="cd-tour">{{ concert.tour }}</p>

      <div class="cd-info">
        <div class="cd-chip">
          <span><small>TANGGAL</small><b>{{ concert.date }}</b></span>
        </div>
        <div class="cd-chip">
          <span><small>LOKASI</small><b>{{ concert.venue }}</b></span>
        </div>
      </div>
    </div>

    <div class="cd-stats">
      <div class="cd-stat">
        <strong class="cd-stat-value">{{ formatNumber(onlineUsers) }}</strong>
        <span class="cd-stat-label cd-live"><i></i> online</span>
      </div>
      <div v-if="showWar" class="cd-stat">
        <strong class="cd-stat-value cd-stat-value--gold">{{ formatNumber(stock) }}</strong>
        <span class="cd-stat-label">tiket tersisa</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/concert-hero.scss"></style>

