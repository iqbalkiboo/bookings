<script setup lang="ts">
import { computed } from 'vue'
import type { ConcertEvent } from '@/data/concerts'
import { useBallotStore } from '@/stores/ballot'
import BaseButton from '@/components/atoms/BaseButton.vue'
import StepTracker from '@/components/molecules/StepTracker.vue'
import BallotTierList from '@/components/organisms/BallotTierList.vue'
import BallotForm from '@/components/organisms/BallotForm.vue'

defineProps<{ concert: ConcertEvent }>()

const ballotStore = useBallotStore()

const STEPS = ['Daftar', 'Menunggu Undian', 'Hasil']

/** Tahap ballot: 1 = daftar, 2 = menunggu undian, 3 = hasil */
const step = computed(() => {
  if (ballotStore.drawn) return 3
  if (ballotStore.isRegistered) return 2
  return 1
})

const selectedId = computed(
  () => ballotStore.registration?.categoryId ?? ballotStore.form.categoryId,
)

function pick(id: string) {
  if (ballotStore.isRegistered || ballotStore.drawn) return
  ballotStore.form.categoryId = id
}
</script>

<template>
  <div class="ballot-panel" :style="{ '--c-color': concert.color }">
    <div class="ballot-hero">
      <div class="ballot-hero-text">
        <span class="eyebrow">BALLOT SYSTEM</span>
        <h2 class="ballot-title">Undian Tiket Konser</h2>
        <p class="ballot-desc">
          Tanpa rebutan! Daftar dulu, pemenang diundi secara acak. Semua pendaftar punya
          peluang yang sama — cocok untuk permintaan yang jauh melebihi kuota.
        </p>
      </div>
      <div class="ballot-hero-side">
        <span class="ballot-fair">100% Acak &amp; Adil</span>
        <BaseButton variant="ghost" size="sm" @click="ballotStore.resetDemo()">Ulangi Demo</BaseButton>
      </div>
    </div>

    <StepTracker :steps="STEPS" :current="step" />

    <div class="ballot-grid">
      <section class="ballot-col">
        <h3 class="ballot-section-title">
          Pilih Kategori
          <small v-if="step === 1">klik kartu untuk memilih</small>
        </h3>
        <BallotTierList
          :categories="ballotStore.categories"
          :selected-id="selectedId"
          :locked="step > 1"
          @pick="pick"
        />
      </section>

      <section class="ballot-col">
        <BallotForm v-if="!ballotStore.isRegistered && !ballotStore.drawn" />

        <!-- Sudah daftar, belum drawing -->
        <div v-else-if="!ballotStore.drawn" class="result result--wait">
          <p class="result-title">Pendaftaran diterima!</p>
          <div class="lot">
            <span class="lot-label">NOMOR UNDIAN</span>
            <strong class="lot-number">{{ ballotStore.registration?.number }}</strong>
            <span class="lot-cat">{{ ballotStore.myCategory?.name }}</span>
          </div>
          <p class="result-sub">Drawing dilakukan secara acak setelah periode pendaftaran tutup.</p>
          <BaseButton size="lg" block @click="ballotStore.runDraw()">
            Simulasi Drawing Sekarang
          </BaseButton>
        </div>

        <!-- Menang -->
        <div v-else-if="ballotStore.won" class="result result--win">
          <p class="result-title result-title--win">SELAMAT, KAMU TERPILIH!</p>
          <p class="result-sub">
            Kamu memenangkan <strong>{{ ballotStore.myCategory?.name }}</strong>.
          </p>
          <div class="lot lot--win">
            <span class="lot-label">KODE TIKET</span>
            <strong class="ticket-code-inline">{{ ballotStore.ticketCode }}</strong>
          </div>
          <RouterLink to="/tickets" class="result-cta">Lihat Tiket Saya</RouterLink>
        </div>

        <!-- Kalah -->
        <div v-else class="result result--lose">
          <p class="result-title">Belum beruntung kali ini</p>
          <p class="result-sub">
            Nomor <strong>{{ ballotStore.registration?.number }}</strong> tidak terpilih di
            drawing ini. Jangan menyerah — banyak jalan menuju panggung!
          </p>
          <BaseButton variant="secondary" block @click="ballotStore.resetDemo()">
            Coba Daftar Lagi
          </BaseButton>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/organisms/ballot-panel.scss"></style>

