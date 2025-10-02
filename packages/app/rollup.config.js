import {
  dts,
  esm,
  cjs,
  umd,
  umdLean,
  ssr,
  serverDts,
} from "../../build/rollup/index.js";

export default [esm(), cjs(), umd(), umdLean(), ssr(), dts(), serverDts()];
