<script setup lang="ts">
import { computed } from 'vue'
import type { Movie } from '@/types/ticketing'
import { formatIDR } from '@/utils/format'
import BaseBadge from '@/components/ui/BaseBadge.vue'

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

<style scoped>
.movie-card {
  display: flex;
  gap: 0.85rem;
  border-radius: 14px;
  border: 2px solid var(--color-line);
  background: var(--color-surface);
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}
.movie-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(227,0,27,0.03) 0%, transparent 60%);
  pointer-events: none;
}
.movie-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 16px rgba(227,0,27,0.25), 0 4px 20px rgba(0,0,0,0.4);
  transform: translateY(-2px);
}
.movie-card--selected {
  border-color: var(--color-primary) !important;
  background: var(--color-surface-alt);
  box-shadow: 0 0 20px rgba(227,0,27,0.35), 0 4px 20px rgba(0,0,0,0.5);
}
.movie-selected-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 28px 28px 0;
  border-color: transparent var(--color-primary) transparent transparent;
}
.movie-poster {
  width: 72px;
  height: 104px;
  flex-shrink: 0;
  border-radius: 10px;
  display: grid;
  place-items: center;
  overflow: hidden;
  position: relative;
}
.movie-poster-emoji {
  font-size: 2.5rem;
  position: relative;
  z-index: 1;
}
.movie-poster-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
}
.movie-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}
.movie-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.movie-meta {
  font-size: 0.78rem;
  color: var(--color-muted);
  font-weight: 600;
}
.movie-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
}
.movie-price {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(227,0,27,0.4);
}
</style>
