"use client";

import Image from "next/image";
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
      <Link
        href="/login"
        className="ma-account-menu-trigger"
        aria-label="Sign in"
        title="Sign in"
      >
        <Image
          src="/users/default-avatar.jpg"
          alt=""
          className="ma-account-menu-avatar"
          width={36}
          height={36}
        />
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
