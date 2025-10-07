import { BuilderPlugin } from "@pkvsinha/react-theme";

export const componentsPlugin = (): BuilderPlugin => (b) => {
  // Button
  b.rule(
    "components",
    `.c-button`,
    `display:inline-flex;align-items:center;justify-content:center;` +
      `border-radius:var(--pkv-radius-md);padding:.5rem .875rem;` +
      `font-family:var(--pkv-font-sans);line-height:1;`,
    "c-button-base",
  );
  b.rule(
    "components",
    `.c-button--primary`,
    `background:var(--pkv-color-primary-500);color:#fff`,
    "c-button-primary",
  );
  b.rule(
    "components",
    `.c-button--ghost`,
    `background:transparent;border:1px solid var(--pkv-color-border)`,
    "c-button-ghost",
  );

  // Card
  b.rule(
    "components",
    `.c-card`,
    `border:1px solid var(--pkv-color-border);border-radius:12px;padding:1rem;background:#fff`,
    "c-card",
  );
};
