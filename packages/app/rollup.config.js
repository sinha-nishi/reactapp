import path from "path";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from "@rollup/plugin-replace";
import typescript from '@rollup/plugin-typescript';
import terser from "@rollup/plugin-terser";
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

// To read package.json
import pkg from './package.json' with { type: 'json' };

// Handy lists
const INTERNAL_PKG = [
  '@pkvsinha/react-base',
  '@pkvsinha/react-components',
  '@pkvsinha/react-hooks',
  '@pkvsinha/react-icons',
  '@pkvsinha/react-integrate',
  '@pkvsinha/react-layout',
  '@pkvsinha/react-navigate',
  '@pkvsinha/react-widgets'
];

const EXTERNAL_PEERS = ["react", "react-dom"];

const isProd = process.env.NODE_ENV === "production";

// Base plugins (no minify)
const basePlugins = [
  replace({
    preventAssignment: true,
    // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    "process.env.NODE_ENV": JSON.stringify(isProd ? "production" : "development"),
  }),
  resolve({
    browser: true,
    extensions: [".mjs", ".js", ".ts", ".tsx", ".json"],
    exportConditions: ["browser", "module", "default"],
  }),
  commonjs(),
  postcss(),
  typescript({
    tsconfig: './tsconfig.json',
    // ensure declaration emit in your tsconfig, not here
  }),
];

// Minified variant
const minify = terser({
  compress: { passes: 2, pure_getters: true, drop_console: false },
  mangle: true,
});

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
      '@pkvsinha/react-components',
      '@pkvsinha/react-hooks',
      '@pkvsinha/react-icons',
      '@pkvsinha/react-integrate',
      '@pkvsinha/react-layout',
      '@pkvsinha/react-navigate',
      '@pkvsinha/react-widgets'
    ],
  },

  // 2. Build for CJS
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
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
      '@pkvsinha/react-components',
      '@pkvsinha/react-hooks',
      '@pkvsinha/react-icons',
      '@pkvsinha/react-integrate',
      '@pkvsinha/react-layout',
      '@pkvsinha/react-navigate',
      '@pkvsinha/react-widgets'
    ],
  },

  // 3. Build for UMD (for CDN usage, all dependencies bundled & minified)
  {
    input: 'src/umd.ts',
    external: [],
    output: {
      file: 'dist/umd/react-app.standalone.min.js',
      format: 'umd',
      name: 'ReactApp', // Global variable name for your library
      sourcemap: true,
      exports: "named",
    },
    plugins: [...basePlugins, minify],
    // plugins: [
    //   resolve({ browser: true, extensions: [".ts", ".js"] }),
    //   commonjs(),
    //   postcss(),
    //   typescript({
    //     tsconfig: './tsconfig.json',
    //     declaration: false,
    //   }),
    //   terser(), // Minify the UMD bundle
    // ],
    // No 'external' field here! All dependencies are bundled.
  },

  // 4. Build for UMD - Lean (for CDN usage, all dependencies bundled & minified)
  {
    input: 'src/umd.ts',
    external: ["react", "react-dom"],
    output: {
      file: 'dist/umd/react-app.lean.min.js',
      format: 'umd',
      name: 'ReactApp', // Global variable name for your library
      sourcemap: true,
      exports: "named",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
    },
    plugins: [...basePlugins, minify],
    // Lean with 'react' and 'react-dom' as externals! All internal dependencies are bundled.
  },

  // 5. Bundle all the type declarations into a single file
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];