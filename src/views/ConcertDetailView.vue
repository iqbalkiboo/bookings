<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getConcertById } from '@/data/concerts'
import { useTicketWarStore } from '@/stores/ticketwar'
import { useBallotStore } from '@/stores/ballot'
import { formatIDR, formatNumber } from '@/utils/format'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import FormField from '@/components/ui/FormField.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'

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

const showWar    = computed(() => concert.value?.saleMode !== 'ballot')
const showBallot = computed(() => concert.value?.saleMode !== 'war')
const defaultTab = computed(() => (showWar.value ? 'war' : 'ballot'))

const activeTab = ref<'war' | 'ballot'>('war')
watch(defaultTab, (tab) => { activeTab.value = tab }, { immediate: true })

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
</script>

<template>
  <template v-if="concert">
    <!-- ─── Concert Hero ─── -->
    <div class="cd-hero" :style="{ '--c-color': concert.color }">
      <span class="cd-emoji">{{ concert.poster }}</span>

      <div class="cd-main">
        <RouterLink to="/concerts" class="cd-back">Semua Konser</RouterLink>
        <div class="cd-tags">
          <span class="cd-tag cd-tag--gold">KONSER</span>
          <span v-if="showWar" class="cd-tag">TICKET WAR</span>
          <span v-if="showBallot" class="cd-tag">BALLOT</span>
        </div>
        <h1 class="cd-artist">{{ concert.artist }}</h1>
        <p class="cd-tour">{{ concert.tour }}</p>

        <div class="cd-info">
          <div class="cd-chip">
            <span class="cd-chip-icon">🗓️</span>
            <span><small>TANGGAL</small><b>{{ concert.date }}</b></span>
          </div>
          <div class="cd-chip">
            <span class="cd-chip-icon">📍</span>
            <span><small>LOKASI</small><b>{{ concert.venue }}</b></span>
          </div>
        </div>
      </div>

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
  </template>

  <!-- Konser tidak ditemukan -->
  <div v-else class="not-found">
    <div style="font-size:3rem; margin-bottom:0.75rem;">😢</div>
    <p style="color:var(--color-muted); font-weight:700; margin-bottom:1rem;">Konser tidak ditemukan.</p>
    <BaseButton to="/concerts">Kembali ke Daftar Konser</BaseButton>
  </div>
</template>

<style scoped>
/* ── Concert Header ── */
.concert-header {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}
.concert-header-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13,14,17,0.5), rgba(13,14,17,0.85));
  z-index: 0;
}
.concert-header-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
}
.concert-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}
.concert-avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.concert-avatar-icon { font-size: 1.8rem; }
.concert-header-title {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--color-heading);
  margin: 0.35rem 0 0.2rem;
  line-height: 1.25;
}
.concert-header-meta {
  font-size: 0.8rem;
  color: var(--color-muted);
  font-weight: 600;
}
.concert-header-stats {
  display: flex;
  gap: 1.5rem;
}
.concert-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.concert-stat-value {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--color-primary);
  text-shadow: 0 0 10px rgba(227,0,27,0.4);
  line-height: 1;
}
.concert-stat-label {
  font-size: 0.68rem;
  color: var(--color-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Tabs ── */
.tab-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.tab-btn {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-muted);
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.tab-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-heading);
}
.tab-btn--active {
  background: linear-gradient(135deg, #e3001b, #a80014) !important;
  border-color: var(--color-primary) !important;
  color: #fff !important;
  box-shadow: 0 0 16px rgba(227,0,27,0.4) !important;
}

/* ── Panel ── */
.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.35);
  position: relative;
  overflow: hidden;
}
.panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(227,0,27,0.03) 0%, transparent 50%);
  pointer-events: none;
}
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.panel-title {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--color-heading);
  margin-bottom: 0.4rem;
}
.panel-subtitle {
  font-size: 0.8rem;
  color: var(--color-muted);
  font-weight: 600;
  line-height: 1.5;
}

/* ── Stock bar ── */
.stock-bar {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-line);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
}
.stock-bar-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}
.stock-bar-sub {
  font-size: 0.72rem;
  color: var(--color-muted);
  font-weight: 600;
  margin-top: 0.4rem;
}

/* ── War boxes ── */
.war-box {
  border-radius: 14px;
  border: 1px dashed var(--color-line);
  padding: 1.75rem 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.war-box--upcoming {
  padding: 2.25rem 1.5rem;
  border: 1px solid color-mix(in srgb, var(--color-gold) 35%, transparent);
  border-style: solid;
  background:
    radial-gradient(circle at 50% 0%, rgba(247,199,0,0.12), transparent 65%),
    var(--color-surface-alt);
  box-shadow: inset 0 0 40px rgba(0,0,0,0.35);
}
.war-box--upcoming .countdown-big {
  display: inline-block;
  margin: 0.75rem auto 0.9rem;
  padding: 0.4rem 1.6rem;
  font-size: 3.4rem;
  color: var(--color-gold);
  text-shadow: 0 0 24px rgba(247,199,0,0.55);
  border: 1px solid color-mix(in srgb, var(--color-gold) 35%, transparent);
  border-radius: 16px;
  background: rgba(0,0,0,0.35);
}
.war-box--join {
  background: var(--color-surface-alt);
}
.war-box--queue {
  background: rgba(0,212,255,0.04);
  border-color: rgba(0,212,255,0.2);
}
.war-box--purchase {
  background: rgba(247,199,0,0.05);
  border-color: rgba(247,199,0,0.3);
  border-style: solid;
}
.war-box--success {
  background: rgba(0,201,110,0.06);
  border-color: rgba(0,201,110,0.3);
  border-style: solid;
}
.war-box--soldout {
  background: var(--color-surface-alt);
}
.war-box-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.war-box-title {
  font-size: 1rem;
  font-weight: 900;
  color: var(--color-heading);
  margin-bottom: 0.4rem;
}
.war-box-sub {
  font-size: 0.82rem;
  color: var(--color-muted);
  font-weight: 600;
  line-height: 1.55;
  max-width: 420px;
  margin: 0 auto;
}

/* ── Queue ring ── */
.queue-ring {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid rgba(0,212,255,0.5);
  background: rgba(0,212,255,0.08);
  box-shadow: 0 0 24px rgba(0,212,255,0.3);
  margin-bottom: 0.85rem;
}
.queue-pos {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-accent);
  text-shadow: 0 0 12px rgba(0,212,255,0.6);
}
.queue-progress {
  max-width: 240px;
  margin: 0.75rem auto 0.5rem;
}

/* ── Purchase pulse ── */
.purchase-pulse {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  animation: neon-pulse-gold 2.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes neon-pulse-gold {
  0%, 100% { box-shadow: inset 0 0 0 1px rgba(247,199,0,0.1); }
  50%       { box-shadow: inset 0 0 30px rgba(247,199,0,0.15); }
}

/* ── Countdown ── */
.countdown-big {
  display: block;
  font-size: 2.8rem;
  font-weight: 900;
  color: var(--color-primary);
  text-shadow: 0 0 20px rgba(227,0,27,0.6);
  letter-spacing: 0.05em;
  margin: 0.5rem auto;
}
.countdown-big--gold {
  color: #f7c700;
  text-shadow: 0 0 20px rgba(247,199,0,0.6);
}

/* ── Success ── */
.success-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  animation: bounce 0.6s ease;
}
@keyframes bounce {
  0% { transform: scale(0.5); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.success-link {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: #00c96e;
  text-decoration: underline;
}
.ticket-code-inline {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.65rem;
  color: var(--color-primary);
  background: var(--color-surface-alt);
  border: 1px dashed var(--color-line);
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  letter-spacing: 0.1em;
}

/* ── Ballot cats ── */
.ballot-cats {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.ballot-cat {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-line);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.82rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ballot-cat--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  box-shadow: 0 0 12px rgba(227,0,27,0.2);
}
.ballot-cat-name {
  font-weight: 800;
  color: var(--color-heading);
  font-size: 0.9rem;
}
.ballot-cat-price {
  font-weight: 900;
  color: var(--color-primary);
  font-size: 0.95rem;
  text-shadow: 0 0 8px rgba(227,0,27,0.3);
}
.ballot-cat-count {
  font-size: 0.72rem;
  color: var(--color-muted);
  font-weight: 600;
}

/* ── Ballot form ── */
.ballot-form { max-width: 480px; }
.section-sub-title {
  font-size: 0.95rem;
  font-weight: 900;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

/* ── Concert hero (cinematic) ── */
.cd-hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 1.5rem;
  min-height: 250px;
  padding: 2rem 2.25rem;
  margin-bottom: 1.25rem;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--color-gold) 40%, transparent);
  background:
    radial-gradient(ellipse at 85% 10%, color-mix(in srgb, var(--c-color) 70%, transparent), transparent 60%),
    linear-gradient(135deg, color-mix(in srgb, var(--c-color) 35%, #05060a), #07080c 80%);
  box-shadow: 0 24px 60px rgba(0,0,0,0.55);
}
.cd-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.12;
  background-image: repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 7px);
  pointer-events: none;
}
.cd-hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-gold), var(--color-accent), transparent);
}
.cd-emoji {
  position: absolute;
  right: 3%;
  top: -20px;
  font-size: 16rem;
  line-height: 1;
  opacity: 0.16;
  filter: blur(1px);
  pointer-events: none;
  animation: cd-float 6s ease-in-out infinite;
}
@keyframes cd-float {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-14px) rotate(3deg); }
}
.cd-main { position: relative; z-index: 1; min-width: 0; }
.cd-back {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: color 0.2s, transform 0.2s;
}
.cd-back:hover { color: var(--color-gold); transform: translateX(-3px); }
.cd-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.9rem; }
.cd-tag {
  padding: 4px 12px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
}
.cd-tag--gold { color: #1a1300; border-color: transparent; background: linear-gradient(90deg, #f7c700, #ffe27a); }
.cd-artist {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1;
  color: #fff;
  text-shadow: 0 4px 24px rgba(0,0,0,0.6);
}
.cd-tour {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: var(--color-gold);
}
.cd-info { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.25rem; }
.cd-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(8px);
}
.cd-chip-icon { font-size: 1.1rem; }
.cd-chip small { display: block; font-size: 0.58rem; font-weight: 800; letter-spacing: 0.18em; color: rgba(255,255,255,0.5); }
.cd-chip b { font-size: 0.82rem; font-weight: 800; color: #fff; }
.cd-stats { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 0.6rem; min-width: 170px; }
.cd-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.75rem 1rem;
  text-align: right;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
}
.cd-stat-value { font-size: 1.6rem; font-weight: 900; line-height: 1; color: #fff; }
.cd-stat-label { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.55); }
.cd-live { display: inline-flex; align-items: center; justify-content: flex-end; gap: 6px; }
.cd-live i {
  width: 8px; height: 8px; border-radius: 50%;
  background: #ff2a43;
  animation: cd-ping 1.6s infinite;
}
@keyframes cd-ping {
  0% { box-shadow: 0 0 0 0 rgba(255,42,67,0.7); }
  70%, 100% { box-shadow: 0 0 0 10px rgba(255,42,67,0); }
}

/* ── Segmented tabs ── */
.seg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 6px;
  margin-bottom: 1.25rem;
  border: 1px solid var(--color-line);
  border-radius: 16px;
  background: var(--color-surface);
}
.seg-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--color-muted);
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  transition: all 0.25s;
}
.seg-btn small { font-size: 0.66rem; font-weight: 700; opacity: 0.7; }
.seg-btn:hover { color: var(--color-heading); background: var(--color-surface-alt); }
.seg-btn--on,
.seg-btn--on:hover {
  color: #1a1300;
  background: linear-gradient(90deg, #f7c700, #ffe27a);
  box-shadow: 0 6px 22px rgba(247,199,0,0.3);
}

/* ── War hero ── */
.war-hero {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin: -1.5rem -1.5rem 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-line);
  background:
    radial-gradient(ellipse at 95% 0%, rgba(227,0,27,0.28), transparent 60%),
    linear-gradient(135deg, var(--color-surface-alt), var(--color-surface));
}
.war-hero-title { margin: 0.5rem 0 0.9rem; font-size: 1.6rem; font-weight: 900; line-height: 1.1; color: var(--color-heading); }
.war-facts { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.war-fact {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--color-line);
  border-radius: 12px;
  background: rgba(0,0,0,0.25);
}
.war-fact small { font-size: 0.58rem; font-weight: 800; letter-spacing: 0.18em; color: var(--color-muted); }
.war-fact b { font-size: 0.95rem; font-weight: 900; color: var(--color-heading); }
.war-fact--price b { color: var(--color-gold); }

@media (max-width: 760px) {
  .cd-hero { grid-template-columns: 1fr; padding: 1.5rem 1.25rem; }
  .cd-stats { flex-direction: row; }
  .cd-stat { flex: 1; text-align: left; }
  .cd-emoji { font-size: 9rem; }
}

/* ── Ballot (redesign) ── */
.ballot { padding: 0; }
.ballot::before { display: none; }
.ballot-hero {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.75rem 1.75rem 1.5rem;
  background:
    radial-gradient(ellipse at 90% 0%, color-mix(in srgb, var(--c-color) 45%, transparent), transparent 60%),
    linear-gradient(135deg, var(--color-surface-alt), var(--color-surface));
  border-bottom: 1px solid var(--color-line);
}
.ballot-hero::after {
  content: '🎟️';
  position: absolute;
  right: 1.5rem;
  bottom: -1.2rem;
  font-size: 6rem;
  opacity: 0.08;
  transform: rotate(-12deg);
  pointer-events: none;
}
.ballot-hero-text { max-width: 560px; position: relative; z-index: 1; }
.ballot-eyebrow {
  display: inline-block;
  padding: 3px 12px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: var(--color-gold);
  border: 1px solid color-mix(in srgb, var(--color-gold) 50%, transparent);
  border-radius: 999px;
  background: rgba(247,199,0,0.08);
}
.ballot-title {
  margin: 0.6rem 0 0.4rem;
  font-size: 1.7rem;
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-heading);
}
.ballot-desc {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--color-body);
  opacity: 0.8;
}
.ballot-hero-side {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
}
.ballot-fair {
  padding: 6px 14px;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--color-accent);
  border: 1px solid rgba(0,212,255,0.35);
  border-radius: 10px;
  background: rgba(0,212,255,0.07);
}

/* steps */
.steps {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 1.1rem 1.75rem;
  gap: 0.5rem;
  border-bottom: 1px solid var(--color-line);
  background: rgba(0,0,0,0.15);
}
.step {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--color-muted);
}
.step:not(:last-child)::after {
  content: '';
  flex: 1;
  height: 2px;
  margin: 0 0.4rem;
  border-radius: 2px;
  background: var(--color-line);
}
.step--done:not(:last-child)::after { background: var(--color-success); }
.step-dot {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  font-size: 0.75rem;
  border-radius: 50%;
  border: 2px solid var(--color-line);
  background: var(--color-surface);
}
.step--active { color: var(--color-heading); }
.step--active .step-dot {
  color: #1a1300;
  border-color: var(--color-gold);
  background: var(--color-gold);
  box-shadow: 0 0 16px rgba(247,199,0,0.5);
}
.step--done { color: var(--color-success); }
.step--done .step-dot {
  color: #fff;
  border-color: var(--color-success);
  background: var(--color-success);
}

/* grid */
.ballot-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 1.75rem;
  padding: 1.75rem;
  align-items: start;
}
.ballot-col { min-width: 0; }
.section-sub-title small {
  margin-left: 0.5rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-muted);
}

/* tier cards */
.tiers { display: flex; flex-direction: column; gap: 0.7rem; }
.tier {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 0.9rem 1rem;
  font: inherit;
  text-align: left;
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-line);
  border-radius: 14px;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.tier:hover:not(.tier--locked) {
  transform: translateX(4px);
  border-color: color-mix(in srgb, var(--color-gold) 60%, transparent);
}
.tier--locked { cursor: default; }
.tier--on {
  border-color: var(--color-gold);
  background: linear-gradient(120deg, rgba(247,199,0,0.1), var(--color-surface-alt));
  box-shadow: 0 0 22px rgba(247,199,0,0.12);
}
.tier--on::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--color-gold);
  box-shadow: 0 0 14px var(--color-gold);
}
.tier-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  font-size: 1.4rem;
  border-radius: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
}
.tier-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.tier-name { font-size: 0.95rem; font-weight: 900; color: var(--color-heading); }
.tier-count { font-size: 0.7rem; font-weight: 700; color: var(--color-muted); }
.tier-meter {
  height: 5px;
  margin-top: 3px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-surface);
}
.tier-meter i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-accent), #5be6ff);
  transition: width 0.6s ease;
}
.tier-meter i.tier-hot { background: linear-gradient(90deg, var(--color-primary), #ff6a3d); }
.tier-side { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.tier-price { font-size: 0.95rem; font-weight: 900; color: var(--color-gold); white-space: nowrap; }
.tier-pct { font-size: 0.7rem; font-weight: 800; color: var(--color-muted); }
.tier-pct--hot { color: #ff6a3d; }
.tier-check {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  font-size: 0.7rem;
  font-weight: 900;
  color: transparent;
  border-radius: 50%;
  border: 2px solid var(--color-line);
  transition: all 0.2s;
}
.tier--on .tier-check {
  color: #1a1300;
  background: var(--color-gold);
  border-color: var(--color-gold);
}

/* form */
.ballot-form {
  max-width: none;
  padding: 1.25rem;
  border: 1px solid var(--color-line);
  border-radius: 16px;
  background: linear-gradient(160deg, var(--color-surface-alt), var(--color-surface));
}
.ballot-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.25rem 0 1rem;
  padding: 0.7rem 0.9rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-muted);
  border: 1px dashed color-mix(in srgb, var(--color-gold) 40%, transparent);
  border-radius: 10px;
  background: rgba(247,199,0,0.05);
}
.ballot-summary strong { color: var(--color-gold); }

/* results */
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  padding: 1.75rem 1.25rem;
  text-align: center;
  border: 1px solid var(--color-line);
  border-radius: 16px;
  background: var(--color-surface-alt);
}
.result > :last-child { align-self: stretch; }
.result--wait { border-color: rgba(0,212,255,0.3); background: rgba(0,212,255,0.04); }
.result--win {
  border-color: rgba(0,201,110,0.45);
  background: radial-gradient(circle at 50% 0%, rgba(0,201,110,0.14), rgba(0,201,110,0.03));
  box-shadow: 0 0 30px rgba(0,201,110,0.12);
}
.result-icon { font-size: 2.6rem; line-height: 1; }
.result-title { font-size: 1.1rem; font-weight: 900; color: var(--color-heading); }
.result-title--win { color: var(--color-success); }
.result-sub { font-size: 0.82rem; line-height: 1.55; color: var(--color-muted); font-weight: 600; }
.result-sub strong { color: var(--color-heading); }
.lot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 1rem;
  border: 2px dashed rgba(0,212,255,0.4);
  border-radius: 14px;
  background: rgba(0,0,0,0.25);
}
.lot--win { border-color: rgba(0,201,110,0.5); }
.lot-label { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.25em; color: var(--color-muted); }
.lot-number {
  font-family: 'Press Start 2P', monospace;
  font-size: 1.4rem;
  color: var(--color-accent);
  text-shadow: 0 0 16px rgba(0,212,255,0.6);
}
.lot-cat { font-size: 0.78rem; font-weight: 800; color: var(--color-gold); }
.result-cta {
  display: block;
  padding: 0.75rem;
  font-weight: 900;
  font-size: 0.9rem;
  text-decoration: none;
  text-align: center;
  color: #fff;
  border-radius: 12px;
  background: linear-gradient(90deg, #00a85a, #00c96e);
  box-shadow: 0 8px 22px rgba(0,201,110,0.3);
  transition: transform 0.2s;
}
.result-cta:hover { transform: translateY(-2px); }

@media (max-width: 820px) {
  .ballot-grid { grid-template-columns: 1fr; padding: 1.25rem; }
  .ballot-hero { padding: 1.25rem; }
  .ballot-hero-side { align-items: flex-start; flex-direction: row; align-items: center; }
  .steps { padding: 1rem 1.25rem; }
  .step-label { display: none; }
  .step--active .step-label { display: inline; }
}

/* ── Error ── */
.error-msg {
  margin-top: 0.75rem;
  font-size: 0.82rem;
  color: var(--color-danger);
  font-weight: 700;
}

/* ── Not found ── */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
}
</style>
