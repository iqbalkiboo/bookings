<script setup lang="ts">
import { computed, ref } from 'vue'
import { seedConcerts, type ConcertEvent, type SaleMode } from '@/data/concerts'
import { formatIDR, formatNumber } from '@/utils/format'
import { useTicketWarStore } from '@/stores/ticketwar'
import PageHeader from '@/components/ui/PageHeader.vue'

const warStore = useTicketWarStore()

const featured = seedConcerts[0]

const MODE_LABEL: Record<SaleMode, string> = {
  war: '⚡ Ticket War',
  ballot: '🎟️ Ballot',
  both: '⚡ War + 🎟️ Ballot',
}

type Filter = 'all' | SaleMode
const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'war', label: '⚡ Ticket War' },
  { key: 'ballot', label: '🎟️ Ballot' },
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
    title="🎤 Konser"
    subtitle="Line-up artis kelas dunia — setiap konser punya metode penjualan tiket berbeda sesuai prediksi traffic."
  />

  <!-- ══ SPOTLIGHT ══ -->
  <RouterLink :to="`/concert/${featured.id}`" class="spot" :style="{ '--c': featured.color }">
    <div class="spot-bg" :style="{ background: grad(featured.color) }"></div>
    <div class="spot-grain"></div>
    <span class="spot-emoji">{{ featured.poster }}</span>

    <div class="spot-body">
      <div class="spot-tags">
        <span class="spot-tag spot-tag-gold">✨ SPOTLIGHT</span>
        <span class="spot-tag">{{ MODE_LABEL[featured.saleMode] }}</span>
      </div>
      <h2 class="spot-artist">{{ featured.artist }}</h2>
      <p class="spot-tour">{{ featured.tour }}</p>
      <div class="spot-meta">
        <span>🗓️ {{ featured.date }}</span>
        <span>📍 {{ featured.venue }}</span>
      </div>
      <div class="spot-online">
        <i class="spot-dot"></i>
        <b>{{ formatNumber(warStore.onlineUsers) }}</b> penggemar sedang online
      </div>
    </div>

    <div class="spot-side">
      <p class="spot-from">tiket mulai dari</p>
      <p class="spot-price">{{ formatIDR(minPrice(featured)) }}</p>
      <span class="spot-btn">Amankan Tiket <em>→</em></span>
    </div>
  </RouterLink>

  <!-- ══ FILTER ══ -->
  <div class="bar">
    <div class="bar-title">
      <span class="bar-line"></span>
      <h2>Line-up Konser</h2>
      <span class="bar-count">{{ list.length }} event</span>
    </div>
    <div class="chips" role="tablist">
      <button
        v-for="f in filters"
        :key="f.key"
        :id="`filter-${f.key}`"
        class="chip"
        :class="{ 'chip-on': activeFilter === f.key }"
        role="tab"
        :aria-selected="activeFilter === f.key"
        @click="activeFilter = f.key"
      >
        {{ f.label }} <small>{{ countFor(f.key) }}</small>
      </button>
    </div>
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
        <p class="row-venue">📍 {{ c.venue }}</p>
      </div>

      <!-- perforation -->
      <div class="row-perf" aria-hidden="true"></div>

      <!-- price / cta -->
      <div class="row-end">
        <p class="row-from">mulai dari</p>
        <p class="row-price">{{ formatIDR(minPrice(c)) }}</p>
        <span class="row-btn">Lihat Detail <em>→</em></span>
      </div>
    </RouterLink>
  </TransitionGroup>

  <p v-if="!list.length" class="empty">Belum ada konser untuk kategori ini.</p>
</template>

<style scoped>
/* ═════════ SPOTLIGHT ═════════ */
.spot {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 24px;
  min-height: 280px;
  padding: 36px 40px;
  margin-bottom: 40px;
  overflow: hidden;
  text-decoration: none;
  color: #fff;
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--color-gold) 45%, transparent);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.6) inset;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.spot:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.65), 0 0 40px color-mix(in srgb, var(--c) 40%, transparent);
}
.spot-bg {
  position: absolute;
  inset: 0;
}
.spot-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 85% 20%, rgba(255, 255, 255, 0.2), transparent 55%),
    linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent 70%);
}
.spot-grain {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.08) 0 2px, transparent 2px 6px);
}
.spot-emoji {
  position: absolute;
  right: 4%;
  top: -10px;
  font-size: 15rem;
  line-height: 1;
  opacity: 0.2;
  filter: blur(1px);
  pointer-events: none;
  transition: transform 0.6s ease, opacity 0.4s;
}
.spot:hover .spot-emoji {
  transform: scale(1.08) rotate(-5deg);
  opacity: 0.32;
}
.spot-body,
.spot-side {
  position: relative;
}
.spot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}
.spot-tag {
  padding: 4px 12px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
}
.spot-tag-gold {
  color: #1a1300;
  background: linear-gradient(90deg, #f7c700, #ffe27a);
  border-color: transparent;
}
.spot-artist {
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.01em;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}
.spot-tour {
  margin-top: 8px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.32em;
  color: var(--color-gold);
}
.spot-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin-top: 16px;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.85);
}
.spot-online {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
}
.spot-online b {
  color: var(--color-accent);
}
.spot-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff2a43;
  box-shadow: 0 0 0 0 rgba(255, 42, 67, 0.7);
  animation: ping 1.6s infinite;
}
@keyframes ping {
  70% { box-shadow: 0 0 0 10px rgba(255, 42, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 42, 67, 0); }
}
.spot-side {
  text-align: right;
}
.spot-from {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}
.spot-price {
  margin: 2px 0 14px;
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-gold);
  text-shadow: 0 2px 16px rgba(247, 199, 0, 0.35);
}
.spot-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-weight: 900;
  font-size: 0.9rem;
  color: #1a1300;
  background: linear-gradient(90deg, #f7c700, #ffe27a);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(247, 199, 0, 0.3);
  transition: transform 0.25s, box-shadow 0.25s;
}
.spot:hover .spot-btn {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(247, 199, 0, 0.5);
}
.spot-btn em,
.row-btn em {
  font-style: normal;
  transition: transform 0.25s;
}
.spot:hover .spot-btn em,
.row:hover .row-btn em {
  transform: translateX(5px);
}

/* ═════════ FILTER BAR ═════════ */
.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
}
.bar-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bar-line {
  width: 4px;
  height: 26px;
  border-radius: 4px;
  background: linear-gradient(var(--color-gold), var(--color-primary));
  box-shadow: 0 0 12px rgba(247, 199, 0, 0.5);
}
.bar-title h2 {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--color-heading);
}
.bar-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-muted);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--color-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
}
.chip small {
  padding: 1px 7px;
  font-size: 0.68rem;
  border-radius: 999px;
  background: var(--color-surface-2);
}
.chip:hover {
  color: var(--color-heading);
  border-color: var(--color-gold);
}
.chip-on {
  color: #1a1300;
  background: linear-gradient(90deg, #f7c700, #ffe27a);
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(247, 199, 0, 0.3);
}
.chip-on small {
  color: #1a1300;
  background: rgba(0, 0, 0, 0.12);
}

/* ═════════ ROWS (ticket stub) ═════════ */
.rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}
.row {
  position: relative;
  display: grid;
  grid-template-columns: 150px 1fr auto 220px;
  align-items: stretch;
  min-height: 140px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(120deg, var(--color-surface) 0%, var(--color-surface-alt) 100%);
  border: 1px solid var(--color-line);
  border-radius: 18px;
  transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s;
}
.row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  z-index: 2;
  background: var(--c);
  box-shadow: 0 0 18px var(--c);
}
.row::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 0% 50%, color-mix(in srgb, var(--c) 22%, transparent), transparent 45%);
  opacity: 0;
  transition: opacity 0.35s;
}
.row:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--color-gold) 65%, transparent);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55), 0 0 30px color-mix(in srgb, var(--c) 25%, transparent);
}
.row:hover::after {
  opacity: 1;
}

.row-date {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  overflow: hidden;
  color: #fff;
}
.row-dayname {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.75);
}
.row-daynum {
  font-family: 'Press Start 2P', monospace;
  font-size: 2.1rem;
  line-height: 1.2;
  text-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
}
.row-month {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--color-gold);
}
.row-emoji {
  position: absolute;
  right: -10px;
  bottom: -14px;
  font-size: 4.4rem;
  opacity: 0.22;
  transition: transform 0.5s ease, opacity 0.3s;
}
.row:hover .row-emoji {
  transform: scale(1.2) rotate(-8deg);
  opacity: 0.4;
}

.row-info {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  padding: 18px 26px;
}
.row-mode {
  align-self: flex-start;
  padding: 2px 11px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--color-gold);
  border: 1px solid color-mix(in srgb, var(--color-gold) 50%, transparent);
  border-radius: 999px;
  background: rgba(247, 199, 0, 0.08);
}
.row-artist {
  margin-top: 4px;
  font-size: 1.6rem;
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-heading);
}
.row-tour {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  color: var(--color-accent);
  text-transform: uppercase;
}
.row-venue {
  margin-top: 4px;
  font-size: 0.82rem;
  color: var(--color-muted);
}

/* perforasi tiket */
.row-perf {
  position: relative;
  width: 0;
  margin: 14px 0;
  border-left: 2px dashed var(--color-line);
}
.row-perf::before,
.row-perf::after {
  content: '';
  position: absolute;
  left: -13px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-canvas);
  border: 1px solid var(--color-line);
}
.row-perf::before { top: -26px; }
.row-perf::after { bottom: -26px; }

.row-end {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 18px 22px;
  text-align: center;
}
.row-from {
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-muted);
}
.row-price {
  margin-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--color-gold);
}
.row-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--color-heading);
  border: 1px solid var(--color-line);
  border-radius: 10px;
  background: var(--color-surface-2);
  transition: all 0.25s;
}
.row:hover .row-btn {
  color: #1a1300;
  background: linear-gradient(90deg, #f7c700, #ffe27a);
  border-color: transparent;
  box-shadow: 0 6px 18px rgba(247, 199, 0, 0.35);
}

.empty {
  padding: 40px 0;
  text-align: center;
  color: var(--color-muted);
}

/* transisi filter */
.row-enter-active,
.row-leave-active {
  transition: all 0.35s ease;
}
.row-enter-from,
.row-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
.row-leave-active {
  position: absolute;
  width: 100%;
}

/* ═════════ RESPONSIVE ═════════ */
@media (max-width: 860px) {
  .spot {
    grid-template-columns: 1fr;
    padding: 28px 22px;
  }
  .spot-side {
    text-align: left;
  }
  .row {
    grid-template-columns: 110px 1fr;
  }
  .row-perf {
    display: none;
  }
  .row-end {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    border-top: 2px dashed var(--color-line);
    padding: 14px 20px;
  }
  .row-from { display: none; }
  .row-price { margin: 0; }
  .row-artist { font-size: 1.25rem; }
}
</style>
