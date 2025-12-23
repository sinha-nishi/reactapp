import { describe, expect, test } from "vitest";
import { ClassEngine, packs, RuleRegistry } from "../src";
import { presetColors } from "../src/styles/utilities/preset";
import { register } from '../src/styles/utilities/gradient';

test("pallette gradient resolve - via", () => {
  expect(presetColors(false).map((c) => `via-${c}`)).toMatchSnapshot();
});

test("pallette gradient resolve - to", () => {
  expect(presetColors(false).map((c) => `to-${c}`)).toMatchSnapshot();
});

test("pallette gradient resolve - from", () => {
  expect(presetColors(false).map((c) => `from-${c}`)).toMatchSnapshot();
});

test("pallette gradient resolve - list", () => {
  const reg = new RuleRegistry();
  const theme = packs.radix;
  register(reg, theme);
//   const engine = new ClassEngine({
//     plugins: [
//       {
//         name: "utilities-engine",
//         variants(tokens, decls) {
//           return v(tokens ?? [], decls ?? []);
//         },

//         match(className: string) {
//           return util.match(className);
//         },
//         render(match, meta): CSSObject[] {
//           return util.render(match, meta, b.ctx);
//         },
//         enumerate: (ctx, o) => util.enumerate(b.ctx, o),
//       },
//     ],
//   });
//   expect(presetColors(false).map((c) => `from-${c}`)).toMatchSnapshot();
});
