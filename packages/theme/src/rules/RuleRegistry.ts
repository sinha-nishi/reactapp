import { UtilityRule } from "../@types";

export class RuleRegistry {
  exact = new Map<string, UtilityRule>();
  prefixes: Array<{ key: string; rule: UtilityRule }> = [];
  patterns: UtilityRule[] = [];
  finalized = false;

  addExact(key: string, rule: UtilityRule) {
    rule.kind = "exact";
    (rule as any).key = key;
    this.exact.set(key, rule);
  }
  addPrefix(key: string, rule: UtilityRule) {
    rule.kind = "prefix";
    (rule as any).key = key;
    this.prefixes.push({ key, rule });
  }
  addPattern(rule: UtilityRule) {
    rule.kind = "pattern";
    this.patterns.push(rule);
  }

  finalize() {
    if (this.finalized) return;
    this.prefixes.sort((a, b) => b.key.length - a.key.length);
    this.finalized = true;
  }
}
