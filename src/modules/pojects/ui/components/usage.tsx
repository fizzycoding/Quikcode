import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface Props {
  points: number;
  msBeforeNext: number;
}

const Usage = ({ msBeforeNext, points }: Props) => {
  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const resetTime: string = useMemo((): string => {
    try {
      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(Date.now() + msBeforeNext),
        }),
        { format: ["months", "days", "hours"] }
      );
    } catch (error) {
      console.error("Error formating ", error);
      return "Unknow";
    }
  }, [msBeforeNext]);

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {!hasPro && "free"} credits remaining
          </p>
          <p className="text-sm text-muted-foreground">Resets in {resetTime}</p>
        </div>
        {!hasPro && (
          <Button asChild variant={"tertiary"} size={"sm"} className="ml-auto">
            <Link href={"/pricing"}>
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Usage;
