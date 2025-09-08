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
        // Inline a tiny injector to avoid external deps; keep plugin's own default export
        inject: (cssVarName) => `
          (function(css){
            if(!css) return;
            if(typeof document === 'undefined') return;
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.type = 'text/css';
            style.setAttribute('data-pkvs', 'components');
            if (style.styleSheet){ style.styleSheet.cssText = css; }
            else { style.appendChild(document.createTextNode(css)); }
            head.appendChild(style);
          })(${cssVarName});
        `,
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
      '@pkvsinha/react-navigate'
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
        inject: (cssVarName) => `
          (function(css){
            if(!css) return;
            if(typeof document === 'undefined') return;
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.type = 'text/css';
            style.setAttribute('data-pkvs', 'components');
            if (style.styleSheet){ style.styleSheet.cssText = css; }
            else { style.appendChild(document.createTextNode(css)); }
            head.appendChild(style);
          })(${cssVarName});
        `,
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

  // 4. Aggregated CSS build (SSR-friendly single stylesheet)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/styles.build.js',
      format: 'esm',
      sourcemap: false,
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        extract: 'styles.css',
        minimize: true,
        sourceMap: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
    treeshake: false,
    external: [
      'react',
      'react-dom',
      '@pkvsinha/react-base',
      '@pkvsinha/react-hooks',
      '@pkvsinha/react-navigate'
    ],
  },
];
