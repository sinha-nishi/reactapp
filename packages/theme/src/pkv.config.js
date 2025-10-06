export default {
  include: ["styles/**/*.scss", "overrides/**/*.css"],
  presetsDir: "./presets",
  compat: { tailwind: true, bootstrap: true },
  validation: {
    classPrefix: [/^(c|o|l|u)-/, /^is-/, /^has-/],
    disallowedPropsByLayer: { utilities: ["position", "z-index"] },
    severity: "warn",
  },
};
