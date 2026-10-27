import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ConcertEvent } from '@/data/concerts'
import { useBookingsStore } from '@/stores/bookings'
import { generateCode } from '@/utils/format'
import type { WarStatus } from '@/types/ticketing'

const SALE_COUNTDOWN_MS = 2 * 60_000 // penjualan dibuka 2 menit dari sekarang (demo)
const HOLD_WINDOW_MS = 60_000 // 60 detik checkout setelah giliran dapat
const TICKETS_PER_USER = 1 // anti-hoarding: 1 akun = 1 tiket

/**
 * Simulasi TICKET WAR — menggambarkan penanganan high traffic:
 * - Penjualan dibuka dengan countdown
 * - Antrean virtual (virtual waiting room)
 * - Seat hold / grace period checkout
 * - Stok berkurang real-time oleh "pembeli lain"
 */
export const useTicketWarStore = defineStore('ticketWar', () => {
  const bookings = useBookingsStore()

  const event = ref<ConcertEvent | null>(null)
  const now = ref(Date.now())
  const saleStartAt = ref(Date.now() + SALE_COUNTDOWN_MS)
  const status = ref<WarStatus>('upcoming')
  const stock = ref(0)
  const onlineUsers = ref(12_480)

  // antrean virtual
  const queueJoined = ref(false)
  const queuePosition = ref(0)
  const inPurchaseWindow = ref(false)
  const holdEndsAt = ref(0)
  const purchased = ref<{ code: string } | null>(null)
  const lastError = ref('')

  const totalCount = computed(() => Math.max(1, event.value?.warStock ?? 1) + stock.value)
  const soldPercent = computed(() =>
    Math.round(((totalCount.value - stock.value) / totalCount.value) * 100),
  )
  const canJoinQueue = computed(
    () =>
      status.value === 'open' &&
      !queueJoined.value &&
      !purchased.value &&
      event.value !== null,
  )

  function setEvent(next: ConcertEvent) {
    if (event.value?.id === next.id) return
    event.value = next
    resetDemo()
  }

  function resetDemo() {
    saleStartAt.value = Date.now() + SALE_COUNTDOWN_MS
    status.value = 'upcoming'
    stock.value = event.value?.warStock ?? 100
    queueJoined.value = false
    queuePosition.value = 0
    inPurchaseWindow.value = false
    holdEndsAt.value = 0
    purchased.value = null
    lastError.value = ''
  }

  // ===== simulasi traffic: stok berkurang, jumlah user naik-turun =====
  window.setInterval(() => {
    now.value = Date.now()

    if (status.value === 'upcoming' && now.value >= saleStartAt.value) {
      status.value = 'open'
    }

    if (status.value === 'open' && stock.value > 0 && Math.random() < 0.75) {
      stock.value = Math.max(0, stock.value - (1 + Math.floor(Math.random() * 4)))
    }
    if (status.value === 'open' && stock.value === 0) {
      status.value = 'soldout'
      if (queueJoined.value && !inPurchaseWindow.value) {
        queueJoined.value = false
        lastError.value = 'Maaf, tiket sudah habis sebelum giliran kamu tiba. 😢'
      }
    }

    onlineUsers.value = Math.max(1_000, onlineUsers.value + Math.floor(Math.random() * 800) - 380)
  }, 1_500)

  function joinQueue() {
    if (!canJoinQueue.value) return
    lastError.value = ''
    queueJoined.value = true
    // posisi antrean acak — persaingan tinggi!
    queuePosition.value = 60 + Math.floor(Math.random() * 80)
  }

  // ===== maju antrean =====
  window.setInterval(() => {
    now.value = Date.now()

    if (queueJoined.value && !inPurchaseWindow.value && queuePosition.value > 0) {
      queuePosition.value = Math.max(0, queuePosition.value - (1 + Math.floor(Math.random() * 3)))
      if (queuePosition.value === 0) {
        if (status.value === 'open' && stock.value > 0) {
          inPurchaseWindow.value = true
          holdEndsAt.value = Date.now() + HOLD_WINDOW_MS
        } else {
          queueJoined.value = false
          lastError.value =
            status.value === 'soldout'
              ? 'Maaf, tiket sudah habis sebelum giliran kamu tiba. 😢'
              : 'Penjualan belum dibuka. Coba beberapa saat lagi.'
        }
      }
    }

    // grace period habis → kursi dilepas kembali ke pool
    if (inPurchaseWindow.value && now.value >= holdEndsAt.value) {
      inPurchaseWindow.value = false
      queueJoined.value = false
      lastError.value = 'Waktu checkout (60 detik) habis. Kuota dilepas ke antrean berikutnya!'
    }
  }, 900)

  function buy(): boolean {
    if (!event.value || purchased.value) return false
    if (status.value !== 'open') {
      lastError.value = 'Penjualan sedang tidak dibuka.'
      return false
    }
    if (!inPurchaseWindow.value) {
      lastError.value = 'Kamu belum mendapat giliran checkout.'
      return false
    }
    if (stock.value <= 0) {
      status.value = 'soldout'
      lastError.value = 'Tiket sudah habis! 😢'
      return false
    }

    stock.value -= TICKETS_PER_USER
    const ticket = bookings.addTicket({
      type: 'concert-war',
      title: `${event.value.artist} — ${event.value.tour}`,
      subtitle: `${event.value.date} · ${event.value.venue} · CAT 1 Festival`,
      seats: ['CAT1'],
      total: event.value.warPrice,
      code: generateCode('WAR'),
    })
    purchased.value = { code: ticket.code }
    inPurchaseWindow.value = false
    queueJoined.value = false
    lastError.value = ''
    return true
  }

  return {
    event,
    TICKETS_PER_USER,
    onlineUsers,
    status,
    stock,
    soldPercent,
    saleStartAt,
    queueJoined,
    queuePosition,
    inPurchaseWindow,
    holdEndsAt,
    purchased,
    lastError,
    canJoinQueue,
    setEvent,
    joinQueue,
    buy,
    resetDemo,
  }
})
