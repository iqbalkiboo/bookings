import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { BallotCategory } from '@/types/ticketing'
import type { ConcertEvent } from '@/data/concerts'
import { useBookingsStore } from '@/stores/bookings'
import { generateCode } from '@/utils/format'
import type { BallotRegistration } from '@/types/ticketing'

const WIN_CHANCE = 0.4 // peluang menang drawing (simulasi)

interface BallotPersisted {
  registration: BallotRegistration | null
  drawn: boolean
  won: boolean
  ticketCode: string | null
}

function storageKey(concertId: string): string {
  return `tix-ballot-${concertId}`
}

function loadPersisted(concertId: string): BallotPersisted {
  try {
    const raw = localStorage.getItem(storageKey(concertId))
    if (raw) return JSON.parse(raw) as BallotPersisted
  } catch {
    // abaikan data korup
  }
  return { registration: null, drawn: false, won: false, ticketCode: null }
}

/** Kategori ballot diturunkan dari harga ticket war konser tersebut */
function categoriesFor(warPrice: number): BallotCategory[] {
  const mk = (
    id: string,
    name: string,
    mult: number,
    quota: number,
    registered: number,
  ): BallotCategory => ({
    id,
    name,
    price: Math.round((warPrice * mult) / 10_000) * 10_000,
    quota,
    registered,
  })

  return [
    mk('cat1', 'CAT 1 — Festival', 1, 400, 371),
    mk('cat2', 'CAT 2 — Festival', 0.8, 400, 288),
    mk('cat3', 'CAT 3 — Tribun Utara', 0.5, 400, 190),
    mk('cat4', 'CAT 4 — Tribun Selatan', 0.3, 400, 96),
  ]
}

/**
 * Sistem BALLOT (lottery) — alternatif ticket war untuk traffic tinggi:
 * semua pendaftar punya peluang sama, pemenang diundi, tanpa rebutan server.
 */
export const useBallotStore = defineStore('ballot', () => {
  const bookings = useBookingsStore()

  const event = ref<ConcertEvent | null>(null)
  const categories = ref<BallotCategory[]>([])
  const registration = ref<BallotRegistration | null>(null)
  const drawn = ref(false)
  const won = ref(false)
  const ticketCode = ref<string | null>(null)

  const form = ref({
    name: '',
    email: '',
    categoryId: 'cat2',
  })

  const selectedCategory = computed(
    () => categories.value.find((c) => c.id === form.value.categoryId) ?? categories.value[0],
  )
  const isRegistered = computed(() => registration.value !== null)
  const myCategory = computed(() =>
    registration.value
      ? categories.value.find((c) => c.id === registration.value!.categoryId)
      : null,
  )

  function persist() {
    if (!event.value) return
    localStorage.setItem(
      storageKey(event.value.id),
      JSON.stringify({
        registration: registration.value,
        drawn: drawn.value,
        won: won.value,
        ticketCode: ticketCode.value,
      }),
    )
  }

  /** Ganti konser aktif — muat state pendaftaran per konser dari localStorage */
  function setEvent(next: ConcertEvent) {
    if (event.value?.id === next.id) return
    event.value = next
    categories.value = categoriesFor(next.warPrice)

    const saved = loadPersisted(next.id)
    registration.value = saved.registration
    drawn.value = saved.drawn
    won.value = saved.won
    ticketCode.value = saved.ticketCode
    form.value = { name: '', email: '', categoryId: 'cat2' }
  }

  function register(): boolean {
    if (!event.value || isRegistered.value || drawn.value) return false
    if (!form.value.name.trim() || !form.value.email.trim()) return false

    const cat = selectedCategory.value
    if (!cat || cat.registered >= cat.quota) return false

    cat.registered++
    registration.value = {
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      categoryId: cat.id,
      number: generateCode('BLT', 8),
    }
    form.value = { name: '', email: '', categoryId: cat.id }
    persist()
    return true
  }

  /** Simulasi drawing: random, semua peserta peluangnya sama */
  function runDraw(): void {
    if (!event.value || !registration.value || drawn.value) return
    drawn.value = true

    if (Math.random() < WIN_CHANCE) {
      won.value = true
      const cat = myCategory.value
      const ticket = bookings.addTicket({
        type: 'concert-ballot',
        title: `${event.value.artist} — ${event.value.tour}`,
        subtitle: `${event.value.date} · ${event.value.venue} · ${cat?.name ?? 'Ballot'}`,
        seats: [(cat?.id ?? 'cat').toUpperCase()],
        total: cat?.price ?? 0,
        code: generateCode('BLT'),
      })
      ticketCode.value = ticket.code
    } else {
      won.value = false
      ticketCode.value = null
    }
    persist()
  }

  /** Ulangi simulasi dari awal (untuk demo) */
  function resetDemo() {
    registration.value = null
    drawn.value = false
    won.value = false
    ticketCode.value = null
    if (event.value) categories.value = categoriesFor(event.value.warPrice)
    persist()
  }

  return {
    event,
    categories,
    form,
    registration,
    drawn,
    won,
    ticketCode,
    selectedCategory,
    isRegistered,
    myCategory,
    setEvent,
    register,
    runDraw,
    resetDemo,
  }
})
