import * as React from "react";
import type { AppConfig } from "../@types";
import { ReactApplication } from "../ReactApplication";
import { compile } from "../utils/compile";
import { routes } from "../utils/routes";

export function sc(config: AppConfig = {}): React.JSX.Element {
  const { views, home, contextPath, init } = compile(config);
    const element = (
      <ReactApplication init={init} routes={routes(views, contextPath, home)} />
    );

    return element;
}