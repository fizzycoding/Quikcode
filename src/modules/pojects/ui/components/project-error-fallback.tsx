"use client";

import { CircleXIcon, MessageSquareWarningIcon } from "lucide-react";
import Image from "next/image";

const ProjectErrorFallback = () => {
  return (
    <div className="flex items-center gap-2  p-4 bg-background ">
      <CircleXIcon
        height={15}
        width={15}
        className="text-destructive dark:text-red-400"
      />
      <span className="text-sm  text-destructive dark:text-red-400">
        Failed to load projects
      </span>
    </div>
  );
};

export default ProjectErrorFallback;
