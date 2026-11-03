import { useBookingsStore } from '@/stores/bookings'
import type { Ticket } from '@/types/ticketing'

const base: Omit<Ticket, 'id' | 'createdAt'> = {
  type: 'movie',
  title: 'Film A',
  subtitle: '13:00',
  seats: ['A1'],
  total: 40_000,
  code: 'TIX-AAAAAA',
}

describe('bookings store', () => {
  it('addTicket menambah di awal dan menghasilkan id & createdAt', () => {
    const store = useBookingsStore()
    const first = store.addTicket(base)
    const second = store.addTicket({ ...base, title: 'Film B' })

    expect(first.id).toBeTruthy()
    expect(first.createdAt).toEqual(expect.any(Number))
    expect(store.tickets[0].title).toBe('Film B')
    expect(store.tickets).toHaveLength(2)
    expect(second.id).not.toBe(first.id)
  })

  it('persist ke localStorage', () => {
    const store = useBookingsStore()
    store.addTicket(base)
    const saved = JSON.parse(localStorage.getItem('tix-bookings') as string)
    expect(saved).toHaveLength(1)
    expect(saved[0].title).toBe('Film A')
  })

  it('removeTicket menghapus berdasarkan id', () => {
    const store = useBookingsStore()
    const t = store.addTicket(base)
    store.addTicket({ ...base, title: 'Film B' })
    store.removeTicket(t.id)
    expect(store.tickets.map((x) => x.title)).toEqual(['Film B'])
    expect(JSON.parse(localStorage.getItem('tix-bookings') as string)).toHaveLength(1)
  })

  it('memuat data tersimpan saat store dibuat', () => {
    localStorage.setItem('tix-bookings', JSON.stringify([{ ...base, id: 'x', createdAt: 1 }]))
    const store = useBookingsStore()
    expect(store.tickets).toHaveLength(1)
    expect(store.tickets[0].id).toBe('x')
  })

  it('mengabaikan data korup', () => {
    localStorage.setItem('tix-bookings', '{bukan json')
    const store = useBookingsStore()
    expect(store.tickets).toEqual([])
  })
})

