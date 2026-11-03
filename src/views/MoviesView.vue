<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useMovieStore } from '@/stores/movie'
import { formatIDR } from '@/utils/format'
import {
  availabilityTone,
  blurb,
  matchPct,
  minPrice,
  posterGradient,
  bannerGradient,
  billboardBg,
  rankMovies,
} from '@/utils/movie'
import PageHeader from '@/components/molecules/PageHeader.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseBadge from '@/components/atoms/BaseBadge.vue'
import BaseCard from '@/components/atoms/BaseCard.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import SeatMap from '@/components/organisms/SeatMap.vue'
import CountdownTimer from '@/components/atoms/CountdownTimer.vue'
import OrderSummary from '@/components/organisms/OrderSummary.vue'

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

const ranked = computed(() => rankMovies(store.movies))

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
      title="Tiket Bioskop"
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
            {{ item.n }}
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
                Pesan Tiket
              </button>
              <button id="hero-more" type="button" class="nf-btn nf-btn--info" @click="scrollToRows">
                Jelajahi Film
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
        <h3 class="nf-row-title">Top Hari Ini <small>paling banyak dipesan</small></h3>
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
        <h3 class="nf-row-title">Sedang Tayang <small>{{ store.movies.length }} film</small></h3>
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
        <BaseButton variant="light" size="sm" @click="store.clearMovie()">Ganti Film</BaseButton>
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
        <BaseButton variant="light" size="sm" @click="store.clearShowtime()">Ganti Jadwal</BaseButton>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <!-- kursi -->
        <BaseCard class="p-5">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-heading">Pilih Kursi</h3>
            <span v-if="store.holdEndsAt && store.selectedSeats.length" class="text-xs text-muted">
              di-hold
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

        <!-- ringkasan & bayar (Organism) -->
        <OrderSummary :date-label="dates[store.selectedDate]?.label" />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss" src="@/assets/styles/pages/movies.scss"></style>
