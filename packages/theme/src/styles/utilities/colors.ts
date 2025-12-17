import { RuleRegistry } from "@/runtime/Scanner";
import type { Theme } from "../../@types";
import { style, util, withColorKey } from "./helper";

export function register(reg: RuleRegistry, theme: Theme) {
  // bg-<color>
  reg.addPrefixRule("bg-", {
    match: (cls) => withColorKey(cls, "bg-", theme.colors),
    apply: (m, meta, ctx) =>
      style("background-color", ctx.resolveColor(m.key), ctx, meta),
  });
  // border-<color>
  reg.addPrefixRule("border-", {
    match: (cls) => withColorKey(cls, "border-", theme.colors),
    apply: (m, meta, ctx) =>
      style("border-color", ctx.resolveColor(m.key), ctx, meta),
  });
}
