import { InputStyleOptions } from "../../@types";
import { CssBuilder } from "../../core/builder";

export function inputStyles(
  b: CssBuilder,
  opts: InputStyleOptions,
): CssBuilder {
  const { theme } = b.ctx;
  const focusRing = opts.focusRing ?? true;

  /* =========================
   * Input / Textarea / Select
   * ========================= */
  b.components(
    `
:where(.input),
:where(.textarea),
:where(.select) {
  width: 100%;
  padding: ${theme.value("spacing.sm")} ${theme.value("spacing.md")};
  border-radius: ${theme.value("radii.md")};
  border: 1px solid ${theme.value("colors.border")};
  background: ${theme.value("colors.surface")};
  color: ${theme.value("colors.text")};
  font-size: ${theme.value("fontSizes.sm")};
}

:where(.textarea) {
  min-height: 6rem;
  resize: vertical;
}

:where(.input::placeholder),
:where(.textarea::placeholder) {
  color: ${theme.value("colors.textMuted")};
}

:where(.input:disabled),
:where(.textarea:disabled),
:where(.select:disabled) {
  opacity: .6;
  cursor: not-allowed;
}

:where(.input[aria-invalid="true"]),
:where(.textarea[aria-invalid="true"]),
:where(.select[aria-invalid="true"]) {
  border-color: ${theme.value("colors.danger")};
}

${
  focusRing
    ? `
:where(.input:focus-visible),
:where(.textarea:focus-visible),
:where(.select:focus-visible) {
  outline: 2px solid ${theme.value("colors.focus")};
  outline-offset: 2px;
}
`
    : ""
}
`,
    "components-input",
  );

  return b;
}
