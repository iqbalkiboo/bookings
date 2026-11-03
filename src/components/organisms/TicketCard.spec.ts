import { mount } from '@vue/test-utils'
import TicketCard from './TicketCard.vue'
import type { Ticket } from '@/types/ticketing'

describe('TicketCard (organism)', () => {
  const sampleMovieTicket: Ticket = {
    id: 't-101',
    type: 'movie',
    title: 'Interstellar',
    subtitle: 'IMAX · 19:30',
    total: 100_000,
    code: 'TIX-INT-101',
    createdAt: new Date().toISOString(),
    seats: ['E5', 'E6'],
  }

  it('renders ticket title, seat info, and formatted price', () => {
    const wrapper = mount(TicketCard, {
      props: { ticket: sampleMovieTicket },
    })

    expect(wrapper.find('.ticket-title').text()).toBe('Interstellar')
    expect(wrapper.find('.ticket-sub').text()).toBe('IMAX · 19:30')
    expect(wrapper.find('.ticket-seat').text()).toContain('Kursi: E5, E6')
    expect(wrapper.find('.ticket-seat').text()).toContain('Rp 100.000')
    expect(wrapper.find('.ticket-code').text()).toBe('TIX-INT-101')
  })

  it('emits remove when delete button is clicked', async () => {
    const wrapper = mount(TicketCard, {
      props: { ticket: sampleMovieTicket },
    })

    const deleteBtn = wrapper.find('button[title="Hapus tiket"]')
    expect(deleteBtn.exists()).toBe(true)

    await deleteBtn.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })
})

