import { renderToStringSSR } from "@pkvsinha/react-app/server";
import appConfig from './assets/app.config.json';
import type { ApplicationConfiguration } from "@pkvsinha/react-app";

export async function render(url: string) {
  const { html, head, dehydrated } = await renderToStringSSR(appConfig as unknown as ApplicationConfiguration, url);

  const doc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  ${head ?? ""}
  <link rel="stylesheet" href="/tailwind.css" />
  <title>@pkvsinha/react-app • Vite SSR</title>
</head>
<body>
  <div id="app">${html}</div>
  <script>window.__REACT_APP_STATE__=${JSON.stringify({ app: appConfig, dehydrated }).replace(/</g,"\\u003c")}</script>
  <script type="module" src="/src/entry-client.tsx"></script>
</body>
</html>`;
  return { html: doc };
}
