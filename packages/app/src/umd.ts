export * from './index';

// ---- Auto-render from URL (?render=base64[&root=appId][&strict=1]) ----
(function autoRenderFromQuery(global: any) {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("render");
    if (!encoded) return;

    const rootId = params.get("root") || "app";
    const strict = params.get("strict") === "1";

    // support base64url too (-,_)
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===".slice((normalized.length + 3) % 4);

    // decode UTF-8 safely
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const json = new TextDecoder("utf-8").decode(bytes);

    const appConfig = JSON.parse(json);

    // Your normal render
    if (global.ReactApp && typeof global.ReactApp.render === "function") {
      global.ReactApp.render(appConfig, rootId, strict);
    // } else if (typeof render === "function") {
    //   // if tree-shaking in ESM kept it local
    //   render(appConfig, rootId, strict);
    } else {
      console.error("[ReactApp] render() not found on window or module.");
    }
  } catch (err) {
    console.error("[ReactApp] Failed to auto-render from ?render=", err);
  }
})(typeof window !== "undefined" ? (window as any) : {});