import {
  dts,
  esm,
  cjs,
  basePlugins,
  tscPlugin,
} from "../../build/rollup/index.js";

export default [
  esm(),
  cjs(),
  dts(),
  {
    input: "src/cli/index.ts",
    external: [
      "sass",
      "less",
      // builtins are auto-external, but it doesn't hurt to be explicit
      "fs",
      "path",
      "url",
    ],
    plugins: [
      basePlugins(),
      tscPlugin({ declaration: false, tsconfig: "./tsconfig.build-cli.json" }),
    ],
    output: {
      file: "dist/cli.js",
      format: "esm",
      sourcemap: false,
      inlineDynamicImports: true,
      banner: "#!/usr/bin/env node",
    },
  },
];
