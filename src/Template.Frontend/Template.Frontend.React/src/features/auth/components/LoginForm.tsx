"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useLoginMutation } from "@/features/auth/hooks/useSession";
import { loginFormSchema, type LoginFormValues } from "@/features/auth/loginFormSchema";
import { AlertMessage } from "@/shared/ui/AlertMessage";

type LoginFormProps = {
  returnTo?: string;
};

export function LoginForm({ returnTo }: LoginFormProps) {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string>();

  const safeReturnPath = useMemo(() => {
    if (!returnTo || !returnTo.startsWith("/")) {
      return "/";
    }

    return returnTo;
  }, [returnTo]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userIdentifier: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(undefined);

    try {
      await loginMutation.mutateAsync(values);
      router.push(safeReturnPath);
      router.refresh();
    } catch {
      setErrorMessage("Invalid credentials or session could not be created.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="sa-form" noValidate>
      <AlertMessage message={errorMessage} type="error" />

      <div className="sa-field">
        <label htmlFor="userIdentifier">User identifier</label>
        <input id="userIdentifier" type="text" {...form.register("userIdentifier")} />
        {form.formState.errors.userIdentifier ? (
          <small className="sa-field-error">{form.formState.errors.userIdentifier.message}</small>
        ) : null}
      </div>

      <div className="sa-field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <small className="sa-field-error">{form.formState.errors.password.message}</small>
        ) : null}
      </div>

      <button type="submit" className="sa-button" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
