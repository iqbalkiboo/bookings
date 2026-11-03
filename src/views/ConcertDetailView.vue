<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getConcertById } from '@/data/concerts'
import { useTicketWarStore } from '@/stores/ticketwar'
import { useBallotStore } from '@/stores/ballot'
import BaseButton from '@/components/atoms/BaseButton.vue'
import SegmentedTabs from '@/components/molecules/SegmentedTabs.vue'
import ConcertHero from '@/components/organisms/ConcertHero.vue'
import WarPanel from '@/components/organisms/WarPanel.vue'
import BallotPanel from '@/components/organisms/BallotPanel.vue'

type Tab = 'war' | 'ballot'

const route = useRoute()
const warStore = useTicketWarStore()
const ballotStore = useBallotStore()

const concert = computed(() => getConcertById(route.params.id as string))

watch(
  concert,
  (value) => {
    if (value) {
      warStore.setEvent(value)
      ballotStore.setEvent(value)
    }
  },
  { immediate: true },
)

const showWar = computed(() => concert.value?.saleMode !== 'ballot')
const showBallot = computed(() => concert.value?.saleMode !== 'war')

const activeTab = ref<Tab>('war')
watch(
  showWar,
  (war) => {
    activeTab.value = war ? 'war' : 'ballot'
  },
  { immediate: true },
)

<<<<<<< HEAD
const tabs = [
  { value: 'war' as const, label: 'Ticket War', hint: 'first come, first served' },
  { value: 'ballot' as const, label: 'Ballot', hint: 'undian adil' },
]
=======
/** Tahap ballot: 1 = daftar, 2 = menunggu undian, 3 = hasil */
const ballotStep = computed(() => {
  if (ballotStore.drawn) return 3
  if (ballotStore.isRegistered) return 2
  return 1
})
const ballotSteps = ['Daftar', 'Menunggu Undian', 'Hasil']

function catFill(cat: { registered: number; quota: number }): number {
  return Math.min(100, Math.round((cat.registered / cat.quota) * 100))
}

function pickCategory(id: string | number) {
  if (ballotStore.isRegistered || ballotStore.drawn) return
  ballotStore.form.categoryId = id as typeof ballotStore.form.categoryId
}
>>>>>>> 46bdccfccc9a8ca29d927e97dca8ddf2462dc074
</script>

<template>
  <template v-if="concert">
    <ConcertHero
      :concert="concert"
      :show-war="showWar"
      :show-ballot="showBallot"
      :online-users="warStore.onlineUsers"
      :stock="warStore.stock"
    />

<<<<<<< HEAD
    <SegmentedTabs v-if="showWar && showBallot" v-model="activeTab" :tabs="tabs" />
=======
      <div class="cd-main">
        <RouterLink to="/concerts" class="cd-back">Semua Konser</RouterLink>
        <div class="cd-tags">
          <span class="cd-tag cd-tag--gold">KONSER</span>
          <span v-if="showWar" class="cd-tag">TICKET WAR</span>
          <span v-if="showBallot" class="cd-tag">BALLOT</span>
        </div>
        <h1 class="cd-artist">{{ concert.artist }}</h1>
        <p class="cd-tour">{{ concert.tour }}</p>
>>>>>>> 46bdccfccc9a8ca29d927e97dca8ddf2462dc074

    <WarPanel
      v-if="activeTab === 'war' && showWar"
      :concert="concert"
      :show-ballot="showBallot"
      @go-ballot="activeTab = 'ballot'"
    />

<<<<<<< HEAD
    <BallotPanel v-if="activeTab === 'ballot' && showBallot" :concert="concert" />
=======
      <div class="cd-stats">
        <div class="cd-stat">
          <strong class="cd-stat-value">{{ formatNumber(warStore.onlineUsers) }}</strong>
          <span class="cd-stat-label cd-live"><i></i> online</span>
        </div>
        <div v-if="showWar" class="cd-stat">
          <strong class="cd-stat-value" style="color:var(--color-gold);">{{ formatNumber(warStore.stock) }}</strong>
          <span class="cd-stat-label">tiket tersisa</span>
        </div>
      </div>
    </div>

    <!-- ─── Tabs ─── -->
    <div v-if="showWar && showBallot" class="seg" role="tablist">
      <button
        id="tab-war"
        type="button"
        class="seg-btn"
        :class="{ 'seg-btn--on': activeTab === 'war' }"
        role="tab"
        :aria-selected="activeTab === 'war'"
        @click="activeTab = 'war'"
      >
        Ticket War <small>first come, first served</small>
      </button>
      <button
        id="tab-ballot"
        type="button"
        class="seg-btn"
        :class="{ 'seg-btn--on': activeTab === 'ballot' }"
        role="tab"
        :aria-selected="activeTab === 'ballot'"
        @click="activeTab = 'ballot'"
      >
        Ballot <small>undian adil</small>
      </button>
    </div>

    <!-- ══════════════════════ TICKET WAR ══════════════════════ -->
    <div v-if="activeTab === 'war' && showWar" class="panel">
      <div class="war-hero">
        <div>
          <span class="ballot-eyebrow">TICKET WAR</span>
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
        <!-- Stock bar -->
        <div class="stock-bar">
          <div class="stock-bar-header">
            <span>Stok tiket</span>
            <span style="color:var(--color-primary);">{{ warStore.stock }} sisa</span>
          </div>
          <ProgressBar
            :percent="warStore.soldPercent"
            :tone="warStore.soldPercent >= 80 ? 'danger' : 'primary'"
          />
          <p class="stock-bar-sub">{{ warStore.soldPercent }}% sudah terjual — stok berkurang real-time!</p>
        </div>

        <!-- Belum ikut antrean -->
        <div
          v-if="!warStore.queueJoined && !warStore.purchased"
          class="war-box war-box--join"
        >
          <div class="war-box-icon">🚦</div>
          <p class="war-box-title">Antrean virtual belum diikuti</p>
          <p class="war-box-sub">
            Gabung antrean untuk mendapat giliran checkout yang aman (menghindari tabrakan
            request saat traffic tinggi).
          </p>
          <BaseButton size="lg" style="margin-top:0.85rem;" @click="warStore.joinQueue()">
            Gabung Antrean
          </BaseButton>
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
          <BaseButton size="lg" style="margin-top:1rem;" @click="warStore.buy()">
            Beli 1 Tiket — {{ formatIDR(concert.warPrice) }}
          </BaseButton>
        </div>

        <!-- Sukses beli -->
        <div v-if="warStore.purchased" class="war-box war-box--success">
          <div class="success-icon">🎫</div>
          <p class="war-box-title" style="color:#00c96e;">SELAMAT! Tiket berhasil didapat!</p>
          <p class="war-box-sub">
            Kode: <strong class="ticket-code-inline">{{ warStore.purchased.code }}</strong>
          </p>
          <RouterLink to="/tickets" class="success-link">Lihat Tiket Saya →</RouterLink>
        </div>
      </template>

      <!-- Soldout -->
      <div v-else class="war-box war-box--soldout">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">😢</div>
        <p class="war-box-title">Tiket Habis</p>
        <p class="war-box-sub">
          Semua tiket terjual dalam waktu singkat.
          <template v-if="showBallot">
            Coba ikuti <strong>Ballot</strong> untuk jadwal berikutnya, atau pantau restock resmi.
          </template>
        </p>
        <BaseButton
          v-if="showBallot"
          variant="secondary"
          style="margin-top:0.85rem;"
          @click="activeTab = 'ballot'"
        >
          Lihat Sistem Ballot
        </BaseButton>
      </div>

      <p v-if="warStore.lastError" class="error-msg">⚠️ {{ warStore.lastError }}</p>
    </div>

    <!-- ══════════════════════ BALLOT ══════════════════════ -->
    <div v-if="activeTab === 'ballot' && showBallot" class="panel ballot" :style="{ '--c-color': concert.color }">
      <!-- Hero -->
      <div class="ballot-hero">
        <div class="ballot-hero-text">
          <span class="ballot-eyebrow">BALLOT SYSTEM</span>
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

      <!-- Step tracker -->
      <ol class="steps">
        <li
          v-for="(label, i) in ballotSteps"
          :key="label"
          class="step"
          :class="{ 'step--done': ballotStep > i + 1, 'step--active': ballotStep === i + 1 }"
        >
          <span class="step-dot">{{ ballotStep > i + 1 ? '✓' : i + 1 }}</span>
          <span class="step-label">{{ label }}</span>
        </li>
      </ol>

      <div class="ballot-grid">
        <!-- Kiri: kategori -->
        <section class="ballot-col">
          <h3 class="section-sub-title">
            Pilih Kategori
            <small v-if="ballotStep === 1">klik kartu untuk memilih</small>
          </h3>
          <div class="tiers">
            <button
              v-for="cat in ballotStore.categories"
              :key="cat.id"
              type="button"
              class="tier"
              :class="{
                'tier--on': (ballotStore.registration?.categoryId ?? ballotStore.form.categoryId) === cat.id,
                'tier--locked': ballotStep > 1,
              }"
              @click="pickCategory(cat.id)"
            >
              <span class="tier-main">
                <strong class="tier-name">{{ cat.name }}</strong>
                <span class="tier-count">{{ cat.registered }}/{{ cat.quota }} pendaftar</span>
                <span class="tier-meter">
                  <i
                    :style="{ width: catFill(cat) + '%' }"
                    :class="{ 'tier-hot': catFill(cat) >= 80 }"
                  ></i>
                </span>
              </span>
              <span class="tier-side">
                <strong class="tier-price">{{ formatIDR(cat.price) }}</strong>
                <span class="tier-pct" :class="{ 'tier-pct--hot': catFill(cat) >= 80 }">
                  {{ catFill(cat) }}%
                </span>
              </span>
              <span class="tier-check">✓</span>
            </button>
          </div>
        </section>

        <!-- Kanan: aksi -->
        <section class="ballot-col">
          <!-- Form pendaftaran -->
          <form
            v-if="!ballotStore.isRegistered && !ballotStore.drawn"
            class="ballot-form"
            @submit.prevent="ballotStore.register()"
          >
            <h3 class="section-sub-title">Formulir Pendaftaran</h3>

            <FormField label="Nama Lengkap">
              <input
                v-model="ballotStore.form.name"
                class="form-control"
                type="text"
                placeholder="Nama sesuai ID"
                required
              />
            </FormField>

            <FormField label="Email">
              <input
                v-model="ballotStore.form.email"
                class="form-control"
                type="email"
                placeholder="nama@email.com"
                required
              />
            </FormField>

            <FormField label="Kategori Tiket">
              <select v-model="ballotStore.form.categoryId" class="form-control">
                <option v-for="cat in ballotStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }} — {{ formatIDR(cat.price) }}
                </option>
              </select>
            </FormField>

            <div class="ballot-summary">
              <span>Kategori dipilih</span>
              <strong>{{ ballotStore.selectedCategory?.name }}</strong>
            </div>

            <BaseButton type="submit" block size="lg">Daftar Ballot</BaseButton>
          </form>

          <!-- Sudah daftar, belum drawing -->
          <div v-else-if="!ballotStore.drawn" class="result result--wait">
            <div class="result-icon">✅</div>
            <p class="result-title">Pendaftaran diterima!</p>
            <div class="lot">
              <span class="lot-label">NOMOR UNDIAN</span>
              <strong class="lot-number">{{ ballotStore.registration?.number }}</strong>
              <span class="lot-cat">{{ ballotStore.myCategory?.name }}</span>
            </div>
            <p class="result-sub">
              Drawing dilakukan secara acak setelah periode pendaftaran tutup.
            </p>
            <BaseButton size="lg" block @click="ballotStore.runDraw()">
              Simulasi Drawing Sekarang
            </BaseButton>
          </div>

          <!-- Menang -->
          <div v-else-if="ballotStore.won" class="result result--win">
            <div class="result-icon success-icon">🎉</div>
            <p class="result-title result-title--win">SELAMAT, KAMU TERPILIH!</p>
            <p class="result-sub">
              Kamu memenangkan <strong>{{ ballotStore.myCategory?.name }}</strong>.
            </p>
            <div class="lot lot--win">
              <span class="lot-label">KODE TIKET</span>
              <strong class="ticket-code-inline">{{ ballotStore.ticketCode }}</strong>
            </div>
            <RouterLink to="/tickets" class="result-cta">Lihat Tiket Saya →</RouterLink>
          </div>

          <!-- Kalah -->
          <div v-else class="result result--lose">
            <div class="result-icon">😵</div>
            <p class="result-title">Belum beruntung kali ini</p>
            <p class="result-sub">
              Nomor <strong>{{ ballotStore.registration?.number }}</strong> tidak terpilih di
              drawing ini. Jangan menyerah — banyak jalan menuju panggung! 💜
            </p>
            <BaseButton variant="secondary" block @click="ballotStore.resetDemo()">
              Coba Daftar Lagi
            </BaseButton>
          </div>
        </section>
      </div>
    </div>
>>>>>>> 46bdccfccc9a8ca29d927e97dca8ddf2462dc074
  </template>

  <div v-else class="not-found">
<<<<<<< HEAD
    <p class="not-found-text">Konser tidak ditemukan.</p>
=======
    <div style="font-size:3rem; margin-bottom:0.75rem;">😢</div>
    <p style="color:var(--color-muted); font-weight:700; margin-bottom:1rem;">Konser tidak ditemukan.</p>
>>>>>>> 46bdccfccc9a8ca29d927e97dca8ddf2462dc074
    <BaseButton to="/concerts">Kembali ke Daftar Konser</BaseButton>
  </div>
</template>

<style scoped lang="scss" src="@/assets/styles/pages/concert-detail.scss"></style>
