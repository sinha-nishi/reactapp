import { CssBuilder, BuilderPlugin } from "@pkvsinha/react-theme";

export const basePlugin = (): BuilderPlugin => (b: CssBuilder) => {
  // 04-elements
  b.layer(
    "elements",
    `html,body{margin:0;padding:0;font-family:var(--pkv-font-sans)}`,
    "el-base",
  );
  b.layer("elements", `a{color:inherit;text-decoration:none}`, "el-a");
  b.layer(
    "elements",
    `button{cursor:pointer;border:0;background:none}`,
    "el-button",
  );
};

export function createBaseBuilder(existing?: CssBuilder) {
  const b = existing ?? new CssBuilder({ prefix: "pkv" });
  return b.use(basePlugin());
}
