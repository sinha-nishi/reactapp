import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions } from "../../@types";

export const toolsPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    b.layer("tools", "/* settings */", "settings-header");
  };
