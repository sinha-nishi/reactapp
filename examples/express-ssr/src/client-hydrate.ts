// import { attachBrowserAdapter } from "@pkvsinha/react-app/adapters/browser"; // if exported
import { render } from "@pkvsinha/react-app";

export function hydrateClient() {
  const state = (window as any).__REACT_APP_STATE__;
  // if you expose attachBrowserAdapter() separately, call it before render
  // attachBrowserAdapter(); // optional if your render does it inside
  render(state.app);
}
