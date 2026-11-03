import { mount } from '@vue/test-utils'
import ProgressBar from './ProgressBar.vue'

describe('ProgressBar (atom)', () => {
  it('renders track and fill based on percent prop', () => {
    const wrapper = mount(ProgressBar, {
      props: { percent: 45, tone: 'primary' },
    })

    const fill = wrapper.find('.progress-fill')
    expect(fill.exists()).toBe(true)
    expect(fill.attributes('style')).toContain('width: 45%;')
  })

  it('clamps percent between 0 and 100', () => {
    const wrapperOver = mount(ProgressBar, { props: { percent: 120 } })
    const fillOver = wrapperOver.find('.progress-fill')
    expect(fillOver.attributes('style')).toContain('width: 100%;')

    const wrapperUnder = mount(ProgressBar, { props: { percent: -20 } })
    const fillUnder = wrapperUnder.find('.progress-fill')
    expect(fillUnder.attributes('style')).toContain('width: 0%;')
  })

  it('conditionally shows label when showLabel is true', () => {
    const wrapperWithoutLabel = mount(ProgressBar, { props: { percent: 50, showLabel: false } })
    expect(wrapperWithoutLabel.find('.progress-label').exists()).toBe(false)

    const wrapperWithLabel = mount(ProgressBar, { props: { percent: 75, showLabel: true } })
    const label = wrapperWithLabel.find('.progress-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('75%')
  })
})

