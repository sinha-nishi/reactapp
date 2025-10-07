import { render, type ApplicationConfiguration } from "@pkvsinha/react-app";

interface ReactAppState {
  app: ApplicationConfiguration; // Replace 'unknown' with the actual type if known
}

const state = (window as { __REACT_APP_STATE__?: ReactAppState }).__REACT_APP_STATE__;
render(state?.app);
