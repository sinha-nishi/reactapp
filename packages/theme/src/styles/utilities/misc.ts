import { RuleRegistry } from "../../core/runtime/RuleRegistry";
import { LoadedTheme } from "../../@types";
import { util } from "./helper";

export function register(reg: RuleRegistry, theme: LoadedTheme) {
  const { addExactDecl } = util(reg, theme);

  addExactDecl(reg, "cursor-pointer", "cursor", "pointer");
  addExactDecl(reg, "pointer-events-none", "pointer-events", "none");
  addExactDecl(reg, "overflow-hidden", "overflow", "hidden");

  addExactDecl(
    reg,
    "transition",
    "transition-property",
    "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
  );
  addExactDecl(reg, "transition-all", "transition-property", "all");
  addExactDecl(
    reg,
    "transition-colors",
    "transition-property",
    "color, background-color, border-color, text-decoration-color, fill, stroke",
  );
  addExactDecl(reg, "transition-opacity", "transition-property", "opacity");
  addExactDecl(reg, "transition-shadow", "transition-property", "box-shadow");

  addExactDecl(reg, "duration-300", "transition-duration", "300ms");
  addExactDecl(
    reg,
    "ease-in-out",
    "transition-timing-function",
    "cubic-bezier(0.4, 0, 0.2, 1)",
  );

  addExactDecl(reg, "outline", "outline-style", "solid");
  addExactDecl(reg, "focus:outline-none", "outline", "2px solid transparent"); // (variant will wrap correctly)
}
