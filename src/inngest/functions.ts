import {
  openai,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/promt";
import { prisma } from "@/lib/db";
import { SANDBOX_TIMEOUT } from "./consts";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

const parseAgentOP = (value: Message[]): string => {
  if (value[0].type !== "text") {
    return "Fragment";
  }

  if (Array.isArray(value[0].content)) {
    return value[0].content.map((t) => t).join("");
  } else {
    return value[0].content;
  }
};

export const quikcode = inngest.createFunction(
  { id: "quikcode-agent" },
  { event: "quikcode-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("quikcode-nextjs-test2");
      await sandbox.setTimeout(SANDBOX_TIMEOUT);
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      { summary: "", files: {} },
      { messages: previousMessages }
    );

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "Senior coding agent",
      system: PROMPT,
      model: openai({
        model: "openai/gpt-4o-mini",
        baseUrl: "https://openrouter.ai/api/v1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffer = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffer.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffer.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.error(
                  `Command failed: ${error} \n stdout: ${buffer.stdout} \n stderror: ${buffer.stderr}`
                );
                return `Command failed: ${error} \nstdout: ${buffer.stdout} \nstderror: ${buffer.stderr}`;
              }
            });
          },
        }),

        createTool({
          name: "createOrUpdateFiles",
          description: `Use createOrUpdateFiles. Send JSON like: { "files": [ { "path": "app/page.tsx", "content": "\"use client\";\n<file content>" } ] } Do NOT use arrays of arrays.`,
          parameters: z.object({
            files: z
              .array(
                z.object({
                  path: z
                    .string()
                    .describe("The full file path, e.g., 'app/page.tsx'"),
                  content: z
                    .string()
                    .describe("The full file content as a string"),
                })
              )
              .describe("List of files to create or update"),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  const fileArray = Array.isArray(files) ? files : [files];

                  for (const file of fileArray) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  return "Error: " + error;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        createTool({
          name: "readFiles",
          description:
            'Read one or more files from the sandbox. Use JSON like { "files": ["app/page.tsx", "package.json"] }.',
          parameters: z.object({
            files: z.array(z.string()).describe("List of file paths to read"),
          }),

          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const fileArray = Array.isArray(files) ? files : [files];

                const contents = [];
                for (const file of fileArray) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return "Error: " + error;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);
          console.log("Response Hit : ", lastAssistantMessageText);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      defaultState: state,
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: "openai/gpt-4.1-nano",
        baseUrl: "https://openrouter.ai/api/v1",
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "Response generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: "openai/gpt-4.1-nano",
        baseUrl: "https://openrouter.ai/api/v1",
      }),
    });

    const { output: fragmentTitleOP } = await fragmentTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOP } = await responseGenerator.run(
      result.state.data.summary
    );

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOP(responseOP),
          role: "ASSISTANT",
          type: "RESULT",
          Fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOP(fragmentTitleOP),
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragmet",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
