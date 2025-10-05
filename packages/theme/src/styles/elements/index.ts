import { CssBuilder, BuilderPlugin } from "../../builder/core";

export type ThemeOptions = {
  tokens?: Partial<Record<string, string>>;
  utilities?: { spacingScale?: number[] };
};

export const elementsPlugin =
  (opts: ThemeOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    // 03-generic: reset/normalize (minimal)
    b.elements(`h1 {
      box-sizing:border-box
    }`, "elements-h1");

    b.elements(`input,button,textarea,select {
      box-sizing:border-box
    }`, "elements-inputs");
  };
