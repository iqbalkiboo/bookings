export interface NavItem {
  label: string
  to: string
  icon: 'home' | 'film' | 'mic' | 'ticket'
}

/** Sumber tunggal menu — dipakai NavBar (desktop) dan BottomNav (mobile). */
export const navItems: NavItem[] = [
  { label: 'Beranda', to: '/', icon: 'home' },
  { label: 'Bioskop', to: '/movies', icon: 'film' },
  { label: 'Konser', to: '/concerts', icon: 'mic' },
  { label: 'Tiket Saya', to: '/tickets', icon: 'ticket' },
]

