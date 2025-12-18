import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions } from "../../@types/styleOptions";

export const componentsPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // 03-generic: reset/normalize (minimal)
    b.components(
      `card {
      box-sizing:border-box
    }`,
      "components-card",
    );
  };
