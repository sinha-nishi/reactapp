export default {
  include: [
    "styles/**/*.scss",
    "overrides/**/*.css",
    "presets/**/*.scss",
    "presets/**/*.css",
  ],
  presetsDir: "./presets", // resolves --preset names here
  compat: {
    sets: ["tailwind"],
    tailwind: {
      prefix: "", // or "tw-"
      important: false, // true | "#app"
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      theme: {
        // override palettes, spacing, fontSize etc. as needed
        colors: {
          /* merge/override */
        },
      },
      safelist: ["prose", "container", "md:prose-lg"],
    },
  },
  validation: {
    classPrefix: [/^(c|o|l|u)-/, /^is-/, /^has-/],
    disallowedPropsByLayer: { utilities: ["position", "z-index"] },
    severity: "warn",
  },
  strict: true, // make warnings fail build (equiv to --strict)
};
