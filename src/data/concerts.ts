export type SaleMode = 'war' | 'ballot' | 'both'

export interface ConcertEvent {
  id: string
  artist: string
  tour: string
  date: string
  venue: string
  poster: string
  color: string
  /** metode penjualan tiket */
  saleMode: SaleMode
  warPrice: number
  warStock: number
}

export const seedConcerts: ConcertEvent[] = [
  {
    id: 'bts',
    artist: 'BTS',
    tour: "WORLD TOUR 'ETERNAL'",
    date: 'Sabtu, 12 Desember 2026',
    venue: 'Stadion Utama GBK, Jakarta',
    poster: '💜',
    color: '#7c3aed',
    saleMode: 'both',
    warPrice: 3_500_000,
    warStock: 137,
  },
  {
    id: 'kanye-west',
    artist: 'Kanye West',
    tour: 'YEEZY LIVE JAKARTA',
    date: 'Jumat, 20 November 2026',
    venue: 'Indonesia Arena, Jakarta',
    poster: '🎤',
    color: '#111827',
    saleMode: 'war',
    warPrice: 5_000_000,
    warStock: 89,
  },
  {
    id: 'lany',
    artist: 'LANY',
    tour: 'SOFT ASIA TOUR 2026',
    date: 'Sabtu, 28 November 2026',
    venue: 'Beach City International Stadium, Jakarta',
    poster: '🌊',
    color: '#0ea5e9',
    saleMode: 'both',
    warPrice: 2_500_000,
    warStock: 210,
  },
  {
    id: 'weezer',
    artist: 'Weezer',
    tour: 'VOYAGE ASIA 2026',
    date: 'Rabu, 9 Desember 2026',
    venue: 'Kasablanka Hall, Jakarta',
    poster: '🎸',
    color: '#16a34a',
    saleMode: 'ballot',
    warPrice: 1_800_000,
    warStock: 160,
  },
  {
    id: 'radiohead',
    artist: 'Radiohead',
    tour: 'A MOON SHAPED POOL REVISITED',
    date: 'Jumat, 18 Desember 2026',
    venue: 'Stadion Utama GBK, Jakarta',
    poster: '🐻',
    color: '#b45309',
    saleMode: 'war',
    warPrice: 4_200_000,
    warStock: 64,
  },
]

export function getConcertById(id: string): ConcertEvent | undefined {
  return seedConcerts.find((c) => c.id === id)
}
