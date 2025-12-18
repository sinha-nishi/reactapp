import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions } from "../../@types/styleOptions";

export const objectsPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // 05-objects: layout, grids, flexes, etc.
    b.objects(
      `grid,fieldset {
      box-sizing:border-box
    }`,
      "objects-grid-fieldset",
    );
  };
