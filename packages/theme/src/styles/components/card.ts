import { CardStyleOptions } from "../../@types";
import { CssBuilder } from "../../core/builder";

export function cardStyles(b: CssBuilder, opts: CardStyleOptions): CssBuilder {
  const { theme } = b.opts;

  /* =========================
   * Card
   * ========================= */
  const componentCss: string = `
:where(.card) {
  background: ${theme.value("colors.surface")};
  color: ${theme.value("colors.text")};
  border: 1px solid ${theme.value("colors.border")};
  border-radius: ${theme.value("radii.md")};
  box-shadow: ${theme.value("shadows.sm")};
}

:where(.card__header) {
  padding: ${theme.value("spacing.md")};
  border-bottom: 1px solid ${theme.value("colors.border")};
}

:where(.card__content) {
  padding: ${theme.value("spacing.md")};
}

:where(.card__footer) {
  padding: ${theme.value("spacing.md")};
  border-top: 1px solid ${theme.value("colors.border")};
}

:where(.card__title) {
  margin: 0;
  font-size: ${theme.value("fontSizes.lg")};
  font-weight: ${theme.value("fontWeights.semibold")};
}

:where(.card__description) {
  margin-top: ${theme.value("spacing.xs")};
  color: ${theme.value("colors.textMuted")};
  font-size: ${theme.value("fontSizes.sm")};
}
`;
  b.components(componentCss, "components-card");

  return b;
}
