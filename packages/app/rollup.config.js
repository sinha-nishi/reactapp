import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";

// To read package.json
import pkg from "./package.json" with { type: "json" };

// Handy lists
const INTERNAL_PKG = [
  "@pkvsinha/react-base",
  "@pkvsinha/react-components",
  "@pkvsinha/react-hooks",
  "@pkvsinha/react-icons",
  "@pkvsinha/react-integrate",
  "@pkvsinha/react-layout",
  "@pkvsinha/react-navigate",
  "@pkvsinha/react-widgets",
];

const EXTERNAL_PEERS = ["react", "react-dom"];

const isProd = process.env.NODE_ENV === "production";

const replacePlugin = () =>
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(
      isProd ? "production" : "development",
    ),
  });

const tscPlugin = (declaration = false) =>
  typescript({
    tsconfig: "./tsconfig.json",
    // ensure declaration emit in your tsconfig, not here
    declaration,
    declarationDir: declaration ? "./dist/esm/types" : undefined,
  });

// Base plugins (no minify)
const basePlugins = () => [
  resolve({
    browser: true,
    extensions: [".mjs", ".js", ".ts", ".tsx", ".json"],
    exportConditions: ["browser", "module", "default"],
  }),
  commonjs(),
  postcss(),
];

// Minified variant
const minify = () =>
  terser({
    compress: { passes: 2, pure_getters: true, drop_console: false },
    mangle: true,
  });

const TypesBuild = {
  // 5. Bundle all the type declarations into a single file
  input: "dist/esm/types/index.d.ts",
  output: [{ file: "dist/index.d.ts", format: "esm" }],
  plugins: [dts()],
  external: [/\.css$/],
};

const ServerTypesBuild = {
  // 5. Bundle all the type declarations into a single file
  input: "dist/esm/types/server.d.ts",
  output: [{ file: "dist/server.d.ts", format: "esm" }],
  plugins: [dts()],
  external: [/\.css$/],
};

const isExternal = (id) => {
  // React & subpaths
  if (/^react($|\/)/.test(id)) return true;               // react, react/jsx-runtime, react/jsx-dev-runtime
  if (/^react-dom($|\/)/.test(id)) return true;           // react-dom, react-dom/client, react-dom/server
  if (/^scheduler($|\/)/.test(id)) return true;           // scheduler (peer of react-dom)
  if (id === "object-assign") return true;                // tiny dep used by React

  // your monorepo packages – keep them external for ESM/CJS
  if (INTERNAL_PKG.some((p) => id === p || id.startsWith(p + "/"))) return true;

  return false;
};

const ESMBuild = {
  input: "src/index.ts",
  external: isExternal,
  plugins: [basePlugins(), tscPlugin(true)],
  output: {
    file: pkg.module,
    format: "esm",
    sourcemap: true,
  },
};

const CJSBuild = {
  input: "src/index.ts",
  external: [...EXTERNAL_PEERS, ...INTERNAL_PKG],
  plugins: [basePlugins(), tscPlugin()],
  output: {
    file: pkg.main,
    format: "cjs",
    sourcemap: true,
    exports: "named",
  },
};

const UMDBuild = {
  input: "src/umd.ts",
  external: [],
  output: {
    file: "dist/umd/react-app.standalone.min.js",
    format: "umd",
    name: "ReactApp", // Global variable name for your library
    sourcemap: true,
    exports: "named",
  },
  plugins: [replacePlugin(), basePlugins(), tscPlugin(), minify()],
};

const UMDLeanBuild = {
  input: "src/umd.ts",
  external: [...EXTERNAL_PEERS],
  plugins: [replacePlugin(), basePlugins(), tscPlugin(), minify()],
  output: {
    file: "dist/umd/react-app.lean.min.js",
    format: "umd",
    name: "ReactApp", // Global variable name for your library
    sourcemap: true,
    exports: "named",
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  },
};

const ServerBuild = {
  input: "src/server.tsx",
  external: [
    "react",
    "react-dom/server", // don’t bundle node/server renderer
    // plus anything you want external on server side
  ],
  plugins: [basePlugins(), tscPlugin()],
  output: [
    { file: "dist/esm/server.js", format: "esm", sourcemap: true },
    {
      file: "dist/cjs/server.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],
};

export default [
  ESMBuild, // 1. Build for ESM (and generate all type declarations)
  CJSBuild, // 2. Build for CJS
  UMDBuild, // 3. Build for UMD (for CDN usage, all dependencies bundled & minified)
  UMDLeanBuild, // 4. Build for UMD - Lean (for CDN usage, all dependencies bundled & minified)
  ServerBuild,
  TypesBuild, // 5. Bundle all the type declarations into a single file
  ServerTypesBuild,
];
