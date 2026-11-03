<script setup lang="ts">
import type { ConcertEvent } from '@/data/concerts'
import { useTicketWarStore } from '@/stores/ticketwar'
import { formatIDR } from '@/utils/format'
import BaseButton from '@/components/atoms/BaseButton.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import CountdownTimer from '@/components/atoms/CountdownTimer.vue'

defineProps<{
  concert: ConcertEvent
  showBallot: boolean
}>()

defineEmits<{ 'go-ballot': [] }>()

const warStore = useTicketWarStore()
</script>

<template>
  <div class="war-panel">
    <div class="war-hero">
      <div>
        <span class="eyebrow">TICKET WAR</span>
        <h2 class="war-hero-title">Penjualan Kilat</h2>
        <div class="war-facts">
          <div class="war-fact war-fact--price">
            <small>HARGA</small><b>{{ formatIDR(concert.warPrice) }}</b>
          </div>
          <div class="war-fact"><small>KATEGORI</small><b>CAT 1 Festival</b></div>
          <div class="war-fact"><small>MAKS PEMBELIAN</small><b>1 tiket / akun</b></div>
          <div class="war-fact"><small>WAKTU CHECKOUT</small><b>60 detik</b></div>
        </div>
      </div>
      <BaseButton variant="ghost" size="sm" @click="warStore.resetDemo()">Ulangi Demo</BaseButton>
    </div>

    <!-- Upcoming -->
    <div v-if="warStore.status === 'upcoming'" class="war-box war-box--upcoming">
      <p class="war-box-title">Penjualan belum dibuka</p>
      <CountdownTimer class="countdown-big" :ends-at="warStore.saleStartAt" />
      <p class="war-box-sub">Siapkan koneksi &amp; login kamu. First come, first served!</p>
    </div>

    <!-- Open -->
    <template v-else-if="warStore.status === 'open'">
      <div class="stock-bar">
        <div class="stock-bar-header">
          <span>Stok tiket</span>
          <span class="stock-bar-left">{{ warStore.stock }} sisa</span>
        </div>
        <ProgressBar
          :percent="warStore.soldPercent"
          :tone="warStore.soldPercent >= 80 ? 'danger' : 'primary'"
        />
        <p class="stock-bar-sub">{{ warStore.soldPercent }}% sudah terjual — stok berkurang real-time!</p>
      </div>

      <!-- Belum ikut antrean -->
      <div v-if="!warStore.queueJoined && !warStore.purchased" class="war-box war-box--join">
        <p class="war-box-title">Antrean virtual belum diikuti</p>
        <p class="war-box-sub">
          Gabung antrean untuk mendapat giliran checkout yang aman (menghindari tabrakan
          request saat traffic tinggi).
        </p>
        <BaseButton class="war-cta" size="lg" @click="warStore.joinQueue()">Gabung Antrean</BaseButton>
      </div>

      <!-- Dalam antrean -->
      <div
        v-else-if="warStore.queueJoined && !warStore.inPurchaseWindow"
        class="war-box war-box--queue"
      >
        <div class="queue-ring">
          <span class="queue-pos">#{{ warStore.queuePosition }}</span>
        </div>
        <p class="war-box-title">Kamu berada di antrean virtual</p>
        <div class="queue-progress">
          <ProgressBar :percent="100 - Math.min(100, warStore.queuePosition)" tone="accent" />
        </div>
        <p class="war-box-sub">Jangan tutup halaman ini — giliranmu sedang bergerak maju…</p>
      </div>

      <!-- Giliran checkout -->
      <div v-if="warStore.inPurchaseWindow" class="war-box war-box--purchase">
        <div class="purchase-pulse"></div>
        <p class="war-box-title">Giliran kamu! Kuota di-hold selama:</p>
        <CountdownTimer class="countdown-big countdown-big--gold" :ends-at="warStore.holdEndsAt" />
        <BaseButton class="war-cta" size="lg" @click="warStore.buy()">
          Beli 1 Tiket — {{ formatIDR(concert.warPrice) }}
        </BaseButton>
      </div>

      <!-- Sukses beli -->
      <div v-if="warStore.purchased" class="war-box war-box--success">
        <p class="war-box-title war-box-title--success">SELAMAT! Tiket berhasil didapat!</p>
        <p class="war-box-sub">
          Kode: <strong class="ticket-code-inline">{{ warStore.purchased.code }}</strong>
        </p>
        <RouterLink to="/tickets" class="success-link">Lihat Tiket Saya</RouterLink>
      </div>
    </template>

    <!-- Soldout -->
    <div v-else class="war-box war-box--soldout">
      <p class="war-box-title">Tiket Habis</p>
      <p class="war-box-sub">
        Semua tiket terjual dalam waktu singkat.
        <template v-if="showBallot">
          Coba ikuti <strong>Ballot</strong> untuk jadwal berikutnya, atau pantau restock resmi.
        </template>
      </p>
      <BaseButton v-if="showBallot" class="war-cta" variant="secondary" @click="$emit('go-ballot')">
        Lihat Sistem Ballot
      </BaseButton>
    </div>

    <p v-if="warStore.lastError" class="error-msg">{{ warStore.lastError }}</p>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/war-panel.scss"></style>

