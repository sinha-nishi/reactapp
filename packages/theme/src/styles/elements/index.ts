import type { BuilderOptions } from "@/@types";
import { CssBuilder, BuilderPlugin } from "../../core/builder";

export const elementsPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    const { theme } = b.ctx;
    const focusRing = opts?.a11y?.focusRing ?? true;

    b.elements(
      `
:where(body) {
  font-family: ${theme.value("fonts.body")};
  font-size: ${theme.value("fontSizes.md")};
  font-weight: ${theme.value("fontWeights.regular")};
  line-height: ${theme.value("lineHeights.base")};
  color: ${theme.value("colors.text")};
  background: ${theme.value("colors.bg")};
}
`,
      "elements-body",
    );

    b.elements(
      `
:where(p) { margin: 0; }
:where(p + p) { margin-top: ${theme.value("spacing.md")}; }
`,
      "elements-paragraphs",
    );

    b.elements(
      `
:where(h1, h2, h3, h4, h5, h6) {
  margin: 0;
  font-weight: ${theme.value("fontWeights.bold")};
  line-height: ${theme.value("lineHeights.tight")};
}
:where(h1) { font-size: ${theme.value("fontSizes.2xl")}; }
:where(h2) { font-size: ${theme.value("fontSizes.xl")}; }
:where(h3) { font-size: ${theme.value("fontSizes.lg")}; }
:where(h4) { font-size: ${theme.value("fontSizes.md")}; }
:where(h5) { font-size: ${theme.value("fontSizes.sm")}; }
:where(h6) { font-size: ${theme.value("fontSizes.sm")}; font-weight: ${theme.value("fontWeights.medium")}; }
`,
      "elements-headings",
    );

    b.elements(
      `
:where(a) {
  color: ${theme.value("colors.primary")};
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
:where(a:hover) { text-decoration-thickness: 2px; }
`,
      "elements-links",
    );

    b.elements(
      `
:where(hr) {
  margin: ${theme.value("spacing.lg")} 0;
  background: ${theme.value("colors.border")};
  border: 0;
  height: 1px;
}
`,
      "elements-hr",
    );

    b.elements(
      `
:where(code, kbd, samp, pre) {
  font-family: ${theme.value("fonts.mono")};
  font-size: ${theme.value("fontSizes.sm")};
}
:where(pre) {
  margin: 0;
  padding: ${theme.value("spacing.md")};
  overflow: auto;
  border-radius: ${theme.value("radii.md")};
  background: ${theme.value("colors.surface")};
  border: ${theme.value("borders.width.sm")} solid ${theme.value("colors.border")};
}
`,
      "elements-code",
    );

    b.elements(
      `
:where(table) { width: 100%; }
:where(th, td) {
  padding: ${theme.value("spacing.sm")} ${theme.value("spacing.md")};
  border-bottom: ${theme.value("borders.width.sm")} solid ${theme.value("colors.border")};
}
:where(th) { font-weight: ${theme.value("fontWeights.medium")}; }
`,
      "elements-tables",
    );

    const formsCss: string = `
:where(input, button, textarea, select) { box-sizing: border-box; }

:where(input, textarea, select) {
  padding: ${theme.value("spacing.sm")} ${theme.value("spacing.md")};
  border-radius: ${theme.value("radii.sm")};
  border: ${theme.value("borders.width.sm")} solid ${theme.value("colors.border")};
  background: ${theme.value("colors.surface")};
  color: ${theme.value("colors.text")};
}

:where(input::placeholder, textarea::placeholder) {
  color: ${theme.value("colors.muted")};
}

:where(button) {
  padding: ${theme.value("spacing.sm")} ${theme.value("spacing.md")};
  border-radius: ${theme.value("radii.sm")};
  border: ${theme.value("borders.width.sm")} solid ${theme.value("colors.border")};
  background: ${theme.value("colors.surface")};
  color: ${theme.value("colors.text")};
}
:where(button:disabled, input:disabled, textarea:disabled, select:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
`;
    b.elements(formsCss, "elements-forms");

    if (focusRing) {
      b.elements(
        `
:where(a, button, input, textarea, select):focus-visible {
  outline: ${theme.value("borders.width.md")} solid ${theme.value("colors.focusRing")};
  outline-offset: 2px;
}
`,
        "elements-focus-visible",
      );
    }
  };
