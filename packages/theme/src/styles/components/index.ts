import { CssBuilder, BuilderPlugin } from "../../core/builder/core";
import type { StyleOptions } from "../../@types/styleOptions";

export const componentsPlugin =
  (opts: StyleOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // 03-generic: reset/normalize (minimal)
    b.components(
      `card {
      box-sizing:border-box
    }`,
      "components-card",
    );
  };
