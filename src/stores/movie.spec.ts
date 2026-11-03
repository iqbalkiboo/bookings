import { useMovieStore } from '@/stores/movie'
import { useBookingsStore } from '@/stores/bookings'

function prepare() {
  const store = useMovieStore()
  store.selectMovie(1)
  store.selectShowtime('mv1-1')
  return store
}

function freeSeat(store: ReturnType<typeof useMovieStore>) {
  for (const row of store.seatMap) {
    const seat = row.seats.find((s) => !s.occupied)
    if (seat) return seat.id
  }
  throw new Error('tidak ada kursi kosong')
}

function occupiedSeat(store: ReturnType<typeof useMovieStore>) {
  for (const row of store.seatMap) {
    const seat = row.seats.find((s) => s.occupied)
    if (seat) return seat.id
  }
  throw new Error('tidak ada kursi terisi')
}

describe('movie store', () => {
  it('seatMap kosong sebelum film & jadwal dipilih', () => {
    expect(useMovieStore().seatMap).toEqual([])
  })

  it('selectMovie / selectShowtime mengatur state dan mereset kursi', () => {
    const store = prepare()
    expect(store.selectedMovie?.id).toBe(1)
    expect(store.selectedShowtime?.id).toBe('mv1-1')
    store.toggleSeat(freeSeat(store), false)
    store.selectShowtime('mv1-2')
    expect(store.selectedSeats).toEqual([])
  })

  it('seatMap berukuran 6 baris x 8 kolom dan konsisten (deterministik)', () => {
    const store = prepare()
    expect(store.seatMap).toHaveLength(6)
    expect(store.seatMap.every((r) => r.seats.length === 8)).toBe(true)
    const snapshotA = JSON.stringify(store.seatMap)
    store.selectShowtime('mv1-2')
    store.selectShowtime('mv1-1')
    expect(JSON.stringify(store.seatMap)).toBe(snapshotA)
  })

  it('toggleSeat menambah/menghapus kursi dan mengabaikan kursi terisi', () => {
    const store = prepare()
    const seat = freeSeat(store)
    store.toggleSeat(seat, false)
    expect(store.selectedSeats).toEqual([seat])
    store.toggleSeat(seat, false)
    expect(store.selectedSeats).toEqual([])
    store.toggleSeat(occupiedSeat(store), true)
    expect(store.selectedSeats).toEqual([])
  })

  it('totalPrice = harga jadwal x jumlah kursi', () => {
    const store = prepare()
    const [a, b] = store.seatMap[0].seats.filter((s) => !s.occupied).slice(0, 2)
    store.toggleSeat(a.id, false)
    store.toggleSeat(b.id, false)
    expect(store.totalPrice).toBe(80_000)
  })

  it('selectDate mereset kursi hanya jika tanggal berbeda', () => {
    const store = prepare()
    store.toggleSeat(freeSeat(store), false)
    store.selectDate(0)
    expect(store.selectedSeats).toHaveLength(1)
    store.selectDate(1)
    expect(store.selectedSeats).toEqual([])
    expect(store.selectedDate).toBe(1)
  })

  it('clearMovie & clearShowtime membersihkan pilihan', () => {
    const store = prepare()
    store.clearShowtime()
    expect(store.selectedShowtime).toBeNull()
    expect(store.selectedMovie).not.toBeNull()
    store.clearMovie()
    expect(store.selectedMovie).toBeNull()
  })

  it('availability berada di rentang 35-90 dan stabil', () => {
    const store = prepare()
    const v = store.availability('mv1-1')
    expect(v).toBeGreaterThanOrEqual(35)
    expect(v).toBeLessThanOrEqual(90)
    expect(store.availability('mv1-1')).toBe(v)
  })

  it('confirmBooking gagal tanpa kursi', () => {
    const store = prepare()
    expect(store.confirmBooking()).toBe(false)
  })

  it('confirmBooking membuat tiket, menyimpan lastBooking, dan mengosongkan kursi', () => {
    const store = prepare()
    store.toggleSeat(freeSeat(store), false)
    expect(store.confirmBooking()).toBe(true)

    const bookings = useBookingsStore()
    expect(bookings.tickets).toHaveLength(1)
    expect(bookings.tickets[0].type).toBe('movie')
    expect(store.lastBooking?.code).toMatch(/^TIX-/)
    expect(store.selectedSeats).toEqual([])
  })

  it('onHoldExpired mengosongkan kursi terpilih', () => {
    const store = prepare()
    store.toggleSeat(freeSeat(store), false)
    store.onHoldExpired()
    expect(store.selectedSeats).toEqual([])
  })

  it('holdEndsAt diisi saat kursi pertama dipilih dan di-reset saat kosong', async () => {
    const store = prepare()
    expect(store.holdEndsAt).toBe(0)
    const seat = freeSeat(store)
    store.toggleSeat(seat, false)
    await Promise.resolve()
    expect(store.holdEndsAt).toBeGreaterThan(Date.now())
    store.toggleSeat(seat, false)
    await Promise.resolve()
    expect(store.holdEndsAt).toBe(0)
  })
})

