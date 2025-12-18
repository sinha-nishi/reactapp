import type { CSSObject, ClassEnginePlugin, UtilityContext } from "@/@types";
import { mergeRules } from "../../utils/rules";

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

  enumerate(ctx: UtilityContext, opts?: { families?: string[] }): string[] {
    const out: string[] = [];
    for (const p of this.plugins) {
      out.push(...p.enumerate(ctx, opts));
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
}
