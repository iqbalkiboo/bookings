import { mount } from '@vue/test-utils'
import FormField from './FormField.vue'

describe('FormField (molecule)', () => {
  it('renders label and default slot element', () => {
    const wrapper = mount(FormField, {
      props: { label: 'Nama Lengkap' },
      slots: {
        default: '<input type="text" id="name" />',
      },
    })

    expect(wrapper.find('.form-field-label').text()).toBe('Nama Lengkap')
    expect(wrapper.find('input#name').exists()).toBe(true)
    expect(wrapper.find('.form-field-hint').exists()).toBe(false)
  })

  it('renders hint text when provided', () => {
    const wrapper = mount(FormField, {
      props: {
        label: 'Email',
        hint: 'Pastikan email aktif untuk pengiriman e-tiket',
      },
      slots: {
        default: '<input type="email" />',
      },
    })

    const hint = wrapper.find('.form-field-hint')
    expect(hint.exists()).toBe(true)
    expect(hint.text()).toContain('Pastikan email aktif')
  })
})

