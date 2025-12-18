import { describe, expect, test } from "vitest";
import { ClassEngine } from "../src/core/runtime/ClassEngine";
import { utilitiesEngine } from "../src/styles/utilities";

describe("ClassEngine enumerate", () => {
  test("engine.enumerate returns finite classes for spacing", () => {
    const engine = new ClassEngine({ plugins: [utilitiesEngine({})] });
    const classes = engine.enumerate({}, { families: ["spacing"] });
    expect(classes).toMatchSnapshot();
  });
});
