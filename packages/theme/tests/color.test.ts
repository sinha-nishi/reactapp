import { describe, expect, test } from "vitest";
import { packs } from "../src";
import { presetColors } from "../src/styles/utilities/preset";

describe("LoadedTheme", () => {
  test("radix color set - semantic", () => {
    const theme = packs.radix;
    expect(theme.keys("colors")).toMatchSnapshot();
  });
  test("radix color set - all", () => {
    const theme = packs.radix;
    expect(
      theme.keys("colors", {
        flatten: true,
        includeAbstract: true,
        sort: true,
      }),
    ).toMatchSnapshot();
  });
  test("radix color resolve", () => {
    const theme = packs.radix;
    const values = {
      orange: {
        dash: theme.resolveColor("orange-600"),
        dot: theme.resolveColor("orange.600"),
        primitive: theme.resolveColor("primitive.color.orange.600"),
      },
    };
    expect(values).toMatchSnapshot();
  });
  test("pallette color resolve", () => {
    const theme = packs.radix;
    const colors = (withAlpha: boolean = false) => [
      ...theme.keys("colors"),
      ...presetColors(withAlpha),
    ];
    expect(
      colors().map((c) => theme.resolveColor(normalizeColorKey(c))),
    ).toMatchSnapshot();
  });
});

function normalizeColorKey(key: string) {
  // "orange-600" -> "orange.600"
  // "slate-900/50" -> "slate.900/50"
  // "cyan-900/30" -> "cyan.900/30"
  return key.replace(
    /^([a-zA-Z]+)-([0-9]+)(\/[0-9]+)?$/,
    (_, fam, shade, alpha) => `${fam}.${shade}${alpha ?? ""}`,
  );
}
