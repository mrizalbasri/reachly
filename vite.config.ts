/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    ...(mode === 'development' ? [devtools()] : []),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'clover'],
      reportsDirectory: './coverage',
    },
  },
}))
