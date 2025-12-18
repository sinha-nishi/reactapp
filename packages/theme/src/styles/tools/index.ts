import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { StyleOptions } from "../../@types/styleOptions";

export const toolsPlugin =
  (opts: StyleOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    b.layer("tools", "/* settings */", "settings-header");
  };
