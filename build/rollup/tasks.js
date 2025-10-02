import { isExternal, EXTERNAL_PEERS } from "./utils.js";
import {
  basePlugins,
  tscPlugin,
  replacePlugin,
  minify,
  rollupDts,
} from "./plugins.js";

function extend(obj = {}, ext = {}) {
  return { ...obj, ...ext };
}

export const dts = () =>
  extend({
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [rollupDts()],
    external: [/\.css$/],
  });

export const serverDts = () =>
  extend({
    // 5. Bundle all the type declarations into a single file
    input: "dist/esm/types/src/server.d.ts",
    output: [{ file: "dist/server.d.ts", format: "esm" }],
    plugins: [rollupDts()],
    external: [/\.css$/],
  });

export const esm = () =>
  extend({
    input: "src/index.ts",
    external: isExternal,
    plugins: [basePlugins(), tscPlugin(true)],
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
  });

export const cjs = () =>
  extend({
    input: "src/index.ts",
    external: isExternal,
    plugins: [basePlugins(), tscPlugin()],
    output: {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      exports: "named",
    },
  });

export const umd = () =>
  extend({
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
  });

export const umdLean = () =>
  extend({
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
  });

export const ssr = () =>
  extend({
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
  });

// Build CSS-only: pkvsinha.css + pkvsinha.min.css
// {
//   input: path.resolve("src/styles/index.css"), // imports 01→07 in order
//   plugins: [
//     postcss({
//       extract: "pkvsinha.css",
//       sourceMap: true,
//       minimize: false,
//       plugins: [
//         postcssImport(),
//         postcssNesting(),
//         autoprefixer(),
//       ],
//     }),
//   ],
//   output: { dir: "dist", assetFileNames: "[name][extname]" },
// },
// {
//   input: path.resolve("src/styles/index.css"),
//   plugins: [
//     postcss({
//       extract: "pkvsinha.min.css",
//       sourceMap: false,
//       minimize: {
//         preset: ["default", { discardComments: { removeAll: true } }],
//       },
//       plugins: [
//         postcssImport(),
//         postcssNesting(),
//         autoprefixer(),
//         cssnano(),
//       ],
//     }),
//   ],
//   output: { dir: "dist", assetFileNames: "[name][extname]" },
// },
