import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

// To read package.json
import pkg from './package.json' with { type: 'json' };

export default [
  // 1. Build for ESM (and generate all type declarations)
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/esm/types', // Generate types into a temp folder
      }),
    ],
    external: [
      'react',
      'react-dom',
      '@pkvsinha/react-base',
      '@pkvsinha/react-hooks',
      '@pkvsinha/react-navigate'
    ],
  },

  // 2. Build for CJS
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss(),
      // In the CJS build, we DO NOT generate types
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false, // <-- This is the key
      }),
    ],
    external: [
      'react',
      'react-dom',
      '@pkvsinha/react-base',
      '@pkvsinha/react-hooks',
      '@pkvsinha/react-navigate'
    ],
  },

  // 3. Bundle all the type declarations into a single file
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];