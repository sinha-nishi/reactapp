import { UtilityContext } from "@/@types";
import { UtilityRule } from "@/styles/utilities/types";

type UtilityRuleWithoutKind = Omit<UtilityRule, "kind">;

export type EnumerateOptions = {
  families?: string[];
};

export class RuleRegistry {
  exact = new Map<string, UtilityRule>();
  prefixes: Array<{ key: string; rule: UtilityRule }> = [];
  patterns: UtilityRule[] = [];
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

  enumerateAll(ctx: UtilityContext, opts: EnumerateOptions = {}): string[] {
    const allow = opts.families?.length ? new Set(opts.families) : null;
    const out: string[] = [];

    const push = (r: UtilityRule) => {
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
