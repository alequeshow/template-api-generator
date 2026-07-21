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
        <div className="sa-login-brand">
          <h1>Template.Frontend.React</h1>
          <p>Sign in with your account credentials to continue.</p>
        </div>
        <LoginForm returnTo={returnTo} />
      </section>
    </main>
  );
}
