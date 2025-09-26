import dts from 'rollup-plugin-dts';

export default [
  // Main types (root export ".")
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
  // Server subpath types
  {
    input: 'dist/esm/types/server.d.ts',
    output: [{ file: 'dist/server.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
  // Browser adapter subpath types
  {
    input: 'dist/esm/types/adapters/browser.d.ts',
    output: [{ file: 'dist/adapters/browser.d.ts', format: 'esm' }],
    plugins: [dts()],
  }
];