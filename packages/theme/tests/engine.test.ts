import { describe, expect, test } from "vitest";
import { ClassEngine } from "../src/core/runtime/ClassEngine";
import { utilitiesEngine } from "../src/styles/utilities";

describe("sum", () => {
  test("adds two numbers", () => {
    expect(1 + 2).toBe(3);
  });
});

// describe("ClassEngine enumerate", () => {
//   test("engine.enumerate returns finite classes for spacing", () => {
//     const engine = new ClassEngine({ plugins: [utilitiesEngine({})] });
//     const classes = engine.enumerate({}, { families: ["spacing"] });
//     const cssObjects = engine.compile(classes);
//     expect(classes).toMatchSnapshot();
//     expect(cssObjects).toMatchSnapshot();
//     expect(ClassEngine.toCss(cssObjects)).toMatchSnapshot();
//   });
// });
