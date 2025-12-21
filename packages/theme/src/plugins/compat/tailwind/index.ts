// Tailwind-compat entrypoint: registers utilities, variants, and resolver
import { tailwindRules } from "./rules";
import { variants } from "../../../utils/variants";
import type { CSSObject, ClassEnginePlugin } from "../../../@types";
import { CssBuilder } from "../../../core";

export interface TailwindCompatOptions {
  enableArbitraryValues?: boolean; // default true
  prefix?: string; // optional utility prefix, e.g. "tw-"
}

export const TailwindCompat = (
  builder: CssBuilder,
  opts?: TailwindCompatOptions,
): ClassEnginePlugin => {
  const rules = tailwindRules(builder.ctx.theme.view("light"), {
    enableArbitraryValues: opts?.enableArbitraryValues !== false,
    prefix: opts?.prefix ?? "",
  });

  return {
    name: "tailwind-compat",
    variants: variants(builder.ctx.screens),
    match(className: string) {
      return rules.match(className);
    },
    render(match, meta): CSSObject[] {
      return rules.render(match, meta, {
        screens: builder.ctx.screens,
        important: builder.ctx.important ?? true,
        resolveColor: builder.ctx.resolveColor,
      });
    },
    enumerate: (ctx, o) => rules.enumerate(ctx, o),
  };
};
