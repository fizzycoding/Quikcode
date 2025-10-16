import { createTRPCRouter } from "../init";
import { messageRouter } from "@/modules/messages/servers/procedures";
export const appRouter = createTRPCRouter({
  messages: messageRouter,
});
export type AppRouter = typeof appRouter;
