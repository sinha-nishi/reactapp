import { describe, expect, test } from "vitest";
import { createThemeBuilder } from "../src";

describe("Settings Layer", () => {
  test("engine.enumerate returns finite classes for spacing", () => {
    const builder = createThemeBuilder({
      layers: {
        settings: true,
        tools: false,
        generic: false,
        elements: false,
        objects: false,
        components: false,
        utilities: false,
      },
    });
    expect(builder.toString({ minify: false })).toMatchSnapshot();
  });
});
