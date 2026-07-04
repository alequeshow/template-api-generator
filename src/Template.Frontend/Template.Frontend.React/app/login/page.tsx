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
        <div className="sa-login-brand">
          <h1>Temple SmartAdmin</h1>
          <p>Sign in with your account credentials to continue.</p>
        </div>
        <LoginForm returnTo={returnTo} />
      </section>
    </main>
  );
}
