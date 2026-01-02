import type {
  CSSObject,
  ClassEnginePlugin,
} from "../../@types";
import { mergeRules } from "../../utils/rules";
import { stringify } from "./stringify";

function expandVariants(base: string[], opts?: { screens: Record<string, string> }): string[] {
  // responsive variants
  const screens = opts?.screens ?? {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };

  const responsive = Object.keys(screens); // ["sm","md","lg","xl","2xl"]

  // state variants (for pass-1 we mostly need responsive; but add these cheap wins)
  const states = ["hover", "focus", "group-hover", "dark"];

  const out = new Set<string>();

  for (const c of base) {
    out.add(c);

    // ✅ Responsive variants for everything (needed for md:top-*, md:w-*, md:hidden etc)
    for (const bp of responsive) out.add(`${bp}:${c}`);

    // ✅ State variants: only apply to “safe” families to avoid nonsense bloat
    // (You can expand this allowlist later in Pass 2/3)
    if (
      c.startsWith("bg-") ||
      c.startsWith("text-") ||
      c.startsWith("border-") ||
      c.startsWith("ring") ||
      c.startsWith("shadow") ||
      c.startsWith("opacity-")
    ) {
      for (const s of states) out.add(`${s}:${c}`);
    }
  }

  return [...out];
}

export interface ClassEngineOptions {
  plugins?: Array<ClassEnginePlugin>;
}

export class ClassEngine {
  private plugins: ClassEnginePlugin[] = [];

  constructor(opts: ClassEngineOptions = {}) {
    for (const item of opts.plugins ?? []) {
      this.plugins.push(item);
    }
  }

  enumerate(
    opts?: { families?: string[]; variants?: boolean },
  ): string[] {
    const out: string[] = [];
    for (const p of this.plugins) {
      out.push(...p.enumerate(opts));
    }
    if (opts?.variants) {
      return expandVariants(out);
    }
    return Array.from(new Set(out));
  }

  compile(classes: string[]): CSSObject[] {
    const out: CSSObject[] = [];
    for (const original of classes) {
      for (const p of this.plugins) {
        const m = p.match(original);
        if (!m) continue;
        const decls = p.render(m, m);
        const wrapped = p.variants(m.tokens ?? [], decls);
        out.push(...wrapped);
        break; // stop at first match
      }
    }
    return mergeRules(out);
  }

  static toCss(cssObjects: CSSObject[]) {
    return stringify(cssObjects);
  }
}
