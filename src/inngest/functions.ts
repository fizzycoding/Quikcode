import { openai, createAgent } from "@inngest/agent-kit";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const summarizer = createAgent({
      name: "summarizer",
      system:
        "You are an expert next.js developer. you write redable, maintainable code you write simple next.js & react snippets",
      model: openai({
        model: "provider-6/gpt-4o",
        baseUrl: "https://api.a4f.co/v1",
      }),
    });
    const { output } = await summarizer.run(
      `Write the following snipit: ${event.data.value}`
    );
    console.log(output);

    return { success: "Ok", output };
  }
);
