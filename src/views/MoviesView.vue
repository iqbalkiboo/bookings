<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useMovieStore } from '@/stores/movie'
import { formatIDR } from '@/utils/format'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import SeatMap from '@/components/SeatMap.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'

const store = useMovieStore()

// ===== langkah wizard: 1 film → 2 jadwal → 3 kursi =====
const step = computed(() =>
  !store.selectedMovie ? 1 : !store.selectedShowtime ? 2 : 3,
)

const STEPS = [
  { n: 1, label: 'Pilih Film' },
  { n: 2, label: 'Pilih Jadwal' },
  { n: 3, label: 'Pilih Kursi' },
] as const

function goToStep(target: number) {
  if (target >= step.value) return
  if (target === 1) store.clearMovie()
  else store.clearShowtime()
}

// daftar tanggal (visual) untuk pemilih jadwal
const dates = computed(() => {
  const fmt = new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      index: i,
      label: i === 0 ? 'Hari ini' : i === 1 ? 'Besok' : fmt.format(d),
    }
  })
})

function availabilityTone(percent: number): 'success' | 'primary' | 'danger' {
  if (percent >= 70) return 'success'
  if (percent >= 50) return 'primary'
  return 'danger'
}

function posterGradient(color: string): string {
  return `linear-gradient(160deg, ${color}, color-mix(in srgb, ${color} 45%, #000))`
}

function bannerGradient(color: string): string {
  return `linear-gradient(120deg, color-mix(in srgb, ${color} 55%, #000), ${color})`
}

// ===== Netflix-style browse =====
const heroIdx = ref(0)
const hero = computed(() => store.movies[heroIdx.value] ?? store.movies[0])
let heroTimer: ReturnType<typeof setInterval> | undefined

function startAuto() {
  stopAuto()
  heroTimer = setInterval(() => {
    if (store.movies.length) heroIdx.value = (heroIdx.value + 1) % store.movies.length
  }, 6500)
}
function stopAuto() {
  if (heroTimer) clearInterval(heroTimer)
}
function setHero(i: number) {
  heroIdx.value = i
  startAuto()
}
onMounted(startAuto)
onUnmounted(stopAuto)

/** urutan "Top Hari Ini" — peringkat demo (deterministik per id film) */
const ranked = computed(() =>
  [...store.movies].sort((a, b) => ((b.id * 37) % 11) - ((a.id * 37) % 11)),
)

const BLURBS: Record<number, string> = {
  1: 'Sebuah kisah hangat tentang berdamai dengan masa lalu — ketika awan kelabu akhirnya berlalu, harapan baru datang menyapa.',
  2: 'Si Kancil yang cerdik kembali! Ikuti petualangan seru penuh tawa untuk seluruh keluarga di hutan penuh kejutan.',
  3: 'Di balik nebula yang memanas, satu kru antariksa harus memilih antara pulang atau menyelamatkan galaksi.',
  4: 'Dua hati bertemu di ujung senja. Sebuah romansa manis tentang cinta yang datang di waktu yang tak terduga.',
}
function blurb(id: number): string {
  return BLURBS[id] ?? 'Saksikan keseruannya di layar lebar bersama TIX ID.'
}
function matchPct(id: number): number {
  return 82 + ((id * 7) % 17)
}
function minPrice(m: { showtimes: { price: number }[] }): number {
  return Math.min(...m.showtimes.map((s) => s.price))
}
function billboardBg(color: string): string {
  return `radial-gradient(circle at 75% 40%, ${color}, color-mix(in srgb, ${color} 35%, #05060a) 70%)`
}
function scrollRow(id: string, dir: 1 | -1) {
  document.getElementById(id)?.scrollBy({ left: dir * 520, behavior: 'smooth' })
}
function scrollToRows() {
  document.getElementById('nf-rows')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <template v-if="step > 1">
    <PageHeader
      title="🎬 Tiket Bioskop"
      subtitle="Tiga langkah cepat: pilih film, pilih jadwal, amankan kursimu."
    />

    <!-- stepper -->
    <nav class="mb-6 flex items-center gap-2">
      <template v-for="(item, i) in STEPS" :key="item.n">
        <button
          type="button"
          class="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition"
          :class="{
            'border-primary bg-primary text-white': step === item.n,
            'cursor-pointer border-primary bg-surface text-primary hover:bg-primary-soft': step > item.n,
            'cursor-not-allowed border-line text-muted': step < item.n,
          }"
          :disabled="step <= item.n"
          @click="goToStep(item.n)"
        >
          <span
            class="grid h-5 w-5 place-items-center rounded-full text-[0.65rem]"
            :class="step === item.n ? 'bg-white/25 text-white' : step > item.n ? 'bg-primary text-white' : 'bg-surface-alt text-muted'"
          >
            {{ step > item.n ? '✓' : item.n }}
          </span>
          {{ item.label }}
        </button>
        <span v-if="i < STEPS.length - 1" class="h-px flex-1 bg-line"></span>
      </template>
    </nav>
  </template>

  <!-- ============ STEP 1: FILM ============ -->
  <Transition name="step" mode="out-in">
    <div v-if="step === 1" key="step1">
      <!-- ── Billboard ── -->
      <section v-if="hero" class="nf-billboard" aria-label="Film unggulan">
        <div class="nf-bg" :style="{ background: billboardBg(hero.color) }"></div>
        <Transition name="nf-art" mode="out-in">
          <span :key="hero.id" class="nf-art">{{ hero.poster }}</span>
        </Transition>

        <Transition name="step" mode="out-in">
          <div :key="hero.id" class="nf-copy">
            <p class="nf-kicker"><b>T</b> FILM PILIHAN HARI INI</p>
            <h2 class="nf-title">{{ hero.title }}</h2>
            <p class="nf-meta">
              <span class="nf-match">{{ matchPct(hero.id) }}% Cocok</span>
              <span class="nf-rating">{{ hero.rating }}</span>
              <span>{{ hero.duration }} menit</span>
              <span>{{ hero.genre }}</span>
            </p>
            <p class="nf-blurb">{{ blurb(hero.id) }}</p>
            <div class="nf-actions">
              <button id="hero-book" type="button" class="nf-btn nf-btn--play" @click="store.selectMovie(hero.id)">
                ▶ Pesan Tiket
              </button>
              <button id="hero-more" type="button" class="nf-btn nf-btn--info" @click="scrollToRows">
                ⓘ Jelajahi Film
              </button>
            </div>
          </div>
        </Transition>

        <div class="nf-dots">
          <button
            v-for="(m, i) in store.movies"
            :key="m.id"
            type="button"
            class="nf-dot"
            :class="{ 'nf-dot--on': i === heroIdx }"
            :aria-label="`Tampilkan ${m.title}`"
            @click="setHero(i)"
          ></button>
        </div>
      </section>

      <!-- ── Top ranking ── -->
      <section id="nf-rows" class="nf-section">
        <h3 class="nf-row-title">🔥 Top Hari Ini <small>paling banyak dipesan</small></h3>
        <div class="nf-scroller">
          <button type="button" class="nf-arrow nf-arrow--l" aria-label="Geser kiri" @click="scrollRow('row-top', -1)">‹</button>
          <div id="row-top" class="nf-row">
            <button
              v-for="(movie, i) in ranked"
              :key="movie.id"
              type="button"
              class="nf-top"
              @click="store.selectMovie(movie.id)"
            >
              <span class="nf-top-num">{{ i + 1 }}</span>
              <span class="nf-poster" :style="{ background: posterGradient(movie.color) }">
                <span class="nf-poster-emoji">{{ movie.poster }}</span>
                <span class="nf-poster-label">
                  <strong>{{ movie.title }}</strong>
                  <span>{{ movie.genre }}</span>
                </span>
              </span>
            </button>
          </div>
          <button type="button" class="nf-arrow nf-arrow--r" aria-label="Geser kanan" @click="scrollRow('row-top', 1)">›</button>
        </div>
      </section>

      <!-- ── Sedang tayang ── -->
      <section class="nf-section">
        <h3 class="nf-row-title">🎬 Sedang Tayang <small>{{ store.movies.length }} film</small></h3>
        <div class="nf-scroller">
          <button type="button" class="nf-arrow nf-arrow--l" aria-label="Geser kiri" @click="scrollRow('row-now', -1)">‹</button>
          <div id="row-now" class="nf-row">
            <button
              v-for="movie in store.movies"
              :key="movie.id"
              type="button"
              class="nf-card"
              @click="store.selectMovie(movie.id)"
            >
              <span class="nf-poster" :style="{ background: posterGradient(movie.color) }">
                <span v-if="movie.id === hero?.id" class="nf-badge">PILIHAN</span>
                <span class="nf-poster-emoji">{{ movie.poster }}</span>
                <span class="nf-poster-label">
                  <strong>{{ movie.title }}</strong>
                  <span>{{ movie.studio }}</span>
                </span>
              </span>
              <span class="nf-hover">
                <span class="nf-hover-btns">
                  <span class="nf-circle">▶</span>
                  <span class="nf-circle nf-circle--ghost">+</span>
                  <span class="nf-price">mulai {{ formatIDR(minPrice(movie)) }}</span>
                </span>
                <span class="nf-hover-meta">
                  <span class="nf-match">{{ matchPct(movie.id) }}% Cocok</span>
                  <span>{{ movie.rating }}</span>
                  <span>{{ movie.duration }}m</span>
                </span>
                <span class="nf-hover-meta">{{ movie.genre }}</span>
              </span>
            </button>
          </div>
          <button type="button" class="nf-arrow nf-arrow--r" aria-label="Geser kanan" @click="scrollRow('row-now', 1)">›</button>
        </div>
      </section>
    </div>

    <!-- ============ STEP 2: JADWAL ============ -->
    <div v-else-if="step === 2 && store.selectedMovie" key="step2" class="flex flex-col gap-4">
      <!-- banner film terpilih -->
      <div
        class="flex items-center gap-4 rounded-2xl p-5 text-white"
        :style="{ background: bannerGradient(store.selectedMovie.color) }"
      >
        <span class="grid h-16 w-12 shrink-0 place-items-center rounded-lg bg-black/25 text-3xl">
          {{ store.selectedMovie.poster }}
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="truncate text-lg font-extrabold">{{ store.selectedMovie.title }}</h2>
          <p class="truncate text-xs text-white/80">
            {{ store.selectedMovie.genre }} · {{ store.selectedMovie.duration }} menit ·
            {{ store.selectedMovie.studio }}
          </p>
          <BaseBadge class="mt-1.5" tone="white">{{ store.selectedMovie.rating }}</BaseBadge>
        </div>
        <BaseButton variant="light" size="sm" @click="store.clearMovie()">← Ganti Film</BaseButton>
      </div>

      <!-- pilih tanggal -->
      <div>
        <h3 class="mb-2 text-base font-semibold text-heading">Pilih Tanggal</h3>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="date in dates"
            :key="date.index"
            type="button"
            class="cursor-pointer rounded-xl border px-2 py-2.5 text-center text-xs font-semibold transition"
            :class="
              store.selectedDate === date.index
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-surface text-muted hover:border-primary'
            "
            @click="store.selectDate(date.index)"
          >
            {{ date.label }}
          </button>
        </div>
      </div>

      <!-- daftar jam tayang -->
      <div>
        <h3 class="mb-2 text-base font-semibold text-heading">
          Jam Tayang Tersedia
          <span class="text-sm font-normal text-muted">— klik untuk pilih kursi</span>
        </h3>
        <div class="flex flex-col gap-2.5">
          <button
            v-for="showtime in store.selectedMovie.showtimes"
            :key="showtime.id"
            type="button"
            class="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-line bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            @click="store.selectShowtime(showtime.id)"
          >
            <div class="w-16 shrink-0">
              <p class="text-xl font-extrabold text-heading">{{ showtime.time }}</p>
              <p class="text-[0.7rem] text-muted">WIB</p>
            </div>

            <div class="hidden flex-1 sm:block">
              <p class="mb-1 flex justify-between text-[0.7rem] text-muted">
                <span>kursi tersedia</span>
                <span class="font-bold">{{ store.availability(showtime.id) }}%</span>
              </p>
              <ProgressBar
                :percent="store.availability(showtime.id)"
                :tone="availabilityTone(store.availability(showtime.id))"
              />
            </div>

            <div class="ml-auto text-right">
              <p class="font-bold text-primary">{{ formatIDR(showtime.price) }}</p>
              <p class="text-[0.7rem] text-muted">per kursi</p>
            </div>

            <span class="text-lg text-primary">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ============ STEP 3: KURSI ============ -->
    <div v-else-if="step === 3 && store.selectedMovie && store.selectedShowtime" key="step3" class="flex flex-col gap-4">
      <!-- ringkasan pesanan -->
      <div
        class="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl p-4 text-white"
        :style="{ background: bannerGradient(store.selectedMovie.color) }"
      >
        <span class="text-2xl">{{ store.selectedMovie.poster }}</span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-extrabold">{{ store.selectedMovie.title }}</p>
          <p class="text-xs text-white/80">
            {{ store.selectedShowtime.time }} WIB · {{ store.selectedMovie.studio }}
          </p>
        </div>
        <BaseButton variant="light" size="sm" @click="store.clearShowtime()">← Ganti Jadwal</BaseButton>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <!-- kursi -->
        <BaseCard class="p-5">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-heading">Pilih Kursi</h3>
            <span v-if="store.holdEndsAt && store.selectedSeats.length" class="text-xs text-muted">
              🔒 di-hold
              <CountdownTimer
                :key="store.holdEndsAt"
                :ends-at="store.holdEndsAt"
                @expired="store.onHoldExpired"
              />
            </span>
          </div>
          <div class="mt-3">
            <SeatMap />
          </div>
        </BaseCard>

        <!-- ringkasan & bayar -->
        <BaseCard class="h-fit p-5 lg:sticky lg:top-20">
          <h3 class="mb-3 text-base font-semibold text-heading">Ringkasan Pesanan</h3>

          <dl class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-muted">Film</dt>
              <dd class="max-w-40 truncate text-right font-semibold text-heading">
                {{ store.selectedMovie.title }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-muted">Jadwal</dt>
              <dd class="font-semibold text-heading">
                {{ dates[store.selectedDate]?.label }}, {{ store.selectedShowtime.time }} WIB
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-muted">Kursi</dt>
              <dd class="font-semibold text-heading">
                {{ store.selectedSeats.length ? store.selectedSeats.join(', ') : '—' }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-muted">Harga / tiket</dt>
              <dd class="font-semibold text-heading">{{ formatIDR(store.selectedShowtime.price) }}</dd>
            </div>
          </dl>

          <div class="my-3 border-t border-dashed border-line"></div>

          <div class="flex items-baseline justify-between">
            <span class="text-sm text-muted">Total</span>
            <span class="text-xl font-extrabold text-primary">{{ formatIDR(store.totalPrice) }}</span>
          </div>

          <BaseButton
            class="mt-4"
            block
            size="lg"
            :disabled="store.selectedSeats.length === 0"
            @click="store.confirmBooking()"
          >
            Bayar Sekarang
          </BaseButton>

          <p class="mt-2 text-center text-[0.7rem] text-muted">
            Kursi di-hold 5 menit sejak pertama dipilih.
          </p>

          <!-- sukses -->
          <div
            v-if="store.lastBooking"
            class="mt-3 flex flex-col gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success"
          >
            <p class="font-bold">
              ✅ Pembayaran berhasil! Kode: <span class="font-mono">{{ store.lastBooking.code }}</span>
            </p>
            <div class="flex flex-wrap gap-2">
              <BaseButton to="/tickets" size="sm" variant="secondary">Lihat Tiket Saya</BaseButton>
              <BaseButton size="sm" variant="ghost" @click="store.clearShowtime()">Pesan Lagi</BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
// transisi antar langkah wizard
.step-enter-active,
.step-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(18px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}

/* ═════════ NETFLIX-STYLE BROWSE ═════════ */
.nf-billboard {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 460px;
  margin-bottom: 2rem;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid var(--color-line);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.6);
}
.nf-bg {
  position: absolute;
  inset: 0;
  transition: background 0.8s ease;
}
.nf-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px);
}
.nf-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(8, 9, 12, 0.95) 0%, rgba(8, 9, 12, 0.7) 38%, transparent 75%),
    linear-gradient(to top, var(--color-canvas) 0%, transparent 45%);
}
.nf-art {
  position: absolute;
  right: 6%;
  top: 50%;
  font-size: 19rem;
  line-height: 1;
  transform: translateY(-50%);
  filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.6));
  pointer-events: none;
}
.nf-art-enter-active,
.nf-art-leave-active {
  transition: opacity 0.6s ease, transform 0.8s ease;
}
.nf-art-enter-from {
  opacity: 0;
  transform: translateY(-50%) scale(0.8) rotate(-8deg);
}
.nf-art-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(1.15) rotate(6deg);
}
.nf-copy {
  position: relative;
  z-index: 1;
  max-width: 560px;
  padding: 2.5rem 2.5rem 3.2rem;
}
.nf-kicker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.3em;
  color: var(--color-muted);
}
.nf-kicker b {
  display: grid;
  place-items: center;
  width: 20px;
  height: 26px;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.7rem;
  color: #fff;
  border-radius: 4px;
  background: var(--color-primary);
  box-shadow: 0 0 14px rgba(227, 0, 27, 0.7);
}
.nf-title {
  margin: 0.7rem 0 0.8rem;
  font-size: clamp(2.4rem, 6vw, 4.3rem);
  font-weight: 900;
  line-height: 0.98;
  color: #fff;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);
}
.nf-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--color-body);
}
.nf-match {
  color: var(--color-success);
}
.nf-rating {
  padding: 1px 8px;
  font-size: 0.72rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}
.nf-blurb {
  max-width: 480px;
  margin: 1rem 0 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}
.nf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}
.nf-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.7rem;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 900;
  cursor: pointer;
  border: 0;
  border-radius: 8px;
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
}
.nf-btn:hover {
  transform: scale(1.05);
}
.nf-btn--play {
  color: #111;
  background: #fff;
}
.nf-btn--play:hover {
  background: var(--color-gold);
  box-shadow: 0 0 26px rgba(247, 199, 0, 0.5);
}
.nf-btn--info {
  color: #fff;
  background: rgba(109, 109, 110, 0.6);
  backdrop-filter: blur(8px);
}
.nf-btn--info:hover {
  background: rgba(109, 109, 110, 0.85);
}
.nf-dots {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 2;
  display: flex;
  gap: 8px;
}
.nf-dot {
  width: 26px;
  height: 4px;
  padding: 0;
  cursor: pointer;
  border: 0;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}
.nf-dot--on {
  width: 44px;
  background: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary);
}

/* rows */
.nf-section {
  position: relative;
  margin-bottom: 2.25rem;
}
.nf-row-title {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-heading);
}
.nf-row-title small {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-muted);
}
.nf-scroller {
  position: relative;
}
.nf-row {
  display: flex;
  gap: 0.9rem;
  padding: 0.9rem 0.3rem 1.4rem;
  margin: -0.9rem -0.3rem -1.4rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
}
.nf-row::-webkit-scrollbar {
  display: none;
}
.nf-arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  width: 46px;
  font-size: 1.6rem;
  color: #fff;
  cursor: pointer;
  border: 0;
  opacity: 0;
  transition: opacity 0.25s;
}
.nf-scroller:hover .nf-arrow {
  opacity: 1;
}
.nf-arrow--l {
  left: -4px;
  background: linear-gradient(90deg, rgba(8, 9, 12, 0.9), transparent);
}
.nf-arrow--r {
  right: -4px;
  background: linear-gradient(270deg, rgba(8, 9, 12, 0.9), transparent);
}

/* poster card */
.nf-card {
  position: relative;
  flex: 0 0 auto;
  width: 190px;
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: inherit;
  scroll-snap-align: start;
  border: 1px solid var(--color-line);
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
}
.nf-card:hover {
  z-index: 4;
  transform: scale(1.1) translateY(-4px);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.75);
}
.nf-poster {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 2 / 3;
  overflow: hidden;
}
.nf-poster-emoji {
  font-size: 5.2rem;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.5));
  transition: transform 0.4s ease;
}
.nf-card:hover .nf-poster-emoji {
  transform: scale(1.15);
}
.nf-poster::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 55%);
}
.nf-poster-label {
  position: absolute;
  left: 0.7rem;
  right: 0.7rem;
  bottom: 0.6rem;
  z-index: 1;
}
.nf-poster-label strong {
  display: block;
  font-size: 0.88rem;
  font-weight: 900;
  line-height: 1.15;
  color: #fff;
}
.nf-poster-label span {
  font-size: 0.66rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}
.nf-badge {
  position: absolute;
  top: 0.55rem;
  left: 0.55rem;
  z-index: 2;
  padding: 2px 7px;
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #fff;
  border-radius: 4px;
  background: var(--color-primary);
}
.nf-hover {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 0;
  padding: 0 0.7rem;
  overflow: hidden;
  background: var(--color-surface-alt);
  transition: max-height 0.3s ease, padding 0.3s ease;
}
.nf-card:hover .nf-hover {
  max-height: 120px;
  padding: 0.7rem;
}
.nf-hover-btns {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.nf-circle {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  font-size: 0.7rem;
  color: #111;
  border-radius: 50%;
  background: #fff;
}
.nf-circle--ghost {
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.nf-hover-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--color-body);
}
.nf-price {
  font-size: 0.72rem;
  font-weight: 900;
  color: var(--color-gold);
}

/* top 10 card */
.nf-top {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: flex-end;
  width: 255px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: 0;
  color: inherit;
  scroll-snap-align: start;
  transition: transform 0.3s ease;
}
.nf-top:hover {
  transform: scale(1.06);
}
.nf-top-num {
  flex: 0 0 auto;
  margin-right: 0.45rem;
  padding-bottom: 0.4rem;
  min-width: 2.2rem;
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #0d0e11;
  -webkit-text-stroke: 2px #8a91a8;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  transition: -webkit-text-stroke-color 0.3s;
}
.nf-top:hover .nf-top-num {
  -webkit-text-stroke-color: var(--color-gold);
}
.nf-top .nf-poster {
  flex: 0 0 175px;
  border: 1px solid var(--color-line);
  border-radius: 10px;
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.6);
}
.nf-top .nf-poster-emoji {
  font-size: 4rem;
}

@media (max-width: 760px) {
  .nf-billboard {
    min-height: 420px;
  }
  .nf-art {
    right: -8%;
    font-size: 12rem;
    opacity: 0.45;
  }
  .nf-copy {
    padding: 1.5rem 1.25rem 3rem;
  }
  .nf-card {
    width: 150px;
  }
  .nf-top {
    width: 205px;
  }
  .nf-top-num {
    font-size: 3rem;
    min-width: 1.8rem;
    margin-right: 0.3rem;
  }
  .nf-top .nf-poster {
    flex-basis: 140px;
  }
}
</style>
