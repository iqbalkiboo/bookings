import { useBallotStore } from '@/stores/ballot'
import { useBookingsStore } from '@/stores/bookings'
import { getConcertById } from '@/data/concerts'

function setup(id = 'bts') {
  const store = useBallotStore()
  store.setEvent(getConcertById(id)!)
  return store
}

function fillForm(store: ReturnType<typeof useBallotStore>) {
  store.form.name = 'Budi'
  store.form.email = 'budi@mail.com'
}

describe('ballot store', () => {
  it('membuat 4 kategori dengan harga turunan dari warPrice', () => {
    const store = setup()
    expect(store.categories).toHaveLength(4)
    expect(store.categories[0].price).toBe(3_500_000)
    expect(store.categories[1].price).toBe(2_800_000)
  })

  it('register ditolak jika form kosong', () => {
    const store = setup()
    expect(store.register()).toBe(false)
    expect(store.isRegistered).toBe(false)
  })

  it('register sukses menambah pendaftar dan membuat nomor undian', () => {
    const store = setup()
    fillForm(store)
    const before = store.selectedCategory!.registered
    expect(store.register()).toBe(true)
    expect(store.isRegistered).toBe(true)
    expect(store.registration?.number).toMatch(/^BLT-/)
    expect(store.myCategory?.registered).toBe(before + 1)
  })

  it('register ditolak jika kuota kategori penuh', () => {
    const store = setup()
    fillForm(store)
    const cat = store.selectedCategory!
    cat.registered = cat.quota
    expect(store.register()).toBe(false)
  })

  it('register ditolak jika sudah terdaftar', () => {
    const store = setup()
    fillForm(store)
    store.register()
    fillForm(store)
    expect(store.register()).toBe(false)
  })

  it('runDraw menang: tiket masuk ke bookings', () => {
    const store = setup()
    fillForm(store)
    store.register()
    jest.spyOn(Math, 'random').mockReturnValue(0.1)
    store.runDraw()
    expect(store.drawn).toBe(true)
    expect(store.won).toBe(true)
    expect(store.ticketCode).toMatch(/^BLT-/)
    expect(useBookingsStore().tickets[0].type).toBe('concert-ballot')
  })

  it('runDraw kalah: tidak ada tiket', () => {
    const store = setup()
    fillForm(store)
    store.register()
    jest.spyOn(Math, 'random').mockReturnValue(0.9)
    store.runDraw()
    expect(store.drawn).toBe(true)
    expect(store.won).toBe(false)
    expect(store.ticketCode).toBeNull()
    expect(useBookingsStore().tickets).toHaveLength(0)
  })

  it('runDraw tidak berjalan tanpa registrasi atau dua kali', () => {
    const store = setup()
    store.runDraw()
    expect(store.drawn).toBe(false)
    fillForm(store)
    store.register()
    jest.spyOn(Math, 'random').mockReturnValue(0.9)
    store.runDraw()
    jest.spyOn(Math, 'random').mockReturnValue(0.1)
    store.runDraw()
    expect(store.won).toBe(false)
  })

  it('state dipersist per konser dan dimuat ulang saat setEvent', () => {
    const store = setup('bts')
    fillForm(store)
    store.register()
    const number = store.registration!.number

    store.setEvent(getConcertById('lany')!)
    expect(store.isRegistered).toBe(false)

    store.setEvent(getConcertById('bts')!)
    expect(store.registration?.number).toBe(number)
  })

  it('resetDemo mengosongkan registrasi dan hasil', () => {
    const store = setup()
    fillForm(store)
    store.register()
    store.resetDemo()
    expect(store.isRegistered).toBe(false)
    expect(store.drawn).toBe(false)
    expect(store.won).toBe(false)
  })
})

