<script setup lang="ts">
import { computed, ref } from 'vue'
import { seedConcerts, type ConcertEvent, type SaleMode } from '@/data/concerts'
import { formatIDR, formatNumber } from '@/utils/format'
import { useTicketWarStore } from '@/stores/ticketwar'
import PageHeader from '@/components/molecules/PageHeader.vue'
import FilterChips from '@/components/molecules/FilterChips.vue'

const warStore = useTicketWarStore()

const featured = seedConcerts[0]

const MODE_LABEL: Record<SaleMode, string> = {
  war: 'Ticket War',
  ballot: 'Ballot',
  both: 'War + Ballot',
}

type Filter = 'all' | SaleMode
const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'war', label: 'Ticket War' },
  { key: 'ballot', label: 'Ballot' },
  { key: 'both', label: 'War + Ballot' },
]
const activeFilter = ref<Filter>('all')

const list = computed(() =>
  activeFilter.value === 'all'
    ? seedConcerts
    : seedConcerts.filter((c) => c.saleMode === activeFilter.value),
)

function countFor(key: Filter): number {
  return key === 'all' ? seedConcerts.length : seedConcerts.filter((c) => c.saleMode === key).length
}

const filterOptions = computed(() =>
  filters.map((f) => ({ key: f.key, label: f.label, count: countFor(f.key) })),
)

function grad(color: string): string {
  return `linear-gradient(135deg, color-mix(in srgb, ${color} 45%, #000), color-mix(in srgb, ${color} 90%, #000))`
}

function minPrice(c: ConcertEvent): number {
  return Math.round((c.warPrice * 0.3) / 10_000) * 10_000
}

/** "Sabtu, 12 Desember 2026" -> { day, dayNum, month, year } */
function parseDate(d: string) {
  const [dayName, rest] = d.split(', ')
  const [num, month, year] = (rest ?? '').split(' ')
  return { dayName: dayName ?? '', num: num ?? '', month: (month ?? '').slice(0, 3).toUpperCase(), year: year ?? '' }
}
</script>

<template>
  <PageHeader
    title="Konser"
    subtitle="Line-up artis kelas dunia — setiap konser punya metode penjualan tiket berbeda sesuai prediksi traffic."
  />

  <!-- ══ SPOTLIGHT ══ -->
  <RouterLink :to="`/concert/${featured.id}`" class="spot" :style="{ '--c': featured.color }">
    <div class="spot-bg" :style="{ background: grad(featured.color) }"></div>
    <div class="spot-grain"></div>
    <span class="spot-emoji">{{ featured.poster }}</span>

    <div class="spot-body">
      <div class="spot-tags">
        <span class="spot-tag spot-tag-gold">SPOTLIGHT</span>
        <span class="spot-tag">{{ MODE_LABEL[featured.saleMode] }}</span>
      </div>
      <h2 class="spot-artist">{{ featured.artist }}</h2>
      <p class="spot-tour">{{ featured.tour }}</p>
      <div class="spot-meta">
        <span>{{ featured.date }}</span>
        <span>{{ featured.venue }}</span>
      </div>
      <div class="spot-online">
        <i class="spot-dot"></i>
        <b>{{ formatNumber(warStore.onlineUsers) }}</b> penggemar sedang online
      </div>
    </div>

    <div class="spot-side">
      <p class="spot-from">tiket mulai dari</p>
      <p class="spot-price">{{ formatIDR(minPrice(featured)) }}</p>
      <span class="spot-btn">Amankan Tiket</span>
    </div>
  </RouterLink>

  <!-- ══ FILTER ══ -->
  <div class="bar">
    <div class="bar-title">
      <span class="bar-line"></span>
      <h2>Line-up Konser</h2>
      <span class="bar-count">{{ list.length }} event</span>
    </div>
    <FilterChips v-model="activeFilter" :options="filterOptions" />
  </div>

  <!-- ══ LIST ══ -->
  <TransitionGroup name="row" tag="div" class="rows">
    <RouterLink
      v-for="c in list"
      :key="c.id"
      :to="`/concert/${c.id}`"
      class="row"
      :style="{ '--c': c.color }"
    >
      <!-- date block -->
      <div class="row-date" :style="{ background: grad(c.color) }">
        <span class="row-dayname">{{ parseDate(c.date).dayName.slice(0, 3).toUpperCase() }}</span>
        <span class="row-daynum">{{ parseDate(c.date).num }}</span>
        <span class="row-month">{{ parseDate(c.date).month }} {{ parseDate(c.date).year }}</span>
        <span class="row-emoji">{{ c.poster }}</span>
      </div>

      <!-- info -->
      <div class="row-info">
        <span class="row-mode">{{ MODE_LABEL[c.saleMode] }}</span>
        <h3 class="row-artist">{{ c.artist }}</h3>
        <p class="row-tour">{{ c.tour }}</p>
        <p class="row-venue">{{ c.venue }}</p>
      </div>

      <!-- perforation -->
      <div class="row-perf" aria-hidden="true"></div>

      <!-- price / cta -->
      <div class="row-end">
        <p class="row-from">mulai dari</p>
        <p class="row-price">{{ formatIDR(minPrice(c)) }}</p>
        <span class="row-btn">Lihat Detail</span>
      </div>
    </RouterLink>
  </TransitionGroup>

  <p v-if="!list.length" class="empty">Belum ada konser untuk kategori ini.</p>
</template>

<style scoped lang="scss" src="@/assets/styles/pages/concerts.scss"></style>
