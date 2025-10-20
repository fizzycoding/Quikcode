"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";

const ProjectNotFoundErrorFallback = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-6 gap-4 bg-background text-center">
      <AlertCircleIcon
        height={50}
        width={50}
        className="text-destructive dark:text-red-400"
      />
      <span className="text-4xl font-bold text-destructive dark:text-red-400">
        Project Not Found
      </span>
      <p className="text-sm text-muted-foreground max-w-xs">
        The project you are looking for does not exist or may have been deleted.
      </p>
      <Button
        onClick={() => {
          router.push("/");
        }}
        variant="outline"
      >
        <ArrowLeftIcon />
        Go Back to Dashboard
      </Button>
    </div>
  );
};

export default ProjectNotFoundErrorFallback;
