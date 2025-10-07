import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStringSSR } from "@pkvsinha/react-app/server"; // <-- your server entry

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use("/assets", express.static(path.join(__dirname, "../dist")));

app.get("*", async (req, res) => {
  const appConfig = JSON.parse(await fs.readFile(path.join(__dirname, "app.config.json"), "utf8"));

  const { html, head, dehydrated } = await renderToStringSSR(appConfig, req.url, {
    strictValidation: false,
    // prefetch: async (bus, url) => { /* optional: fire generic fetch commands */ },
    // collectHead: () => "",
    // collectDehydrated: () => null
  });

  const doc = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <link rel="stylesheet" href="/assets/tailwind.css">
      <title>@pkvsinha/react-app • Express SSR</title>
    </head>
    <body>
      <div id="app">${html}</div>
      <script>window.__REACT_APP_STATE__=${safeJSON({ app: appConfig, dehydrated })}</script>
      <script src="/assets/react-app.standalone.min.js"></script>
      <script>
        const { render } = window.ReactApp;
        const state = window.__REACT_APP_STATE__;
        render(state.app, "app", false);
      </script>
    </body>
  </html>`;

  res.status(200).send(doc);
});

app.listen(7845, () => console.log("http://localhost:7845"));

function safeJSON(x: any) {
  return JSON.stringify(x).replace(/</g, "\\u003c").replace(/-->/g, "--\\>");
}
