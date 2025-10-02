// Handy lists
export const INTERNAL_PKG = [
  "@pkvsinha/react-base",
  "@pkvsinha/react-components",
  "@pkvsinha/react-hooks",
  "@pkvsinha/react-icons",
  "@pkvsinha/react-integrate",
  "@pkvsinha/react-layout",
  "@pkvsinha/react-navigate",
  "@pkvsinha/react-theme",
  "@pkvsinha/react-widgets",
];


export const EXTERNAL_PEERS = ["react", "react-dom"];

export const isExternal = (id) => {
  // React & subpaths
  if (/^react($|\/)/.test(id)) return true; // react, react/jsx-runtime, react/jsx-dev-runtime
  if (/^react-dom($|\/)/.test(id)) return true; // react-dom, react-dom/client, react-dom/server
  if (/^scheduler($|\/)/.test(id)) return true; // scheduler (peer of react-dom)
  if (id === "object-assign") return true; // tiny dep used by React

  // your monorepo packages – keep them external for ESM/CJS
  if (INTERNAL_PKG.some((p) => id === p || id.startsWith(p + "/"))) return true;

  return false;
};
