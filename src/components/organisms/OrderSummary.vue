<script setup lang="ts">
import { useMovieStore } from '@/stores/movie'
import { formatIDR } from '@/utils/format'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import CountdownTimer from '@/components/atoms/CountdownTimer.vue'

defineProps<{
  dateLabel?: string
}>()

const store = useMovieStore()
</script>

<template>
  <BaseCard v-if="store.selectedMovie && store.selectedShowtime" class="order-summary-card">
    <h3 class="order-summary-title">Ringkasan Pesanan</h3>

    <dl class="order-summary-list">
      <div class="order-summary-row">
        <dt class="order-summary-label">Film</dt>
        <dd class="order-summary-value truncate">
          {{ store.selectedMovie.title }}
        </dd>
      </div>
      <div class="order-summary-row">
        <dt class="order-summary-label">Jadwal</dt>
        <dd class="order-summary-value">
          {{ dateLabel }}, {{ store.selectedShowtime.time }} WIB
        </dd>
      </div>
      <div class="order-summary-row">
        <dt class="order-summary-label">Kursi</dt>
        <dd class="order-summary-value">
          {{ store.selectedSeats.length ? store.selectedSeats.join(', ') : '—' }}
        </dd>
      </div>
      <div class="order-summary-row">
        <dt class="order-summary-label">Harga / tiket</dt>
        <dd class="order-summary-value">{{ formatIDR(store.selectedShowtime.price) }}</dd>
      </div>
    </dl>

    <div class="order-summary-divider"></div>

    <div class="order-summary-total">
      <span class="order-summary-total-label">Total</span>
      <span class="order-summary-total-price">{{ formatIDR(store.totalPrice) }}</span>
    </div>

    <BaseButton
      class="order-summary-submit"
      block
      size="lg"
      :disabled="store.selectedSeats.length === 0"
      @click="store.confirmBooking()"
    >
      Bayar Sekarang
    </BaseButton>

    <p class="order-summary-hint">
      Kursi di-hold 5 menit sejak pertama dipilih.
    </p>

    <!-- sukses -->
    <div v-if="store.lastBooking" class="order-summary-success">
      <p class="order-summary-success-text">
        Pembayaran berhasil! Kode: <span class="font-mono">{{ store.lastBooking.code }}</span>
      </p>
      <div class="flex flex-wrap gap-2">
        <BaseButton to="/tickets" size="sm" variant="secondary">Lihat Tiket Saya</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="store.clearShowtime()">Pesan Lagi</BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/order-summary.scss"></style>

