import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,                   // just enable .d.ts generation
  clean: true,
  minify: true,
  sourcemap: false,
  external: ['react', 'react-dom', 'react-intersection-observer'],
  // 👇 add this to ensure .tsx works for JSX
  esbuildOptions(options) {
    options.jsx = 'automatic'
    return options
  }
})
