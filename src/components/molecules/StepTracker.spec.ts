import { mount } from '@vue/test-utils'
import StepTracker from './StepTracker.vue'

describe('StepTracker (molecule)', () => {
  const steps = ['Pilih Tier', 'Data Diri', 'Selesai']

  it('marks current step as active and previous steps as done', () => {
    const wrapper = mount(StepTracker, {
      props: {
        steps,
        current: 2, // Step 2 is active
      },
    })

    const items = wrapper.findAll('li.step')
    expect(items).toHaveLength(3)

    // Step 1: done
    expect(items[0].classes()).toContain('step--done')
    expect(items[0].classes()).not.toContain('step--active')

    // Step 2: active
    expect(items[1].classes()).toContain('step--active')
    expect(items[1].classes()).not.toContain('step--done')

    // Step 3: pending
    expect(items[2].classes()).not.toContain('step--active')
    expect(items[2].classes()).not.toContain('step--done')
  })
})

