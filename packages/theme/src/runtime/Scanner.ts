import { UtilityRule } from "@/styles/utilities/types";

type UtilityRuleWithoutKind = Omit<UtilityRule, "kind">;

export class RuleRegistry {
  exact = new Map<string, UtilityRule>();
  prefixes: Array<{ key: string; rule: UtilityRule }> = [];
  patterns: UtilityRule[] = [];
  finalized = false;

  addExact(key: string, rule: UtilityRuleWithoutKind) {
    this.exact.set(key, {
      ...rule,
      kind: "exact",
      key: key,
    });
  }

  addPrefix(key: string, rule: UtilityRuleWithoutKind) {
    this.prefixes.push({ key, rule: { ...rule, kind: "prefix", key: key } });
  }

  addPattern(rule: UtilityRuleWithoutKind) {
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
}

export class Scanner {
  private _registy;
  constructor() {
    this._registy = new RuleRegistry();
  }

  private _match() {}

  use() {}

  compile() {}
}
