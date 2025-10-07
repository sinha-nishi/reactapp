import { answer, ask } from ".";

export async function runAsyncFetchOnChannel(id: string) {
    // somewhere (provider side)
    const off = answer<{ id: string }, { title: string }>("blogs:get", async ({ id }) => {
    // fetch from cache/db
        return { title: "Hello " + id };
    });

    // somewhere else (consumer side)
    return ask<{ id: string }, { title: string }>("blogs:get", { id: "chat-gpt" });
    // res.title === "Hello chat-gpt"
}
