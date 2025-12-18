import { TailwindCompatOptions } from "../plugins/compat/tailwind";

export type Tokens = Record<string, string>;

export type LayerOptions = {
  settings?: boolean | Partial<Record<string, string>>;
  tools?: boolean | Partial<Record<string, string>>;
  generic?: boolean | Partial<Record<string, string>>;
  elemets?: boolean | Partial<Record<string, string>>;
  objects?: boolean | Partial<Record<string, string>>;
  components?: boolean | Partial<Record<string, string>>;
  utilites?: boolean | Partial<Record<string, string>>;
};

export type BuilderOptions = {
  prefix?: string;
  layers?: LayerOptions;
  tokens?: Tokens;
  utilities?: { spacingScale?: number[] };
  compat?: {
    tailwind?: TailwindCompatOptions;
  };
};
