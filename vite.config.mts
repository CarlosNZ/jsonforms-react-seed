import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: 'https://carlosnz.github.io/jsonforms-with-figtree-demo/',
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    coverage: {
      include: ['src/**'],
      exclude: ['src/main.tsx'],
    },
  },
});
