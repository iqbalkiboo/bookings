import { createPinia, setActivePinia } from 'pinia'

let uuidCounter = 0

beforeEach(() => {
  localStorage.clear()
  uuidCounter = 0
  setActivePinia(createPinia())
  Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID: () => `uuid-${++uuidCounter}` },
    configurable: true,
  })
})

afterEach(() => {
  jest.useRealTimers()
  jest.restoreAllMocks()
})

