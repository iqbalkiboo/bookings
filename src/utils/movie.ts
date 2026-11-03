import type { Movie } from '@/types/ticketing'

export const BLURBS: Record<number, string> = {
  1: 'Sebuah kisah hangat tentang berdamai dengan masa lalu — ketika awan kelabu akhirnya berlalu, harapan baru datang menyapa.',
  2: 'Si Kancil yang cerdik kembali! Ikuti petualangan seru penuh tawa untuk seluruh keluarga di hutan penuh kejutan.',
  3: 'Di balik nebula yang memanas, satu kru antariksa harus memilih antara pulang atau menyelamatkan galaksi.',
  4: 'Dua hati bertemu di ujung senja. Sebuah romansa manis tentang cinta yang datang di waktu yang tak terduga.',
}

export function blurb(id: number): string {
  return BLURBS[id] ?? 'Saksikan keseruannya di layar lebar bersama TIX ID.'
}

/** Persentase "cocok" demo (deterministik per id film) */
export function matchPct(id: number): number {
  return 82 + ((id * 7) % 17)
}

export function minPrice(movie: Pick<Movie, 'showtimes'>): number {
  return Math.min(...movie.showtimes.map((s) => s.price))
}

/** Urutan "Top Hari Ini" — peringkat demo (deterministik per id film) */
export function rankMovies(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => ((b.id * 37) % 11) - ((a.id * 37) % 11))
}

export function posterGradient(color: string): string {
  return `linear-gradient(160deg, ${color}, color-mix(in srgb, ${color} 45%, #000))`
}

export function bannerGradient(color: string): string {
  return `linear-gradient(120deg, color-mix(in srgb, ${color} 55%, #000), ${color})`
}

export function billboardBg(color: string): string {
  return `radial-gradient(circle at 75% 40%, ${color}, color-mix(in srgb, ${color} 35%, #05060a) 70%)`
}

export function availabilityTone(percent: number): 'success' | 'primary' | 'danger' {
  if (percent >= 70) return 'success'
  if (percent >= 50) return 'primary'
  return 'danger'
}

