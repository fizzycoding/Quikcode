"use client";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const page = () => {
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("BG Job staarted");
      },
    })
  );
  return (
    <div>
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ text: "Ajju" })}
      >
        Invoke Job
      </Button>
    </div>
  );
};

export default page;
