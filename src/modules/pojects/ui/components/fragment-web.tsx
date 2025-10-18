import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";

import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";

interface FragmentWebProps {
  data: Fragment;
}

const FragmentWeb = ({ data }: FragmentWebProps) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const onRefresh = () => {
    setFragmentKey((p) => p + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b flex items-center gap-x-2 bg-sidebar">
        <Hint text="Refresh" align="start" side="bottom">
          <Button size={"sm"} variant={"outline"} onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>

        <Hint text="Click to copy" align="start" side="bottom">
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={handleCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in a new tab" side="bottom" align="start">
          <Button
            size={"sm"}
            variant={"outline"}
            disabled={!data.sandboxUrl}
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        sandbox="allow-forms allow-scripts allow-same-origin"
        src={data.sandboxUrl}
        loading="lazy"
        className="h-full w-full"
      ></iframe>
    </div>
  );
};
export default FragmentWeb;
