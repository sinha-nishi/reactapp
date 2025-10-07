import type { VariantBuilder } from "../../@types";

// builds responsive + state variant wrappers
export const variants = (screens: Record<string, string>): VariantBuilder => {
  const pseudo: Record<string, string> = {
    hover: ":hover",
    focus: ":focus",
    active: ":active",
    disabled: ":disabled",
    visited: ":visited",
    first: ":first-child",
    last: ":last-child",
    odd: ":nth-child(odd)",
    even: ":nth-child(even)",
    focuswithin: ":focus-within",
    focusvisible: ":focus-visible",
  };

  return (tokens, decls) => {
    // tokens e.g. ["md","hover"] from "md:hover:bg-red-500"
    let wrapped = decls;

    tokens.forEach((t) => {
      if (t in pseudo) {
        wrapped = wrapped.map((rule) => ({
          ...rule,
          selector: `${rule.selector}${pseudo[t]}`,
        }));
        return;
      }

      if (t === "dark") {
        wrapped = wrapped.map((rule) => ({
          ...rule,
          selector: `.dark ${rule.selector}`,
        }));
        return;
      }

      if (t.startsWith("group-")) {
        const g = t.slice(6);
        const pseudoSel = pseudo[g] ?? "";
        wrapped = wrapped.map((rule) => ({
          ...rule,
          selector: `.group${pseudoSel} ${rule.selector}`,
        }));
        return;
      }

      if (t.startsWith("data-")) {
        const attr = t.slice(5);
        wrapped = wrapped.map((rule) => ({
          ...rule,
          selector: `${rule.selector}[data-${attr}]`,
        }));
        return;
      }
      if (t.startsWith("aria-")) {
        const attr = t.slice(5);
        wrapped = wrapped.map((rule) => ({
          ...rule,
          selector: `${rule.selector}[aria-${attr}]`,
        }));
        return;
      }

      // responsive
      if (t in screens) {
        const min = screens[t];
        wrapped = wrapped.map((rule) => ({
          ...rule,
          media: `@media (min-width: ${min})`,
        }));
      }
    });

    return wrapped;
  };
};
