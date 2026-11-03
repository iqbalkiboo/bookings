/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json', 'vue'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json', diagnostics: false }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  globals: {
    'vue-jest': {
      tsconfig: 'tsconfig.jest.json',
      experimentalCSSCompile: false,
    },
  },
  collectCoverageFrom: [
    'src/utils/**/*.ts',
    'src/stores/**/*.ts',
    'src/components/atoms/**/*.{ts,vue}',
    '!src/**/*.spec.ts',
  ],
  coverageThreshold: {
    global: { statements: 80, branches: 70, functions: 80, lines: 80 },
  },
}
