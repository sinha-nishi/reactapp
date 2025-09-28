import * as React from "react";
import { ApplicationConfiguration } from "../@types";
import { ReactApplication } from "../ReactApplication";
import { compile } from "../utils/compile";
import { routes } from "../utils/routes";
import { AppConfig } from "../utils/prepareApp";

export function sc(config: AppConfig = {}): React.JSX.Element {
  const { views, home, contextPath, init } = compile(config);
    const element = (
      <ReactApplication init={init} routes={routes(views, contextPath, home)} />
    );

    return element;
}