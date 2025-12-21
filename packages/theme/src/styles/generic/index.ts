import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions } from "../../@types";

export const genericPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    const enableReducedMotion = opts?.a11y?.reducedMotion ?? true;
    const enableSmoothScroll = opts?.a11y?.smoothScroll ?? false; // default off: respectful
    const enableSelectionFixes =
      typeof opts?.layers?.generic === "object"
        ? (opts.layers.generic.selection ?? false)
        : false;

    // 04-generic: baseline reset / normalize (token-agnostic)

    // 1) Box sizing reset
    b.generic(
      `
:where(*, *::before, *::after) { box-sizing: border-box; }
`,
      "generic-box-sizing",
    );

    // 2) Remove default margins + improve text rendering
    b.generic(
      `
:where(html, body) { margin: 0; padding: 0; }
:where(html) {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  text-rendering: optimizeLegibility;
}
:where(body) {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`,
      "generic-html-body",
    );

    // 3) Consistent media defaults
    b.generic(
      `
:where(img, picture, video, canvas, svg) {
  display: block;
  max-width: 100%;
  height: auto;
}
`,
      "generic-media",
    );

    // 4) Forms inherit font (huge DX win)
    b.generic(
      `
:where(input, button, textarea, select) {
  font: inherit;
  color: inherit;
}
:where(button, [type="button"], [type="reset"], [type="submit"]) {
  cursor: pointer;
}
:where(textarea) { resize: vertical; }
`,
      "generic-forms",
    );

    // 5) Links and lists (minimal)
    b.generic(
      `
:where(a) { color: inherit; text-decoration: inherit; }
:where(ul, ol) { padding: 0; margin: 0; list-style: none; }
`,
      "generic-links-lists",
    );

    // 6) Tables
    b.generic(
      `
:where(table) { border-collapse: collapse; border-spacing: 0; }
:where(th) { font-weight: inherit; text-align: inherit; }
`,
      "generic-tables",
    );

    // 7) Optional: smooth scrolling (off by default)
    if (enableSmoothScroll) {
      b.generic(
        `
:where(html:focus-within) { scroll-behavior: smooth; }
`,
        "generic-smooth-scroll",
      );
    }

    // 8) A11y: reduced motion support
    if (enableReducedMotion) {
      b.generic(
        `
@media (prefers-reduced-motion: reduce) {
  :where(html:focus-within) { scroll-behavior: auto; }
  :where(*, *::before, *::after) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`,
        "generic-reduced-motion",
      );
    }

    // 9) Optional: selection (some teams prefer leaving untouched)
    if (enableSelectionFixes) {
      b.generic(
        `
:where(::selection) { text-shadow: none; }
`,
        "generic-selection",
      );
    }

    b.generic(`:where(hr) { border: 0; height: 1px; }`, "generic-hr");
    b.generic(`:where(button) { background: none; }`, "generic-button");
  };
