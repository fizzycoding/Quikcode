"use client";

import { useState } from "react";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const page = () => {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("BG Job staarted");
      },
    })
  );
  return (
    <div className="">
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Button
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value: value })}
      >
        Invoke Job
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
};

export default page;
