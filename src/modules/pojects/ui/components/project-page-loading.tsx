"use client";
import { Loader } from "lucide-react";

const ProjectPageLoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-3 p-4 bg-background">
      <Loader className="w-12 h-12 text-primary animate-spin" />
      <span className="text-lg font-semibold dark:text-white">
        Loading project...
      </span>
    </div>
  );
};

export default ProjectPageLoadingFallback;
