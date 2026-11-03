import { formatIDR, formatNumber, generateCode } from '@/utils/format'

describe('format utils', () => {
  it('formatIDR memformat rupiah tanpa desimal', () => {
    const out = formatIDR(3_500_000).replace(/\s/g, ' ')
    expect(out).toContain('Rp')
    expect(out).toContain('3.500.000')
    expect(out).not.toContain(',')
  })

  it('formatNumber memakai pemisah ribuan id-ID', () => {
    expect(formatNumber(12480)).toBe('12.480')
  })

  describe('generateCode', () => {
    it('memakai prefix dan panjang default 6', () => {
      const code = generateCode('TIX')
      expect(code).toMatch(/^TIX-[A-Z2-9]{6}$/)
    })

    it('menghormati panjang custom', () => {
      expect(generateCode('BLT', 8)).toMatch(/^BLT-[A-Z2-9]{8}$/)
    })

    it('tidak memakai karakter ambigu (I, O, 0, 1)', () => {
      for (let i = 0; i < 50; i++) {
        expect(generateCode('X', 10).slice(2)).not.toMatch(/[IO01]/)
      }
    })

    it('menghasilkan kode berbeda berdasarkan random', () => {
      const spy = jest.spyOn(Math, 'random')
      spy.mockReturnValue(0)
      const a = generateCode('A')
      spy.mockReturnValue(0.99)
      const b = generateCode('A')
      expect(a).not.toBe(b)
    })
  })
})

