"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { createQueryClient } from "@/shared/api/queryClient";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
