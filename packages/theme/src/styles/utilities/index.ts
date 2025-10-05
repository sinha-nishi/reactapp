import { CssBuilder, BuilderPlugin } from "../../builder/core";
import type { StyleOptions } from "../../@types/styleOptions";

export const utilitiesPlugin =
  (opts: StyleOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // 07-utilities: spacing
    const scale = opts.utilities?.spacingScale ?? [0, 4, 8, 12, 16, 24, 32];
    scale.forEach((px, i) => {
      const rem = `${px / 16}rem`;
      b.rule("utilities", `.u-m-${i}`, `margin:${rem}`, `u-m-${i}`);
      b.rule("utilities", `.u-p-${i}`, `padding:${rem}`, `u-p-${i}`);
    });
  };
