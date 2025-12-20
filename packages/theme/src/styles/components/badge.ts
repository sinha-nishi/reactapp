import { BadgeStyleOptions } from "../../@types";
import { CssBuilder } from "../../core/builder";

export function badgeStyles(
  b: CssBuilder,
  opts: BadgeStyleOptions,
): CssBuilder {
  const { theme } = b.ctx;
  const focusRing = opts.focusRing ?? true;

  /* =========================
   * Badge
   * ========================= */
  b.components(
    `
    :where(.badge) {
        display: inline-flex;
        align-items: center;
        padding: ${theme.value("spacing.xs")} ${theme.value("spacing.sm")};
        border-radius: 999px;
        font-size: ${theme.value("fontSizes.xs")};
        font-weight: ${theme.value("fontWeights.medium")};
        background: ${theme.value("colors.bgMuted")};
        color: ${theme.value("colors.text")};
    }

    :where(.badge--primary) {
        background: ${theme.value("colors.primarySoft")};
        color: ${theme.value("colors.primary")};
    }
    `,
    "components-badge",
  );

  return b;
}
