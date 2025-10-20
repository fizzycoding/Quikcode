"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background p-6 gap-6 text-center">
      <AlertCircle className="w-20 h-20 text-destructive animate-pulse" />
      <h1 className="text-3xl font-bold text-destructive">
        Oops! Something went wrong
      </h1>
      <p className="text-muted-foreground max-w-md">
        A global error occurred. Please try refreshing the page, or navigate
        back to a dashboard.
      </p>
      <div className="flex gap-4 mt-4">
        <Button
          onClick={() => location.reload()}
          size={"sm"}
          variant={"default"}
        >
          Retry
        </Button>
        <Button
          onClick={() => router.push("/")}
          size={"sm"}
          variant={"outline"}
        >
          Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
