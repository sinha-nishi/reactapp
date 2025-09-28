import { SimpleConfig } from "../config/SimpleConfig";
import { ApplicationConfiguration } from "./ApplicationConfiguration";

export type AppConfig =
  | Partial<ApplicationConfiguration>
  | Partial<SimpleConfig>
  | undefined;