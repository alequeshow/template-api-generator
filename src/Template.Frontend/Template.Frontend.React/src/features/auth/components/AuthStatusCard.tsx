"use client";

import { useSessionQuery } from "@/features/auth/hooks/useSession";

export function AuthStatusCard() {
  const sessionQuery = useSessionQuery();

  if (sessionQuery.isLoading) {
    return <p>Loading session...</p>;
  }

  if (sessionQuery.data?.state !== "authenticated" || !sessionQuery.data.user) {
    return <p>You are not authenticated.</p>;
  }

  return (
    <div className="sa-card">
      <p className="sa-card-label">User</p>
      <p className="sa-card-value">
        {sessionQuery.data.user.firstName} {sessionQuery.data.user.lastName}
      </p>
      <p>{sessionQuery.data.user.email}</p>
    </div>
  );
}
