import { mount } from '@vue/test-utils'
import BaseBadge from './BaseBadge.vue'

describe('BaseBadge (atom)', () => {
  it('renders default soft badge', () => {
    const wrapper = mount(BaseBadge, {
      slots: { default: 'Info' },
    })

    expect(wrapper.classes()).toContain('rblx-badge')
    expect(wrapper.classes()).toContain('badge-soft')
    expect(wrapper.text()).toBe('Info')
  })

  it('applies custom tone class', () => {
    const wrapper = mount(BaseBadge, {
      props: { tone: 'gold' },
      slots: { default: 'VIP' },
    })

    expect(wrapper.classes()).toContain('badge-gold')
    expect(wrapper.text()).toBe('VIP')
  })

  it('renders green and red tone variants', () => {
    const greenBadge = mount(BaseBadge, { props: { tone: 'green' } })
    const redBadge = mount(BaseBadge, { props: { tone: 'red' } })

    expect(greenBadge.classes()).toContain('badge-green')
    expect(redBadge.classes()).toContain('badge-red')
  })
})

