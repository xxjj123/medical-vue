import { defineConfig } from 'tsup';

export const tsup = defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: false,
  minify: false,
  sourcemap: true,
  dts: false,
  clean: true,
});
