import type { Plugin, Rule, Declaration, AtRule, ChildNode } from "postcss";

export type LayerName =
  | "settings"
  | "tools"
  | "generic"
  | "elements"
  | "layout"
  | "components"
  | "utilities";
export type Tokens = Record<string, string>;

export interface ExtractedRule {
  layer: LayerName;
  css: string;
  key?: string;
}
export interface Extracted {
  tokens: Tokens;
  rules: ExtractedRule[];
}

export interface PkvOptions {
  /** Infer layer from @layer pkv.<name> or comment directives; fallback by path */
  layerFromPath?: boolean;
  /** If true, accept @layer <name> without pkv. prefix */
  acceptUnprefixedLayer?: boolean;
}

function layerFromFilepath(filepath?: string): LayerName | undefined {
  if (!filepath) return undefined;
  const lower = filepath.toLowerCase();
  if (lower.includes("/01-settings/") || lower.includes("settings"))
    return "settings";
  if (lower.includes("/02-tools/") || lower.includes("tools")) return "tools";
  if (lower.includes("/03-generic/") || lower.includes("generic"))
    return "generic";
  if (lower.includes("/04-elements/") || lower.includes("elements"))
    return "elements";
  if (lower.includes("/05-objects/") || lower.includes("objects"))
    return "layout"; // map objects→layout bucket for now
  if (lower.includes("/06-components/") || lower.includes("components"))
    return "components";
  if (lower.includes("/07-utilities/") || lower.includes("utilities"))
    return "utilities";
  return undefined;
}

function findCommentMeta(node: ChildNode): { layer?: LayerName; key?: string } {
  const comments = (node as any).raws?.before || "";
  const m = /pkv:layer=([a-z]+)/i.exec(comments);
  const k = /key=([a-z0-9-_]+)/i.exec(comments);
  const layer = m?.[1] as LayerName | undefined;
  const key = k?.[1];
  return { layer, key };
}

// The plugin collects tokens & rules, then stores them on result.messages
export const postcssPkv = (opts: PkvOptions = {}): Plugin => ({
  postcssPlugin: "postcss-pkv",
  Once(root, { result }) {
    const out: Extracted = { tokens: {}, rules: [] };

    const pushRule = (layer: LayerName, css: string, key?: string) => {
      out.rules.push({ layer, css, key });
    };

    const getNodeCss = (n: ChildNode) => n.toString();

    const handleLayerBlock = (at: AtRule, layerHint?: LayerName) => {
      let name = String(at.params || "").trim();
      // expect "pkv.components" or fallback to bare name
      let layer: LayerName | undefined;
      if (name.startsWith("pkv.")) layer = name.slice(4) as LayerName;
      else if (opts.acceptUnprefixedLayer) layer = name as LayerName;
      else layer = layerHint;

      at.walkRules((r) => {
        const { layer: metaLayer, key } = findCommentMeta(r);
        const finalLayer = (metaLayer || layer || "utilities") as LayerName;
        pushRule(finalLayer, getNodeCss(r), key);
      });

      at.walkDecls((d: Declaration) => {
        if (d.parent?.type === "rule") return; // already captured as rule
        if (d.parent?.type === "root" && String(d.prop).startsWith("--pkv-")) {
          out.tokens[d.prop.replace(/^--pkv-/, "")] = String(d.value);
        }
      });
    };

    // 1) tokens at :root
    root.walkRules((r: Rule) => {
      if (r.selector === ":root") {
        r.walkDecls((d) => {
          if (String(d.prop).startsWith("--pkv-")) {
            out.tokens[d.prop.replace(/^--pkv-/, "")] = String(d.value);
          }
        });
      }
    });

    // 2) @layer blocks
    root.walkAtRules("layer", (at) => handleLayerBlock(at));

    // 3) top-level rules (no @layer): use comments or filepath fallback
    const fileHint = opts.layerFromPath
      ? layerFromFilepath(root.source?.input.file)
      : undefined;
    root.nodes?.forEach((n) => {
      if (n.type !== "rule") return;
      const { layer: metaLayer, key } = findCommentMeta(n);
      const layer = (metaLayer || fileHint || "utilities") as LayerName;
      pushRule(layer, getNodeCss(n), key);
    });

    result.messages.push({ type: "pkv", plugin: "postcss-pkv", out });
  },
});

postcssPkv.postcss = true;
