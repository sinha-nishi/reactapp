import postcss from "postcss";
import type { Message } from "postcss";
import { postcssPkv, type Extracted, type PkvOptions } from "./postcss";

interface PkvMessage extends Message {
  type: "kitsy";
  out?: Extracted;
}

export async function parsePkvCss(
  css: string,
  options?: PkvOptions,
): Promise<Extracted> {
  const result = await postcss([postcssPkv(options)]).process(css, {
    from: undefined,
  });
  // const msg = result.messages.find(
  //   (m: Message): m is PkvMessage => m.type === "kitsy" && !!m.out,
  // );
  // return (msg?.out || { tokens: {}, rules: [] }) as Extracted;
  const msg = result.messages.find(
    (m: Message): m is PkvMessage => m.type === "kitsy" && !!m.out,
  );
  const out = (msg?.out || { tokens: {}, rules: [] }) as any;
  out.diagnostics = msg?.diagnostics || [];
  return out as Extracted & { diagnostics?: any[] };
}
