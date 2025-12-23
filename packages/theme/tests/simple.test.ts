import { describe, expect, test } from "vitest";
import { defaultTokens } from "../src";

// function compile(classes: string[]) {
//   // const engine = buildUtilities(defaultTokens, {
//   //   enableArbitraryValues: true,
//   //   prefix: "",
//   // });
//   const ctx = {
//     theme: defaultTokens,
//     screens: { sm: "640px", md: "768px" },
//     important: false,
//   };
//   const results = [];
//   for (const c of classes) {
//     const m = engine.match(c);
//     if (!m) continue;
//     results.push(...engine.render(m, m, ctx));
//   }
//   return results;
// }

function sum(a: number, b: number) {
  return a + b;
}

describe("sum", () => {
  test("adds two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});

// test("text-sm & bg-slate-100/80", () => {
//   const out = compile(["text-sm", "bg-slate-100/80"]);
//   expect(out).toMatchSnapshot();
// });
