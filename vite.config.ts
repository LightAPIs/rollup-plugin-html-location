import { defineConfig } from 'vite';
import path from 'path';
import copy from 'rollup-plugin-copy';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'publish',
    lib: {
      entry: './src/index.ts',
      name: 'HTMLLocation',
      fileName: 'index',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    dts({ rollupTypes: true }),
    copy({
      targets: [
        { src: 'README.md', dest: 'publish' },
        { src: 'LICENSE', dest: 'publish' },
      ],
      hook: 'writeBundle',
    }),
  ],
});
