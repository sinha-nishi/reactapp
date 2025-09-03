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
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        extract: false, // inject styles per used component
        minimize: true,
        sourceMap: true,
      }),
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
      '@pkvsinha/react-navigate',
      'style-inject',
      'style-inject/dist/style-inject.es.js'
    ],
  },

  // 2. Build for CJS
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        extract: false, // inject styles per used component
        minimize: true,
        sourceMap: true,
      }),
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
      '@pkvsinha/react-navigate',
      'style-inject',
      'style-inject/dist/style-inject.es.js'
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
