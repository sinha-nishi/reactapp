import { describe, expect, test } from "vitest";
import { styleMany } from "../src/styles/utilities/helper";
import { screens } from "./test-helper";
import { ClassEngine } from "../src";

describe("Settings Layer", () => {
  test("engine.enumerate returns finite classes for spacing", () => {
    const cssObject = styleMany(
      {
        "--ky-gradient-from": "transparent",
        "--ky-gradient-stops":
          "var(--ky-gradient-from), var(--ky-gradient-to, rgb(255 255 255 / 0))",
      },
      { screens, important: false },
      { important: false, raw: "from-transparent" },
    );
    expect(cssObject).toEqual({
      decls: {
        "--ky-gradient-from": "transparent",
        "--ky-gradient-stops":
          "var(--ky-gradient-from), var(--ky-gradient-to, rgb(255 255 255 / 0))",
      },
      selector: ".from-transparent",
    });
    expect(ClassEngine.toCss([cssObject])).toEqual(
      `.from-transparent{--ky-gradient-from:transparent;--ky-gradient-stops:var(--ky-gradient-from), var(--ky-gradient-to, rgb(255 255 255 / 0));}`,
    );
  });
});
