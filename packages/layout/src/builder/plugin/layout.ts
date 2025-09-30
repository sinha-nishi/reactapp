import { CssBuilder, BuilderPlugin } from "@pkvsinha/react-theme";

export type LayoutOptions = { container?: string; gapVar?: string };

export const layoutPlugin =
  (opts: LayoutOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    const container = opts.container ?? "1200px";
    const gapVar = opts.gapVar ?? "space-3";
    b.rule(
      "layout",
      `.l-container`,
      `max-width:${container};margin-inline:auto;padding-inline:var(--pkv-${gapVar})`,
      "l-container",
    );
    b.rule(
      "layout",
      `.o-stack`,
      `display:flex;flex-direction:column;gap:var(--pkv-${gapVar})`,
      "o-stack",
    );
    b.rule(
      "layout",
      `.o-cluster`,
      `display:flex;flex-wrap:wrap;gap:var(--pkv-${gapVar});align-items:center`,
      "o-cluster",
    );
  };

export function createLayoutBuilder(
  existing?: CssBuilder,
  opts?: LayoutOptions,
) {
  const b = existing ?? new CssBuilder({ prefix: "pkv" });
  return b.use(layoutPlugin(opts));
}
