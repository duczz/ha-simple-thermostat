import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // Pure-logic tests run in node (fast). Tests that render lit templates
    // or use custom elements opt into jsdom via `// @vitest-environment jsdom`.
    environment: 'node',
  },
})
