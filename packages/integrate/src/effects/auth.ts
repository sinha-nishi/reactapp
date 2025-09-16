// effects/guardedNav.ts
import { effects } from ".";
import { Command } from "../types";

const isAuthed = () => false;

effects.onEvery("navigate", async (cmd: Command, ctx) => {
  if (cmd.target === "/admin" && !isAuthed()) {
    // show loader briefly
    await ctx.delay(150);
    await ctx.send({ type: "replace", target: "/login", meta: { reason: "auth" } });
  }
});
