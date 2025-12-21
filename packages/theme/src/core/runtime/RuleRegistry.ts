import { Rule, RuleContext } from "@/styles/utilities/types";

type UtilityRuleWithoutKind = Omit<Rule, "kind">;

export type EnumerateOptions = {
  families?: string[];
};

export class RuleRegistry {
  exact = new Map<string, Rule>();
  prefixes: Array<{ key: string; rule: Rule }> = [];
  patterns: Rule[] = [];
  finalized = false;

  addExactRule(key: string, rule: UtilityRuleWithoutKind) {
    this.exact.set(key, {
      ...rule,
      kind: "exact",
      key: key,
    });
  }

  addPrefixRule(key: string, rule: UtilityRuleWithoutKind) {
    this.prefixes.push({ key, rule: { ...rule, kind: "prefix", key: key } });
  }

  addPatternRule(rule: UtilityRuleWithoutKind) {
    this.patterns.push({
      ...rule,
      kind: "pattern",
    });
  }

  finalize() {
    if (this.finalized) return;
    this.prefixes.sort((a, b) => b.key.length - a.key.length);
    this.finalized = true;
  }

  enumerateAll(ctx: RuleContext, opts: EnumerateOptions = {}): string[] {
    const allow = opts.families?.length ? new Set(opts.families) : null;
    const out: string[] = [];

    const push = (r: Rule) => {
      if (allow && (!r.family || !allow.has(r.family))) return;
      if (r.enumerate) out.push(...r.enumerate(ctx));
    };

    for (const [, r] of this.exact) push(r);
    for (const { rule: r } of this.prefixes) push(r);
    for (const r of this.patterns) push(r);

    // unique + stable
    return Array.from(new Set(out));
  }
}
