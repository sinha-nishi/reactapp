import { describe, expect, test } from "vitest";
import { packs } from "../src";

describe("LoadedTheme", () => {
  test("radix theme view", () => {
    const theme = packs.radix;
    expect(theme.view("light")).toMatchSnapshot();
  });
});
