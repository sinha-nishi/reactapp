export type Command = { type: string; target?: string; payload?: any };

export type Middleware = (
  cmd: Command,
  next: (cmd: Command) => void
) => void;