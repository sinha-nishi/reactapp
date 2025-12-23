import type { VariantBuilder } from "../@types";

const applySelectorVariant = (t: string, sel: string): string[] => {
  if (t === "hover") return [`${sel}:hover`];
  if (t === "focus") return [`${sel}:focus`];
  if (t === "active") return [`${sel}:active`];
  if (t === "disabled") return [`${sel}:disabled`];

  if (t === "group-hover") return [`.group:hover ${sel}`];
  if (t === "dark") return [`.dark ${sel}`];

  // ✅ placeholder: expands into both selectors
  if (t === "placeholder")
    return [`${sel}::placeholder`, `${sel}::-moz-placeholder`];

  return [sel];
};

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
    placeholder: "::placeholder",
  };

  return (tokens, decls) => {
    // tokens e.g. ["md","hover"] from "md:hover:bg-red-500"
    let wrapped = decls;

    tokens.forEach((t) => {
      if (t in pseudo) {
        if (t === "placeholder") {
          wrapped = wrapped.flatMap((rule) => [
            { ...rule, selector: `${rule.selector}::placeholder` },
            { ...rule, selector: `${rule.selector}::-moz-placeholder` },
          ]);
          return;
        }

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
