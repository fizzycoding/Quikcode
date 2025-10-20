"use client";

import { MessageSquareWarningIcon } from "lucide-react";

const MessageErrorFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-6 bg-background text-center">
      <MessageSquareWarningIcon
        height={40}
        width={40}
        className="text-destructive dark:text-red-400"
      />
      <span className="text-2xl font-bold text-destructive dark:text-red-400">
        Something went wrong
      </span>
      <p className="text-sm text-muted-foreground">
        Unable to load messages. Please check your connection or try again.
      </p>
    </div>
  );
};

export default MessageErrorFallback;
