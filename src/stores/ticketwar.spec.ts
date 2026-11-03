import { useTicketWarStore } from '@/stores/ticketwar'
import { useBookingsStore } from '@/stores/bookings'
import { getConcertById } from '@/data/concerts'

const SALE_OPEN_MS = 2 * 60_000 + 2_000

function setup() {
  jest.useFakeTimers()
  jest.spyOn(Math, 'random').mockReturnValue(0.99) // stok tidak berkurang, antrean maju 3/tick
  const store = useTicketWarStore()
  store.setEvent(getConcertById('bts')!)
  return store
}

function openSale(store: ReturnType<typeof useTicketWarStore>) {
  jest.advanceTimersByTime(SALE_OPEN_MS)
  expect(store.status).toBe('open')
}

describe('ticketwar store', () => {
  it('setEvent mengisi stok dan status awal upcoming', () => {
    const store = setup()
    expect(store.status).toBe('upcoming')
    expect(store.stock).toBe(137)
    expect(store.queueJoined).toBe(false)
  })

  it('status menjadi open setelah countdown berakhir', () => {
    const store = setup()
    openSale(store)
  })

  it('joinQueue ditolak saat penjualan belum dibuka', () => {
    const store = setup()
    store.joinQueue()
    expect(store.queueJoined).toBe(false)
  })

  it('joinQueue saat open mengisi posisi antrean', () => {
    const store = setup()
    openSale(store)
    store.joinQueue()
    expect(store.queueJoined).toBe(true)
    expect(store.queuePosition).toBeGreaterThanOrEqual(60)
  })

  it('antrean maju sampai mendapat jendela pembelian (hold 60 detik)', () => {
    const store = setup()
    openSale(store)
    store.joinQueue()
    jest.advanceTimersByTime(60_000)
    expect(store.inPurchaseWindow).toBe(true)
    expect(store.holdEndsAt).toBeGreaterThan(Date.now())
  })

  it('buy gagal jika belum mendapat giliran', () => {
    const store = setup()
    openSale(store)
    expect(store.buy()).toBe(false)
    expect(store.lastError).toMatch(/belum mendapat giliran/i)
  })

  it('buy gagal saat penjualan belum dibuka', () => {
    const store = setup()
    expect(store.buy()).toBe(false)
    expect(store.lastError).toMatch(/tidak dibuka/i)
  })

  it('buy sukses menambah tiket, mengurangi stok, dan menutup antrean', () => {
    const store = setup()
    openSale(store)
    store.joinQueue()
    jest.advanceTimersByTime(60_000)
    const stockBefore = store.stock

    expect(store.buy()).toBe(true)
    expect(store.purchased?.code).toMatch(/^WAR-/)
    expect(store.stock).toBe(stockBefore - 1)
    expect(store.inPurchaseWindow).toBe(false)
    expect(store.queueJoined).toBe(false)

    const tickets = useBookingsStore().tickets
    expect(tickets).toHaveLength(1)
    expect(tickets[0].type).toBe('concert-war')
  })

  it('tidak bisa membeli dua kali', () => {
    const store = setup()
    openSale(store)
    store.joinQueue()
    jest.advanceTimersByTime(60_000)
    store.buy()
    expect(store.buy()).toBe(false)
  })

  it('grace period habis melepas giliran checkout', () => {
    const store = setup()
    openSale(store)
    store.joinQueue()
    jest.advanceTimersByTime(60_000)
    expect(store.inPurchaseWindow).toBe(true)
    jest.advanceTimersByTime(61_000)
    expect(store.inPurchaseWindow).toBe(false)
    expect(store.lastError).toMatch(/habis/i)
  })

  it('resetDemo mengembalikan state awal', () => {
    const store = setup()
    openSale(store)
    store.joinQueue()
    store.resetDemo()
    expect(store.status).toBe('upcoming')
    expect(store.queueJoined).toBe(false)
    expect(store.stock).toBe(137)
    expect(store.purchased).toBeNull()
  })

  it('setEvent dengan konser yang sama tidak mereset', () => {
    const store = setup()
    openSale(store)
    store.setEvent(getConcertById('bts')!)
    expect(store.status).toBe('open')
  })

  it('soldPercent berada di rentang 0-100', () => {
    const store = setup()
    expect(store.soldPercent).toBeGreaterThanOrEqual(0)
    expect(store.soldPercent).toBeLessThanOrEqual(100)
  })
})

