<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import { useTicketWarStore } from '@/stores/ticketwar'
import { seedConcerts, type SaleMode } from '@/data/concerts'
import { formatIDR, formatNumber } from '@/utils/format'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseCard from '@/components/atoms/BaseCard.vue'
import SectionHeading from '@/components/molecules/SectionHeading.vue'
import MovieCard from '@/components/organisms/MovieCard.vue'

const router = useRouter()
const movieStore = useMovieStore()
const warStore = useTicketWarStore()

const featuredConcert = seedConcerts[0]
const otherConcerts = seedConcerts.slice(1)

const MODE_LABEL: Record<SaleMode, string> = {
  war: 'Ticket War',
  ballot: 'Ballot',
  both: 'War + Ballot',
}

function bannerGradient(color: string): string {
  return `radial-gradient(ellipse 110% 130% at 85% 10%, color-mix(in srgb, ${color} 70%, transparent) 0%, color-mix(in srgb, ${color} 28%, #0d1117) 50%, #080a0f 100%)`
}

function startPrice(warPrice: number): number {
  return Math.round((warPrice * 0.3) / 10_000) * 10_000
}

const features = [
  {
    title: 'Virtual Queue',
    desc: 'Saat traffic membludak, pengunjung otomatis masuk ruang tunggu virtual berdasarkan urutan kedatangan.',
  },
  {
    title: 'Sistem Ballot',
    desc: 'Konser memakai undian — semua pendaftar punya peluang setara tanpa rebutan server.',
  },
  {
    title: 'Seat Hold',
    desc: 'Kursi yang dipilih dikunci sementara (grace period) agar tidak direbut pembeli lain.',
  },
]
</script>

<template>
  <!-- Hero -->
  <BaseCard class="hero-card">
    <p class="hero-badge">TIX ID</p>
    <h1 class="hero-title">GET TICKET</h1>
    <p class="hero-subtitle">
      Platform booking tiket bioskop dan sistem tiketing konser modern
    </p>
    <div class="flex flex-wrap justify-center gap-3">
      <BaseButton to="/movies" size="lg">Pesan Tiket Bioskop</BaseButton>
      <BaseButton to="/concerts" variant="secondary" size="lg">Tiket Konser</BaseButton>
    </div>
  </BaseCard>

  <!-- Banner konser unggulan -->
  <section
    class="featured-banner"
    :style="{ background: bannerGradient(featuredConcert.color) }"
  >
    <!-- dekorasi poster glow -->
    <span class="featured-poster-glow">
      {{ featuredConcert.poster }}
    </span>

    <div class="featured-top-row">
      <span class="featured-pill">
        Segera · {{ MODE_LABEL[featuredConcert.saleMode] }}
      </span>

      <span class="featured-live-badge">
        <span class="live-dot"></span>
        <span><strong>{{ formatNumber(warStore.onlineUsers) }}</strong> online</span>
      </span>
    </div>

    <div class="featured-body">
      <p class="featured-artist">{{ featuredConcert.artist }}</p>
      <h2 class="featured-headline">
        {{ featuredConcert.tour }}
      </h2>
      <div class="featured-meta">
        <span>{{ featuredConcert.venue }}</span>
        <span class="meta-sep">·</span>
        <span>{{ featuredConcert.date }}</span>
      </div>
    </div>

    <div class="featured-footer">
      <div class="featured-price-block">
        <span class="price-caption">Mulai dari</span>
        <span class="price-number">{{ formatIDR(startPrice(featuredConcert.warPrice)) }}</span>
      </div>

      <RouterLink
        :to="`/concert/${featuredConcert.id}`"
        class="featured-cta-btn"
      >
        Daftar Sekarang
      </RouterLink>
    </div>
  </section>

  <!-- Sedang tayang -->
  <section class="mb-8">
    <SectionHeading title="Sedang Tayang">
      <RouterLink to="/movies" class="text-sm font-medium text-primary no-underline">
        Lihat semua
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
        Lihat semua
      </RouterLink>
    </SectionHeading>

    <div class="grid gap-3 sm:grid-cols-2">
      <RouterLink
        v-for="concert in otherConcerts"
        :key="concert.id"
        :to="`/concert/${concert.id}`"
        class="concert-compact-card"
        :style="{ background: bannerGradient(concert.color) }"
      >
        <!-- poster glow dekoratif -->
        <span class="compact-poster-bg">
          {{ concert.poster }}
        </span>

        <span class="compact-badge">
          {{ MODE_LABEL[concert.saleMode] }}
        </span>

        <div class="compact-info">
          <h3 class="compact-artist">{{ concert.artist }}</h3>
          <p class="compact-tour">{{ concert.tour }}</p>
          <p class="compact-meta">{{ concert.venue }} · {{ concert.date }}</p>
        </div>

        <div class="compact-footer">
          <span class="compact-price">mulai {{ formatIDR(startPrice(concert.warPrice)) }}</span>
          <span class="compact-action">Lihat Detail</span>
        </div>
      </RouterLink>
    </div>
  </section>

  <!-- Fitur high traffic -->
  <section>
    <SectionHeading title="Siap Traffic Tinggi" />
    <div class="grid gap-3 sm:grid-cols-3">
      <BaseCard v-for="f in features" :key="f.title" class="p-5">
        <h3 class="mb-1 text-base font-bold text-heading">{{ f.title }}</h3>
        <p class="text-sm leading-relaxed text-muted">{{ f.desc }}</p>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped lang="scss" src="@/assets/styles/pages/home.scss"></style>
