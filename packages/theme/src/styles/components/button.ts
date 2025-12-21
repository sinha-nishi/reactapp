import { ButtonStyleOptions } from "../../@types";
import { CssBuilder } from "../../core/builder";

export function buttonStyles(
  b: CssBuilder,
  opts: ButtonStyleOptions,
): CssBuilder {
  const { theme } = b.ctx;
  const focusRing = opts.focusRing ?? true;

  /* =========================
   * Button
   * ========================= */
  b.components(
    `
    :where(.btn) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: ${theme.value("spacing.xs")};
        padding: ${theme.value("spacing.sm")} ${theme.value("spacing.md")};
        border-radius: ${theme.value("radii.md")};
        border: 1px solid transparent;
        background: ${theme.value("colors.primary")};
        color: ${theme.value("colors.onPrimary")};
        font-size: ${theme.value("fontSizes.sm")};
        font-weight: ${theme.value("fontWeights.medium")};
        line-height: 1;
        cursor: pointer;
        text-decoration: none;
    }

    :where(.btn:hover) {
        filter: brightness(1.05);
    }

    :where(.btn:disabled),
    :where(.btn[aria-disabled="true"]) {
        opacity: .6;
        cursor: not-allowed;
    }

    :where(.btn--outline) {
        background: transparent;
        color: ${theme.value("colors.text")};
        border-color: ${theme.value("colors.border")};
    }

    :where(.btn--ghost) {
        background: transparent;
        color: ${theme.value("colors.text")};
    }

    :where(.btn--sm) {
        padding: ${theme.value("spacing.xs")} ${theme.value("spacing.sm")};
        font-size: ${theme.value("fontSizes.xs")};
    }

    :where(.btn--lg) {
        padding: ${theme.value("spacing.md")} ${theme.value("spacing.lg")};
        font-size: ${theme.value("fontSizes.md")};
    }

    ${
      focusRing
        ? `
        :where(.btn:focus-visible) {
            outline: 2px solid ${theme.value("colors.focus")};
            outline-offset: 2px;
        }
        `
        : ""
    }` as string,
    "components-button",
  );

  return b;
}
