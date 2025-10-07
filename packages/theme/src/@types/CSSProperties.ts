type CSSPropertiesBase = {
  // Standard CSS Properties
  alignContent: string;
  alignItems: string;
  alignSelf: string;
  animation: string;
  background: string;
  border: string;
  boxShadow: string;
  color: string;
  display: string;
  fontSize: string;
  height: string;
  margin: string;
  padding: string;
  width: string;
  // Add more properties as needed
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type CSSProperties = Partial<CSSPropertiesBase>;
