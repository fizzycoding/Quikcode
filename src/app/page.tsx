"use client";

import { useState } from "react";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const page = () => {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
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
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ text: value })}
      >
        Invoke Job
      </Button>
    </div>
  );
};

export default page;
