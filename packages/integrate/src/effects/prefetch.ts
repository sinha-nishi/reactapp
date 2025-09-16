// effects/blogPrefetch.ts
import { effects } from ".";
import { matchPath } from "./matcher";
import { Command } from "../types";
import { requestCache } from "../cache/requestCache";

async function fetchData(id: string) {
  // ... your API call

  return Promise.resolve({ id, title: "Blog " + id, content: "This is blog content." });
}


export function enablePrefetch(path: string) {
  effects.onLatest("navigate", async (cmd: Command, ctx) => {
    // const loc = ctx.getLocation();
    const loc = { path: "/blogs/:blogId" }; // should be configured
    const m = matchPath(path, loc.path);
    if (!m) return;

    const controller = new AbortController();
    ctx.signal.addEventListener("abort", () => controller.abort());

    const data = await fetchData(m.blogId);
    if (ctx.aborted()) return;

    // Update some app state via command bus (or your state system)
    await ctx.send({
      type: "broadcast",
      payload: { topic: "blogs/prefetched", blogId: m.blogId, data },
    });
  });
}

function enablePrefetchWithCaching(path: string) {
async function apiFetchBlog(id: string, signal: AbortSignal) {
  // Example fetch; ensure it uses the signal
  const res = await fetch(`/api/blogs/${id}`, { signal });
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  }

  // latest by blogId (meta.key), cancel prior + use cache
  effects.onEvery("navigate", async (cmd: Command, ctx) => {
    // const loc = ctx.getLocation();
    const m = matchPath("/blogs/:blogId", path);
    if (!m) return;

    const key = `blog:${m.blogId}`;

    try {
      const data = await requestCache.fetch(key, (signal) => apiFetchBlog(m.blogId, signal), 30_000);
      if (ctx.aborted()) return;

      await ctx.send({
        type: "broadcast",
        payload: { topic: "blogs/prefetched", data: { id: m.blogId, data } },
        meta: { key },
      });
    } catch (e) {
      if (ctx.aborted()) return; // ignore cancels
      await ctx.send({
        type: "broadcast",
        payload: { topic: "toast", message: `Failed to load blog ${m.blogId}` },
        meta: { key, error: String(e) },
      });
    }
  });

}