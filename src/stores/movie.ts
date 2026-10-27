import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { seedMovies } from '@/data/movies'
import { useBookingsStore } from '@/stores/bookings'
import { generateCode } from '@/utils/format'

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'] as const
const COLS = 8
const HOLD_DURATION_MS = 5 * 60_000 // kursi di-hold 5 menit (simulasi seat lock)

/** Hash deterministik agar kursi "terisi" konsisten per film + jadwal */
function isOccupied(movieId: number, showtimeId: string, seat: string): boolean {
  const seed = `${movieId}-${showtimeId}-${seat}`
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0
  }
  return Math.abs(h) % 100 < 25
}

export const useMovieStore = defineStore('movie', () => {
  const bookings = useBookingsStore()

  const movies = ref([...seedMovies])
  const selectedMovieId = ref<number | null>(null)
  const selectedShowtimeId = ref<string | null>(null)
  const selectedSeats = ref<string[]>([])
  const selectedDate = ref(0)
  const holdEndsAt = ref(0)
  const lastBooking = ref<{ code: string; seats: string[]; total: number } | null>(null)

  const selectedMovie = computed(
    () => movies.value.find((m) => m.id === selectedMovieId.value) ?? null,
  )
  const selectedShowtime = computed(
    () => selectedMovie.value?.showtimes.find((s) => s.id === selectedShowtimeId.value) ?? null,
  )
  const totalPrice = computed(
    () => (selectedShowtime.value?.price ?? 0) * selectedSeats.value.length,
  )

  function seatRows(): Array<{ row: string; seats: Array<{ id: string; occupied: boolean }> }> {
    if (!selectedMovie.value || !selectedShowtimeId.value) return []
    return ROWS.map((row) => ({
      row,
      seats: Array.from({ length: COLS }, (_, i) => {
        const id = `${row}${i + 1}`
        return { id, occupied: isOccupied(selectedMovie.value!.id, selectedShowtimeId.value!, id) }
      }),
    }))
  }

  const seatMap = computed(seatRows)

  function selectMovie(id: number) {
    selectedMovieId.value = id
    selectedShowtimeId.value = null
    selectedSeats.value = []
    selectedDate.value = 0
    lastBooking.value = null
  }

  function clearMovie() {
    selectedMovieId.value = null
    selectedShowtimeId.value = null
    selectedSeats.value = []
    selectedDate.value = 0
    lastBooking.value = null
  }

  function clearShowtime() {
    selectedShowtimeId.value = null
    selectedSeats.value = []
    lastBooking.value = null
  }

  function selectDate(index: number) {
    if (selectedDate.value === index) return
    selectedDate.value = index
    selectedSeats.value = []
    lastBooking.value = null
  }

  /** Persentase ketersediaan kursi (simulasi, konsisten per film+jadwal) */
  function availability(showtimeId: string): number {
    if (!selectedMovie.value) return 50
    const seed = `av-${selectedMovie.value.id}-${showtimeId}`
    let h = 0
    for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) | 0
    }
    return 35 + (Math.abs(h) % 56) // 35–90%
  }

  function selectShowtime(id: string) {
    if (selectedShowtimeId.value === id) return
    selectedShowtimeId.value = id
    selectedSeats.value = []
    lastBooking.value = null
  }

  // Seat hold: mulai countdown saat kursi pertama dipilih, habis → kosongkan
  watch(selectedSeats, (seats) => {
    if (seats.length > 0 && holdEndsAt.value === 0) {
      holdEndsAt.value = Date.now() + HOLD_DURATION_MS
    }
    if (seats.length === 0) holdEndsAt.value = 0
  })

  function onHoldExpired() {
    selectedSeats.value = []
  }

  function toggleSeat(seatId: string, occupied: boolean) {
    if (occupied) return
    selectedSeats.value = selectedSeats.value.includes(seatId)
      ? selectedSeats.value.filter((s) => s !== seatId)
      : [...selectedSeats.value, seatId]
  }

  function confirmBooking(): boolean {
    if (!selectedMovie.value || !selectedShowtime.value || selectedSeats.value.length === 0) {
      return false
    }
    const ticket = bookings.addTicket({
      type: 'movie',
      title: selectedMovie.value.title,
      subtitle: `${selectedShowtime.value.time} · ${selectedMovie.value.studio}`,
      seats: [...selectedSeats.value],
      total: totalPrice.value,
      code: generateCode('TIX'),
    })
    lastBooking.value = { code: ticket.code, seats: ticket.seats, total: ticket.total }
    selectedSeats.value = []
    return true
  }

  return {
    movies,
    selectedMovieId,
    selectedShowtimeId,
    selectedSeats,
    selectedDate,
    holdEndsAt,
    lastBooking,
    selectedMovie,
    selectedShowtime,
    totalPrice,
    seatMap,
    selectMovie,
    selectShowtime,
    clearMovie,
    clearShowtime,
    selectDate,
    availability,
    toggleSeat,
    onHoldExpired,
    confirmBooking,
  }
})
