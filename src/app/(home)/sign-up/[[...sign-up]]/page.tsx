"use client";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Page = () => {
  const curTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto h-full w-full">
      <section className="space-y-5 pt-[16vh] 2xl:py-28">
        <div className="flex flex-col items-center">
          <SignUp
            appearance={{
              baseTheme: curTheme === "dark" ? dark : undefined,
              elements: {
                cardBox: "border! rounded-lg",
              },
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Page;
