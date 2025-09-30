import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcssImport from "postcss-import";
import postcssNesting from "postcss-nesting";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "rollup-plugin-postcss";
import path from "node:path";
import dts from "rollup-plugin-dts";

import pkg from "./package.json" with { type: "json" };

export default [
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
  // 1. Build for ESM (and generate all type declarations)
  {
    input: "src/index.ts",
    external: ["react", "react-dom"],
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [
      resolve(),
      commonjs(),
      // postcss(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "./dist/esm/types", // Generate types into a temp folder
      }),
    ],
  },

  {
    input: "src/index.ts",
    output: {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
      exports: "auto",  //   exports: "named",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [
      resolve(),
      commonjs(),
      // In the CJS build, we DO NOT generate types
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false, // <-- This is the key
      }),
    ],
    external: [
      "react",
      "react-dom"
    ],
  },

  // 3. Bundle all the type declarations into a single file
  {
    input: "dist/esm/types/src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm", sourcemap: false }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
