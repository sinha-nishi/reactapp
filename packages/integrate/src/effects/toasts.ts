// effects/toasts.ts
import { effects } from ".";

effects.onThrottle(
  "broadcast",
  async (cmd, ctx) => {
    if (cmd.payload?.topic === "toast") {
      // show toast once every 2s per message key
      // toast(cmd.payload.message)
    }
  },
  2000,
  (cmd) => String(cmd.payload?.message ?? "_")
);
