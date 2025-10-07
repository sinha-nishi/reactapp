import { effects } from ".";

effects.onDebounce(
  "navigate",
  async (cmd, ctx) => {
    // const loc = ctx.getLocation(); // it should not be depdendent on navigation store
    const loc = { path: "/somepath" }; // should be configured
    // send pageview
    // analytics.track("page_view", { path: loc.path, query: loc.query });
  },
  300 // ms
);