import { describe, expect, test } from "vitest";
import { createThemeBuilder } from "../src";

describe("Generic Layer", () => {
  test("default build output", () => {
    const builder = createThemeBuilder({
      layers: {
        settings: false,
        tools: false,
        generic: true,
        elements: false,
        objects: false,
        components: false,
        utilities: false,
      },
    });
    expect(builder.toString({ minify: false })).toMatchSnapshot();
  });
});
