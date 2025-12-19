import { describe, expect, test } from "vitest";
import { createThemeBuilder } from "../src";

describe("createThemeBuilder", () => {
  test("create basic css", () => {
    const builder = createThemeBuilder();
    expect(builder.toString({ minify: false })).toMatchSnapshot();
  });
});
