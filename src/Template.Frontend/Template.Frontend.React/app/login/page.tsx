import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { returnTo?: string };
}) {
  const { returnTo } = searchParams;

  return (
    <main className="sa-login-page">
      <section className="sa-login-card">
        <h1>Sign in</h1>
        <p>Use your existing backend credentials to continue.</p>
        <LoginForm returnTo={returnTo} />
      </section>
    </main>
  );
}
