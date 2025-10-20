import { projectsRouter } from "@/modules/pojects/servers/procedures";
import { createTRPCRouter } from "../init";
import { messageRouter } from "@/modules/messages/servers/procedures";
import { usageRouter } from "@/modules/usage/server/procedure";
export const appRouter = createTRPCRouter({
  usage: usageRouter,
  messages: messageRouter,
  projects: projectsRouter,
});
export type AppRouter = typeof appRouter;
