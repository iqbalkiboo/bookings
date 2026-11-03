import { mount } from '@vue/test-utils'
import FilterChips, { type ChipOption } from './FilterChips.vue'

describe('FilterChips (molecule)', () => {
  const options: ChipOption<'all' | 'rock' | 'pop'>[] = [
    { key: 'all', label: 'Semua', count: 12 },
    { key: 'rock', label: 'Rock', count: 4 },
    { key: 'pop', label: 'Pop', count: 8 },
  ]

  it('renders all chip options with their labels and counts', () => {
    const wrapper = mount(FilterChips, {
      props: {
        options,
        modelValue: 'all',
      },
    })

    const buttons = wrapper.findAll('button.chip')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].text()).toContain('Semua')
    expect(buttons[0].text()).toContain('12')
    expect(buttons[0].classes()).toContain('chip-on')
    expect(buttons[1].classes()).not.toContain('chip-on')
  })

  it('emits update:modelValue when a chip is clicked', async () => {
    const wrapper = mount(FilterChips, {
      props: {
        options,
        modelValue: 'all',
      },
    })

    const buttons = wrapper.findAll('button.chip')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['rock'])
  })
})

