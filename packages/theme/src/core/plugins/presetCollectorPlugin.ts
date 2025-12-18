export function presetCollectorPlugin(cfg: {
  apiName?: string;          // default "util"
  presets?: string[];
  families?: string[];
  classes?: string[];
}) {
  const apiName = cfg.apiName ?? "util";

  return (builder: any) => {
    builder.onBeforeSerialize(() => {
      const api = builder[apiName];
      if (!api?.add) return;

      if (cfg.classes?.length) api.add(cfg.classes);

      if (cfg.families?.length) {
        if (!api.enumerate) throw new Error("Engine does not support enumerate()");
        api.add(api.enumerate({ families: cfg.families }));
      }

      if (cfg.presets?.length) {
        if (!api.preset) throw new Error("Catalog preset support not installed.");
        for (const p of cfg.presets) api.preset(p);
      }
    });
  };
}
