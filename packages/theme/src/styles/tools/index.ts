import { CssBuilder, BuilderPlugin } from "../../builder/core";
import type { StyleOptions } from "../../@types/styleOptions";

export const toolsPlugin =
  (opts: StyleOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    b.layer("tools", "/* settings */", "settings-header");
  };
