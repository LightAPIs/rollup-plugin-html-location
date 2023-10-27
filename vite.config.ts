import { defineConfig } from 'vite';
import path from 'path';
import copy from 'rollup-plugin-copy';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'publish',
    target: ['node16'],
    lib: {
      entry: './src/index.ts',
      name: 'HTMLLocation',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['chalk', /^node:\w+/],
      output: {
        globals: {
          chalk: 'chalk',
        },
      },
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
