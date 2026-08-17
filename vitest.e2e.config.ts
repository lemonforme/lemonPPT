import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['apps/server/src/editor.e2e.test.ts'],
    globals: true,
    environment: 'node',
  },
});
