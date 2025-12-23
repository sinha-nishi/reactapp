import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util, style } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const O: Record<string, string> = {
    "0": "0",
    "5": "0.05",
    "10": "0.1",
    "20": "0.2",
    "25": "0.25",
    "30": "0.3",
    "40": "0.4",
    "50": "0.5",
    "60": "0.6",
    "70": "0.7",
    "80": "0.8",
    "90": "0.9",
    "100": "1",
  };

  reg.addPrefixRule("opacity-", {
    family: "opacity",
    match: (cls) =>
      cls.startsWith("opacity-") ? { key: cls.slice(8), raw: cls } : false,
    apply: (m, meta, ctx) => style("opacity", O[m.key] ?? m.key, ctx, meta),
    enumerate: () => Object.keys(O).map((k) => `opacity-${k}`),
  });
}
