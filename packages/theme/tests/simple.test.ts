import { describe, expect, test } from "vitest";
import { buildUtilities } from "../src/plugins/compat/tailwind/utilities";
import { defaultScales } from "../src/tokens/scales";

function compile(classes: string[]) {
  const engine = buildUtilities(defaultScales, {
    enableArbitraryValues: true,
    prefix: "",
  });
  const ctx = {
    theme: defaultScales,
    screens: { sm: "640px", md: "768px" },
    important: false,
    resolveColor: (k: string) =>
      (defaultScales.colors as Record<string, string>)[k] || k,
  };
  const results = [];
  for (const c of classes) {
    const m = engine.match(c);
    if (!m) continue;
    results.push(...engine.render(m, m, ctx));
  }
  return results;
}

function sum(a: number, b: number) {
  return a + b;
}

describe("sum", () => {
  test("adds two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});

test("text-sm & bg-slate-100/80", () => {
  const out = compile(["text-sm", "bg-slate-100/80"]);
  expect(out).toMatchSnapshot();
});
