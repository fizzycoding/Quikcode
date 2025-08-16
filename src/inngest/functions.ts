import { openai, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("quikcode-nextjs-test2");
      return sandbox.sandboxId;
    });
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

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });
    return { output, sandboxUrl };
  }
);
