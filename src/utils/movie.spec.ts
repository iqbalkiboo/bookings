import {
  availabilityTone,
  blurb,
  matchPct,
  minPrice,
  posterGradient,
  rankMovies,
} from '@/utils/movie'
import { seedMovies } from '@/data/movies'

describe('movie utils', () => {
  it('blurb mengembalikan sinopsis atau fallback', () => {
    expect(blurb(1)).toMatch(/awan/i)
    expect(blurb(999)).toMatch(/TIX ID/)
  })

  it('matchPct berada di rentang 82-98 dan deterministik', () => {
    for (const m of seedMovies) {
      const v = matchPct(m.id)
      expect(v).toBeGreaterThanOrEqual(82)
      expect(v).toBeLessThanOrEqual(98)
      expect(matchPct(m.id)).toBe(v)
    }
  })

  it('minPrice mengambil harga jadwal termurah', () => {
    expect(minPrice(seedMovies[2])).toBe(75_000)
  })

  it('rankMovies tidak mengubah array asal dan mempertahankan semua film', () => {
    const copy = [...seedMovies]
    const ranked = rankMovies(seedMovies)
    expect(seedMovies).toEqual(copy)
    expect(ranked).toHaveLength(seedMovies.length)
    expect(ranked.map((m) => m.id).sort()).toEqual(seedMovies.map((m) => m.id).sort())
  })

  it('availabilityTone sesuai ambang 70 / 50', () => {
    expect(availabilityTone(90)).toBe('success')
    expect(availabilityTone(70)).toBe('success')
    expect(availabilityTone(60)).toBe('primary')
    expect(availabilityTone(50)).toBe('primary')
    expect(availabilityTone(49)).toBe('danger')
  })

  it('posterGradient memuat warna film', () => {
    expect(posterGradient('#fff')).toContain('#fff')
  })
})

