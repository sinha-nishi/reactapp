import { describe, expect, test } from "vitest";
import { packs } from "../src";

describe("Typography font", () => {
  test("fonts-sans", () => {
    const theme = packs.radix;
    expect(theme.value("fonts.body")).toEqual(
      `system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`,
    );
  });

  test("fonts-mono", () => {
    const theme = packs.radix;
    expect(theme.value("fonts.mono")).toEqual(
      `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
    );
  });
});
