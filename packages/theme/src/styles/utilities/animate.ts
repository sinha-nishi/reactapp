import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  reg.addExactRule("animate-pulse", {
    family: "animation",
    match: (cls) => (cls === "animate-pulse" ? { raw: cls } : false),
    apply: (_m, meta, ctx) => [
      // keyframes as a raw block (works if your serializer allows selector "@keyframes ...")
      {
        selector: "@keyframes ky-pulse",
        "0%,100%": { opacity: "1" },
        "50%": { opacity: ".5" },
      } as any,
      {
        selector: `.animate-pulse`,
        animation: "ky-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      } as any,
    ],
    enumerate: () => ["animate-pulse"],
  });
}
