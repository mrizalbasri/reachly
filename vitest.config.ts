import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './coverage/test-report.junit.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'clover', 'json-summary'],
      reportsDirectory: './coverage',
    },
  },
})
