import { stringify } from "../runtime/stringify";

type CompileEngine = {
  compile: (classes: string[]) => any[]; // CSSObject[]
  enumerate?: (opts?: { families?: string[] }) => string[];
};

type CatalogPresetSpec =
  | { type: "classes"; classes: string[] }
  | { type: "families"; families: string[] }
  | { type: "preset"; name: string };

type UtilityCatalog = {
  presets: Record<string, (tokens: Record<string, any>) => CatalogPresetSpec>;
};

type UtilityAPI = {
  add: (classes: string | string[]) => void;
  remove: (classes: string | string[]) => void;
  clear: () => void;
  list: () => string[];
  enumerate?: (opts?: { families?: string[] }) => string[];
  preset?: (name: string) => void;
};

declare global {
  // Optional typing convenience if you're in TS project
  // eslint-disable-next-line no-var
  var __PKV_UTIL__: any;
}

export function utilityEnginePlugin(opts: {
  engine: CompileEngine;
  key?: string; // de-dupe key for builder.utilities(...)
  catalog?: UtilityCatalog; // optional preset catalog
  apiName?: string; // namespace name on builder (default: "util")
  layer?: "utilities" | "components" | "layout"; // default: utilities
}) {
  const layer = opts.layer ?? "utilities";
  const apiName = opts.apiName ?? "util";
  const key = opts.key ?? "__utility.engine__";

  return (builder: any) => {
    const queue = new Set<string>();

    // attach a neutral API namespace (one property on builder)
    const api: UtilityAPI = {
      add: (classes) => {
        (Array.isArray(classes) ? classes : String(classes).split(/\s+/))
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((c) => queue.add(c));
      },
      remove: (classes) => {
        (Array.isArray(classes) ? classes : String(classes).split(/\s+/))
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((c) => queue.delete(c));
      },
      clear: () => queue.clear(),
      list: () => Array.from(queue),
    };

    if (opts.engine.enumerate) {
      api.enumerate = (o) => opts.engine.enumerate!(o);
    }

    if (opts.catalog) {
      api.preset = (name: string) => {
        const specFn = opts.catalog!.presets[name];
        if (!specFn) throw new Error(`Unknown preset: ${name}`);
        const tokens =
          typeof builder.getTokens === "function" ? builder.getTokens() : {};
        const spec = specFn(tokens);

        if (spec.type === "classes") api.add(spec.classes);
        else if (spec.type === "families") {
          if (!api.enumerate)
            throw new Error("Engine does not support enumerate()");
          api.add(api.enumerate({ families: spec.families }));
        } else if (spec.type === "preset") {
          api.preset!(spec.name);
        }
      };
    }

    builder[apiName] = api;

    // JIT compile + inject just-in-time
    builder.onBeforeSerialize(() => {
      if (!queue.size) return;

      const cssObjects = opts.engine.compile(Array.from(queue));
      const css = stringify(cssObjects);

      if (!css || !css.trim()) return;

      // inject to chosen layer; key ensures idempotent on repeated toString calls
      builder[layer](css, key);
    });
  };
}
