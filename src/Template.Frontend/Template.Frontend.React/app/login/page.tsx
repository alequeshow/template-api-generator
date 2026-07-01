import { LoginForm } from "@/features/auth/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;

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
