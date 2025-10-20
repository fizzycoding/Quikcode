"use client";
import Image from "next/image";

const MessageLoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3 p-6 bg-background">
      <Image alt="quikcode" src={"/logo.svg"} height={40} width={40} />
      <span className="text-sm font-semibold text-primary dark:text-white">
        Loading Chats...
      </span>
    </div>
  );
};

export default MessageLoadingFallback;
