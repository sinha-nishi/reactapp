import { TailwindCompat } from "../compat/tailwind";
import type { CSSObject, CompatPlugin } from "../@types";
import { mergeRules } from "../utils/rules";

export interface ClassEngineOptions {
  compat?: Array<
    CompatPlugin | ["tailwind", Parameters<typeof TailwindCompat>[0]?]
  >;
}

export class ClassEngine {
  private plugins: CompatPlugin[] = [];

  constructor(opts: ClassEngineOptions = {}) {
    for (const item of opts.compat ?? []) {
      if (Array.isArray(item) && item[0] === "tailwind") {
        this.plugins.push(TailwindCompat(item[1] ?? {}));
      } else if (!Array.isArray(item)) {
        this.plugins.push(item);
      }
    }
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
}


