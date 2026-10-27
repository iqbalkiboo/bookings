<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import { useTicketWarStore } from '@/stores/ticketwar'
import { seedConcerts, type SaleMode } from '@/data/concerts'
import { formatIDR, formatNumber } from '@/utils/format'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const movieStore = useMovieStore()
const warStore = useTicketWarStore()

const featuredConcert = seedConcerts[0]
const otherConcerts = seedConcerts.slice(1)

const MODE_LABEL: Record<SaleMode, string> = {
  war: '⚡ Ticket War',
  ballot: '🎟️ Ballot',
  both: '⚡ War + 🎟️ Ballot',
}

function bannerGradient(color: string): string {
  return `linear-gradient(120deg, color-mix(in srgb, ${color} 55%, #000), color-mix(in srgb, ${color} 90%, #000))`
}

function startPrice(warPrice: number): number {
  return Math.round((warPrice * 0.3) / 10_000) * 10_000
}

const features = [
  {
    icon: '🚦',
    title: 'Virtual Queue',
    desc: 'Saat traffic membludak, pengunjung otomatis masuk ruang tunggu virtual berdasarkan urutan kedatangan.',
  },
  {
    icon: '🎟️',
    title: 'Sistem Ballot',
    desc: 'Konser memakai undian — semua pendaftar punya peluang setara tanpa rebutan server.',
  },
  {
    icon: '🔒',
    title: 'Seat Hold',
    desc: 'Kursi yang dipilih dikunci sementara (grace period) agar tidak direbut pembeli lain.',
  },
]
</script>

<template>
  <!-- Hero -->
  <BaseCard class="mb-5 px-6 py-10 text-center">
    <p class="text-xs font-bold tracking-[0.25em] text-primary">TIX ID</p>
    <h1 class="my-2 text-3xl font-extrabold text-heading sm:text-4xl">
      GET TICKET<span class="text-primary">🎫</span>
      <br />
    </h1>
    <p class="mx-auto mb-6 max-w-xl text-muted">
      Demo frontend booking tiket bioskop dan sistem tiketing konser
    </p>
    <div class="flex flex-wrap justify-center gap-3">
      <BaseButton to="/movies" size="lg">🎬 Pesan Tiket Bioskop</BaseButton>
      <BaseButton to="/concerts" variant="secondary" size="lg">⚡ Tiket Konser</BaseButton>
    </div>
  </BaseCard>

  <!-- Banner konser unggulan -->
  <section
    class="relative mb-8 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-line p-6 text-white"
    :style="{ background: bannerGradient(featuredConcert.color) }"
  >
    <!-- dekorasi poster glow -->
    <span class="pointer-events-none absolute -top-6 -right-4 text-8xl opacity-25 select-none">
      {{ featuredConcert.poster }}
    </span>

    <div class="relative">
      <span class="rounded-full bg-black/40 px-3 py-1 text-xs font-bold tracking-widest backdrop-blur">
        🔥 SEGERA — {{ MODE_LABEL[featuredConcert.saleMode].toUpperCase() }}
      </span>
      <h2 class="mt-2 mb-1 text-xl font-extrabold drop-shadow sm:text-2xl">
        {{ featuredConcert.artist }} — {{ featuredConcert.tour }}
      </h2>
      <p class="text-sm text-white/80">📍 {{ featuredConcert.venue }} · 🗓️ {{ featuredConcert.date }}</p>
      <p class="mt-1.5 text-sm">
        🔴 <strong class="text-accent">{{ formatNumber(warStore.onlineUsers) }}</strong>
        pengguna sedang online
      </p>
    </div>

    <div class="relative flex flex-col items-end gap-2">
      <BaseButton :to="`/concert/${featuredConcert.id}`" variant="light">
        Daftar Sekarang →
      </BaseButton>
      <span class="text-xs font-bold text-white/80">
        mulai {{ formatIDR(startPrice(featuredConcert.warPrice)) }}
      </span>
    </div>
  </section>

  <!-- Sedang tayang -->
  <section class="mb-8">
    <SectionHeading title="Sedang Tayang">
      <RouterLink to="/movies" class="text-sm font-medium text-primary no-underline">
        Lihat semua →
      </RouterLink>
    </SectionHeading>
    <div class="grid gap-3 sm:grid-cols-2">
      <MovieCard
        v-for="movie in movieStore.movies.slice(0, 4)"
        :key="movie.id"
        :movie="movie"
        @select="router.push('/movies')"
      />
    </div>
  </section>

  <!-- Konser lainnya -->
  <section class="mb-8">
    <SectionHeading title="Konser Lainnya">
      <RouterLink to="/concerts" class="text-sm font-medium text-primary no-underline">
        Lihat semua →
      </RouterLink>
    </SectionHeading>

    <div class="grid gap-3 sm:grid-cols-2">
      <RouterLink
        v-for="concert in otherConcerts"
        :key="concert.id"
        :to="`/concert/${concert.id}`"
        class="group relative overflow-hidden rounded-2xl border border-line p-4 no-underline transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
        :style="{ background: bannerGradient(concert.color) }"
      >
        <!-- poster glow dekoratif -->
        <span
          class="pointer-events-none absolute -right-2 -bottom-4 text-7xl opacity-30 select-none transition duration-300 group-hover:scale-110 group-hover:opacity-50"
        >
          {{ concert.poster }}
        </span>

        <span
          class="relative rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-white/90 backdrop-blur"
        >
          {{ MODE_LABEL[concert.saleMode] }}
        </span>

        <div class="relative mt-2.5">
          <h3 class="text-lg font-extrabold text-white drop-shadow">{{ concert.artist }}</h3>
          <p class="text-[0.68rem] font-bold tracking-widest text-white/70 uppercase">
            {{ concert.tour }}
          </p>
          <p class="mt-1 text-xs text-white/80">🗓️ {{ concert.date }}</p>
          <p class="text-xs text-white/60">📍 {{ concert.venue }}</p>

          <div class="mt-2.5 flex items-center justify-between border-t border-white/15 pt-2">
            <span class="text-xs font-bold text-white/90">
              mulai {{ formatIDR(startPrice(concert.warPrice)) }}
            </span>
            <span class="text-xs font-bold text-white transition group-hover:text-accent">
              Lihat Detail →
            </span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>

  <!-- Fitur high traffic -->
  <section>
    <SectionHeading title="Siap Traffic Tinggi 🚀" />
    <div class="grid gap-3 sm:grid-cols-3">
      <BaseCard v-for="f in features" :key="f.title" class="p-5">
        <span class="text-2xl">{{ f.icon }}</span>
        <h3 class="mt-2 mb-1 text-base font-bold text-heading">{{ f.title }}</h3>
        <p class="text-sm leading-relaxed text-muted">{{ f.desc }}</p>
      </BaseCard>
    </div>
  </section>
</template>
