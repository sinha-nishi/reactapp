export type LayerOptions = {
  settings?: boolean | Partial<Record<string, string>>;
  tools?: boolean | Partial<Record<string, string>>;
  generic?: boolean | Partial<Record<string, string>>;
  elemets?: boolean | Partial<Record<string, string>>;
  objects?: boolean | Partial<Record<string, string>>;
  components?: boolean | Partial<Record<string, string>>;
  utilites?: boolean | Partial<Record<string, string>>;
}

export type StyleOptions = {
  prefix?: string;
  layers?: LayerOptions;
  tokens?: Partial<Record<string, string>>;
  utilities?: { spacingScale?: number[] };
};
