import { describe, expect, test } from "vitest";
import { packs } from "../src";

describe("LoadedTheme", () => {
  test("radix theme view", () => {
    const theme = packs.radix;
    expect(theme.view("light")).toMatchSnapshot();
  });

  test("radix theme - viewNames", () => {
    const theme = packs.radix;
    expect(theme.viewNames()).toMatchSnapshot();
  });

  test("radix theme keys - spacing", () => {
    const theme = packs.radix;
    expect(theme.keys("spacing")).toMatchSnapshot();
  });

  test("radix theme keys - colors", () => {
    const theme = packs.radix;
    expect(theme.keys("colors")).toMatchSnapshot();
  });

  test("debug: primitive.spacing exists", () => {
    const theme = packs.radix;
    // flatGroup returns flattened keys below a group (you already expose flatGroup in LoadedTheme)
    expect(
      Object.keys(theme.flatGroup("light", "primitive.spacing"))[0],
    ).toBeDefined();
  });

  test("debug: resolve spacing public path", () => {
    const theme = packs.radix;
    expect(theme.resolvePublicPath("spacing")).toMatchInlineSnapshot(
      `"semantic.spacing||primitive.spacing||primitive.space"`,
    );
  });

  test("debug: pickExistingPath chooses primitive.spacing", () => {
    const theme = packs.radix;
    const candidate = theme.resolvePublicPath("spacing");
    // call varNamePublic to force pickExistingPath() path selection
    // if pickExistingPath works, you'll see a var under primitive-spacing-*
    expect(theme.varNamePublic("spacing.1")).toContain("--spacing-1");
  });
});
