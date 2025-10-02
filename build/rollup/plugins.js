import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";

export const rollupDts = () => [dts()];

// Base plugins (no minify)
export const basePlugins = (options = {}) => [
  resolve({
    browser: true,
    extensions: [".mjs", ".js", ".ts", ".tsx", ".json"],
    exportConditions: ["browser", "module", "default"],
  }),
  commonjs(),
  postcss(options?.plugins?.postcss || { extract: false, minimize: true, sourceMap: true }),
];

const isProd = process.env.NODE_ENV === "production";
export const replacePlugin = () =>
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(
      isProd ? "production" : "development",
    ),
  });

export const tscPlugin = (declaration = false) =>
  typescript({
    tsconfig: "./tsconfig.build.json",
    // ensure declaration emit in your tsconfig, not here
    declaration,
    declarationDir: declaration ? "./dist/esm/types" : undefined,
  });

// Minified variant
export const minify = () =>
  terser({
    compress: { passes: 2, pure_getters: true, drop_console: false },
    mangle: true,
  });
