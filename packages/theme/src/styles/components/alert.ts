import { AlertStyleOptions } from "@/@types";
import { CssBuilder } from "../../core/builder";

export function alertStyles(
  b: CssBuilder,
  opts: AlertStyleOptions,
): CssBuilder {
  const { theme } = b.ctx;
  const focusRing = opts.focusRing ?? true;
  /* =========================
   * Alert
   * ========================= */
  const alertCss: string = `
:where(.alert) {
  display: flex;
  gap: ${theme.value("spacing.md")};
  padding: ${theme.value("spacing.md")};
  border-radius: ${theme.value("radii.md")};
  border: 1px solid ${theme.value("colors.border")};
  background: ${theme.value("colors.surface")};
  color: ${theme.value("colors.text")};
}

:where(.alert--info) {
  background: ${theme.value("colors.infoSoft")};
  border-color: ${theme.value("colors.info")};
}

:where(.alert--success) {
  background: ${theme.value("colors.successSoft")};
  border-color: ${theme.value("colors.success")};
}

:where(.alert--warning) {
  background: ${theme.value("colors.warningSoft")};
  border-color: ${theme.value("colors.warning")};
}

:where(.alert--danger) {
  background: ${theme.value("colors.dangerSoft")};
  border-color: ${theme.value("colors.danger")};
}

:where(.alert__title) {
  font-weight: ${theme.value("fontWeights.semibold")};
}

:where(.alert__description) {
  margin-top: ${theme.value("spacing.xs")};
  color: ${theme.value("colors.textMuted")};
}
`;
  b.components(alertCss, "components-alert");

  return b;
}
