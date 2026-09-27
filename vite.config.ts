import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: process.env.DOCS_BASE ?? '/',
  plugins: [react()],
  build: { outDir: 'site' },
  server: { port: 4317 },
});
