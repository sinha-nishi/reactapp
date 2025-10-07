export default {
  include: [
    "styles/**/*.scss",
    "overrides/**/*.css",
    "presets/**/*.scss",
    "presets/**/*.css",
  ],
  presetsDir: "./presets", // resolves --preset names here
  compat: { tailwind: true, bootstrap: true },
  validation: {
    classPrefix: [/^(c|o|l|u)-/, /^is-/, /^has-/],
    disallowedPropsByLayer: { utilities: ["position", "z-index"] },
    severity: "warn",
  },
  strict: true, // make warnings fail build (equiv to --strict)
};
