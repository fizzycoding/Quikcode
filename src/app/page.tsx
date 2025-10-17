"use client";

import { useState } from "react";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
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
        disabled={createProject.isPending}
        onClick={() => createProject.mutate({ value: value })}
      >
        Invoke Job
      </Button>
    </div>
  );
};

export default page;
