import { projectsRouter } from "@/modules/pojects/servers/procedures";
import { createTRPCRouter } from "../init";
import { messageRouter } from "@/modules/messages/servers/procedures";
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectsRouter,
});
export type AppRouter = typeof appRouter;
