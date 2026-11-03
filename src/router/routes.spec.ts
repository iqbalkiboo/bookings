import { routes } from './routes'
import { navItems } from './navigation'

describe('Router & Navigation config', () => {
  it('defines all required route records', () => {
    const routeNames = routes.map((r) => r.name)
    expect(routeNames).toContain('home')
    expect(routeNames).toContain('movies')
    expect(routeNames).toContain('concerts')
    expect(routeNames).toContain('concert-detail')
    expect(routeNames).toContain('tickets')
  })

  it('navItems point to existing route paths', () => {
    const paths = routes.map((r) => r.path)
    for (const item of navItems) {
      expect(paths).toContain(item.to)
    }
  })
})

