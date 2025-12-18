import { CssBuilder, BuilderPlugin } from "../../core/builder/core";
import type { StyleOptions } from "../../@types/styleOptions";

export const objectsPlugin =
  (opts: StyleOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // 05-objects: layout, grids, flexes, etc.
    b.objects(
      `grid,fieldset {
      box-sizing:border-box
    }`,
      "objects-grid-fieldset",
    );
  };
