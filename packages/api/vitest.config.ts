import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'
import tsconfigPaths from 'vitest-tsconfig-paths'

export default defineWorkersConfig({
  plugins: [tsconfigPaths()],
  test: {
    typecheck: {
      tsconfig: './test/tsconfig.json',
    },
    include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['**/*.d.ts', 'test/**'],
    },
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
      },
    },
  },
})
