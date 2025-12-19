import { BuilderOptions } from "@/@types";
import { CssBuilder, BuilderPlugin } from "../../core/builder";

export const elementsPlugin =
  (opts?: BuilderOptions): BuilderPlugin =>
  (b: CssBuilder) => {
    // 03-generic: reset/normalize (minimal)
    b.elements(
      `h1 {
      box-sizing:border-box
    }`,
      "elements-h1",
    );

    b.elements(
      `input,button,textarea,select {
      box-sizing:border-box
    }`,
      "elements-inputs",
    );
  };
