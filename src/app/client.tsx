"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

const Client = () => {
  const trcp = useTRPC();
  const { data } = useSuspenseQuery(
    trcp.kirito.queryOptions({ text: "Hello Server" })
  );
  return <div>{JSON.stringify(data)}</div>;
};

export default Client;
