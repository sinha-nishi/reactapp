import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { StyleOptions } from "../../@types/styleOptions";

export const genericPlugin =
  (opts: StyleOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // 03-generic: reset/normalize (minimal)
    b.generic(
      `*,*::before,*::after {
      box-sizing:border-box
    }`,
      "generic-reset",
    );

    b.generic(
      `html,body {
      padding:0;margin:0
    }`,
      "generic-html-body",
    );
  };
