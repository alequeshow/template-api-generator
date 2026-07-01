"use client";

import { useMemo } from "react";

import { useSessionQuery } from "@/features/auth/hooks/useSession";
import { useStatusListQuery } from "@/features/status/hooks/useStatus";
import { StatCard } from "@/shared/ui/StatCard";

export function DashboardOverview() {
  const sessionQuery = useSessionQuery();
  const statusListQuery = useStatusListQuery();

  const cards = useMemo(
    () => [
      { label: "Session state", value: sessionQuery.data?.state ?? "loading" },
      { label: "Current user", value: sessionQuery.data?.user?.userId ?? "anonymous" },
      { label: "Status entries", value: String(statusListQuery.data?.length ?? 0) },
      {
        label: "Status data source",
        value: statusListQuery.isError ? "error" : "backend",
      },
    ],
    [sessionQuery.data?.state, sessionQuery.data?.user?.userId, statusListQuery.data?.length, statusListQuery.isError],
  );

  return (
    <div className="sa-grid">
      {cards.map((card) => (
        <StatCard key={card.label} label={card.label} value={card.value} />
      ))}
    </div>
  );
}
