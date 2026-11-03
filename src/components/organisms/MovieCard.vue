<script setup lang="ts">
import { computed } from 'vue'
import type { Movie } from '@/types/ticketing'
import { formatIDR } from '@/utils/format'
import BaseBadge from '@/components/atoms/BaseBadge.vue'

const props = defineProps<{
  movie: Movie
  selected?: boolean
}>()

defineEmits<{ select: [] }>()

const RATING_TONE: Record<string, 'green' | 'blue' | 'red' | 'slate'> = {
  SU: 'green',
  '13+': 'blue',
  '17+': 'red',
}

const minPrice = computed(() => Math.min(...props.movie.showtimes.map((s) => s.price)))
</script>

<template>
  <article
    class="movie-card"
    :class="{ 'movie-card--selected': selected }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter="$emit('select')"
  >
    <div class="movie-poster" :style="{ background: movie.color }">
      <span class="movie-poster-emoji">{{ movie.poster }}</span>
      <div class="movie-poster-shine"></div>
    </div>

    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p class="movie-meta">{{ movie.genre }} · {{ movie.duration }} menit · {{ movie.studio }}</p>

      <div class="movie-footer">
        <BaseBadge :tone="RATING_TONE[movie.rating] ?? 'slate'">{{ movie.rating }}</BaseBadge>
        <span class="movie-price">mulai {{ formatIDR(minPrice) }}</span>
      </div>
    </div>

    <div v-if="selected" class="movie-selected-indicator"></div>
  </article>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/movie-card.scss"></style>
