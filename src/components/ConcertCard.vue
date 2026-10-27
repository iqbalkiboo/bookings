<script setup lang="ts">
import { computed } from 'vue'
import type { ConcertEvent, SaleMode } from '@/data/concerts'
import { formatIDR } from '@/utils/format'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const props = defineProps<{
  concert: ConcertEvent
  featured?: boolean
}>()

const MODE_LABEL: Record<SaleMode, string> = {
  war: '⚡ Ticket War',
  ballot: '🎟️ Ballot',
  both: '⚡ War + 🎟️ Ballot',
}

/** Gradasi elegan: warna konser di-mix dengan hitam agar menyatu dgn dark theme */
const gradient = computed(() =>
  `linear-gradient(150deg, color-mix(in srgb, ${props.concert.color} 55%, #000), color-mix(in srgb, ${props.concert.color} 90%, #000))`,
)

const minPrice = computed(
  () => Math.round((props.concert.warPrice * 0.3) / 10_000) * 10_000,
)
</script>

<template>
  <RouterLink :to="`/concert/${concert.id}`" class="block no-underline">
    <BaseCard hover class="group h-full">
      <!-- panel poster -->
      <div
        class="relative grid h-24 place-items-center overflow-hidden"
        :style="{ background: gradient }"
      >
        <!-- radial glow lembut di belakang emoji -->
        <span
          class="pointer-events-none absolute h-24 w-24 rounded-full opacity-40 blur-2xl"
          :style="{ background: concert.color }"
        ></span>
        <span class="relative text-4xl drop-shadow-lg transition duration-300 group-hover:scale-110">
          {{ concert.poster }}
        </span>
        <BaseBadge class="absolute top-2 right-2" tone="white">
          {{ MODE_LABEL[concert.saleMode] }}
        </BaseBadge>
      </div>

      <!-- konten -->
      <div class="flex flex-col gap-1 p-4">
        <h3 class="text-lg font-extrabold text-heading">{{ concert.artist }}</h3>
        <p class="text-[0.68rem] font-bold tracking-[0.18em] text-muted uppercase">
          {{ concert.tour }}
        </p>
        <p class="mt-1.5 text-xs text-muted">🗓️ {{ concert.date }}</p>
        <p class="text-xs text-muted">📍 {{ concert.venue }}</p>

        <div class="mt-3 flex items-center justify-between border-t border-line pt-2.5">
          <div>
            <p class="text-[0.62rem] tracking-wider text-muted uppercase">mulai dari</p>
            <p class="text-sm font-extrabold text-primary">{{ formatIDR(minPrice) }}</p>
          </div>
          <span class="text-xs font-bold text-primary transition group-hover:text-accent">
            Detail →
          </span>
        </div>
      </div>
    </BaseCard>
  </RouterLink>
</template>
