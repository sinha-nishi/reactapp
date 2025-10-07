export type Dict<T = unknown> = Record<string, T>;

export type LocationState = {
  path: string;
  query: Dict<string>;
  hash: string | null;
};

export type CommandType =
  | "navigate"     // { target: string }
  | "replace"      // { target: string }
  | "back"         // {}
  | "forward"      // {}
  | "open"         // { target: URN }
  | "close"        // { target: URN }
  | "toggle"       // { target: URN }
  | "broadcast";   // { topic: string, payload?: any }

export type Command = {
  type: CommandType;
  target?: string;      // path or URN depending on type
  payload?: any;
  meta?: Dict;          // correlationId, source, ts, etc.
};

export type MiddlewareNext = (cmd: Command) => Promise<void> | void;
export type Middleware = (cmd: Command, next: MiddlewareNext) => Promise<void> | void;
export type Listener = (cmd: Command) => void;
export type Unsubscribe = () => void;
