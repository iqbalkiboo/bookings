import { mount } from '@vue/test-utils'
import NavIcon from './NavIcon.vue'

describe('NavIcon (atom)', () => {
  it('renders home icon svg with proper attributes', () => {
    const wrapper = mount(NavIcon, {
      props: { name: 'home', size: 24 },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
    expect(svg.attributes('data-icon')).toBe('home')
  })

  it('renders different icon shapes (film, mic, ticket)', () => {
    const film = mount(NavIcon, { props: { name: 'film' } })
    const mic = mount(NavIcon, { props: { name: 'mic' } })
    const ticket = mount(NavIcon, { props: { name: 'ticket' } })

    expect(film.find('svg').attributes('data-icon')).toBe('film')
    expect(mic.find('svg').attributes('data-icon')).toBe('mic')
    expect(ticket.find('svg').attributes('data-icon')).toBe('ticket')
  })
})

