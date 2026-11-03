import { mount } from '@vue/test-utils'
import CountdownTimer from './CountdownTimer.vue'

describe('CountdownTimer (atom)', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders remaining mm:ss formatted text', () => {
    const now = Date.now()
    const endsAt = now + 90_000 // 1 minute 30 seconds

    const wrapper = mount(CountdownTimer, {
      props: { endsAt },
    })

    expect(wrapper.text()).toBe('01:30')
  })

  it('adds urgent class when remaining time is 15 seconds or less', () => {
    const now = Date.now()
    const endsAt = now + 10_000 // 10 seconds

    const wrapper = mount(CountdownTimer, {
      props: { endsAt },
    })

    expect(wrapper.classes()).toContain('animate-blink')
    expect(wrapper.classes()).toContain('text-danger')
  })

  it('emits expired event when time passes endsAt', () => {
    const now = Date.now()
    const endsAt = now + 1_000

    const wrapper = mount(CountdownTimer, {
      props: { endsAt },
    })

    jest.advanceTimersByTime(1500)
    expect(wrapper.emitted('expired')).toBeTruthy()
  })
})

