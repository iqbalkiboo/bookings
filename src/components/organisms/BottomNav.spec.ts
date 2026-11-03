import { mount } from '@vue/test-utils'
import BottomNav from './BottomNav.vue'
import { useBookingsStore } from '@/stores/bookings'

describe('BottomNav (organism)', () => {
  it('renders all 4 navigation items', () => {
    const wrapper = mount(BottomNav, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a :href="to" class="bottom-nav-item"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const links = wrapper.findAll('a.bottom-nav-item')
    expect(links).toHaveLength(4)
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Bioskop')
    expect(wrapper.text()).toContain('Konser')
    expect(wrapper.text()).toContain('Tiket Saya')
  })

  it('displays badge count when there are booked tickets', async () => {
    const bookings = useBookingsStore()
    bookings.tickets = [
      {
        id: 't-1',
        type: 'movie',
        title: 'Film A',
        subtitle: 'Studio 1',
        total: 50_000,
        code: 'TIX-1',
        createdAt: new Date().toISOString(),
        seats: ['A1'],
      },
    ]

    const wrapper = mount(BottomNav, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a :href="to" class="bottom-nav-item"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const badge = wrapper.find('[data-testid="ticket-badge"]')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('1')
  })
})

