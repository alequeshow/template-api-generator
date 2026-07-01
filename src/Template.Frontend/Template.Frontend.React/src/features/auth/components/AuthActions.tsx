"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLogoutMutation, useSessionQuery } from "@/features/auth/hooks/useSession";

export function AuthActions() {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const logoutMutation = useLogoutMutation();

  if (sessionQuery.data?.state !== "authenticated") {
    return (
      <Link className="sa-button sa-button-ghost" href="/login">
        Sign in
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="sa-button sa-button-ghost"
      disabled={logoutMutation.isPending}
      onClick={async () => {
        await logoutMutation.mutateAsync();
        router.push("/login");
        router.refresh();
      }}
    >
      {logoutMutation.isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
