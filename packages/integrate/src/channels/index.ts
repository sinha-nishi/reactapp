// channels/channels.ts
import { bus } from "../EventBus";
import { Command } from "../types";

type Unsubscribe = () => void;
type Listener<T = any> = (data: T) => void;

export function publish<T = any>(topic: string, data: T): Promise<void> {
  return bus.send({ type: "broadcast", payload: { topic, data } });
}

export function subscribe<T = any>(topic: string, listener: Listener<T>): Unsubscribe {
  return bus.subscribe((cmd: Command) => {
    if (cmd.type !== "broadcast") return;
    const { topic: t, data } = cmd.payload ?? {};
    if (t === topic) listener(data as T);
  });
}

// Optional "ask/answer" pattern (request/response over broadcast)
export function ask<TReq = any, TRes = any>(topic: string, req: TReq, timeoutMs = 5000): Promise<TRes> {
  const correlationId = `${topic}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const replyTopic = `${topic}:reply:${correlationId}`;

  return new Promise<TRes>((resolve, reject) => {
    const timer = setTimeout(() => {
      off();
      reject(new Error(`ask timeout for ${topic}`));
    }, timeoutMs);

    const off = subscribe<TRes>(replyTopic, (res) => {
      clearTimeout(timer);
      off();
      resolve(res);
    });

    publish(topic, { correlationId, replyTopic, payload: req });
  });
}

export function answer<TReq = any, TRes = any>(
  topic: string,
  handler: (req: TReq) => Promise<TRes> | TRes
): Unsubscribe {
  return subscribe<any>(topic, async (msg) => {
    const { correlationId, replyTopic, payload } = msg ?? {};
    try {
      const res = await handler(payload as TReq);
      await publish<TRes>(replyTopic, res);
    } catch (e) {
      await publish(replyTopic, { error: String(e) } as unknown as TRes);
    }
  });
}
