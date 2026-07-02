import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts'
  ],
  format: [
    'esm', 'cjs'
  ],
  dts: true,
  clean: true,
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: false,
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs',
    }
  },
});
