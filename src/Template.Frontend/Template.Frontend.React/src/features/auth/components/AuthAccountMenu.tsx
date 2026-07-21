"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { UserAccountMenu } from "@/modules/smartadmin/components/UserAccountMenu";
import { useLogoutMutation, useSessionQuery } from "@/features/auth/hooks/useSession";

export function AuthAccountMenu() {
  const router = useRouter();
  const sessionQuery = useSessionQuery();
  const logoutMutation = useLogoutMutation();

  if (sessionQuery.data?.state !== "authenticated" || !sessionQuery.data.user) {
    return (
      <Link className="sa-button sa-button-ghost" href="/login">
        Sign in
      </Link>
    );
  }

  return (
    <UserAccountMenu
      user={sessionQuery.data.user}
      isSigningOut={logoutMutation.isPending}
      onSignOut={async () => {
        await logoutMutation.mutateAsync();
        router.push("/login");
        router.refresh();
      }}
    />
  );
}
