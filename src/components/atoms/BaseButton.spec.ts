import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton (atom)', () => {
  it('renders default button with primary variant and md size', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Beli Tiket' },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Beli Tiket')
    expect(wrapper.classes()).toContain('btn')
    expect(wrapper.classes()).toContain('btn-primary')
    expect(wrapper.classes()).toContain('btn-md')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('renders router-link when to prop is provided', () => {
    const wrapper = mount(BaseButton, {
      props: { to: '/concerts', variant: 'secondary', size: 'lg' },
      slots: { default: 'Ke Konser' },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/concerts')
    expect(wrapper.classes()).toContain('btn-secondary')
    expect(wrapper.classes()).toContain('btn-lg')
  })

  it('applies disabled state classes and attribute', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true, block: true },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('btn-block')
    expect(wrapper.classes()).toContain('opacity-50')
  })

  it('emits click event on button', async () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Klik' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})

