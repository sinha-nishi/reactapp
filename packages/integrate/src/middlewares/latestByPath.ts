// middlewares/latestByPath.ts
import { Command } from "@/types";
import { bus } from "../EventBus";
// import { navigationStore } from "../navigation/navigationStore";

export function enableLatestByPath(path: string) {
    bus.useFor("navigate", (cmd: Command, next: (cmd: Command) => void) => {
        // attach a stability key (e.g., route pattern param)
        // In practice, compute from the target string if present, else from current location
        const target = cmd.target ?? (path || "/");
        const blogId = target.match(/^\/blogs\/([^/?#]+)/)?.[1];
        const key = blogId ? `blog:${blogId}` : "_";
        next({ ...cmd, meta: { ...(cmd.meta || {}), key } });
    });
}