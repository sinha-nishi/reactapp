export default {
  plugins: {
    "postcss-import": {},
    "postcss-nesting": {},
    autoprefixer: {},
    ...(process.env.MINIFY ? { cssnano: {} } : {}),
  },
};
