import { AuthStatusCard } from "@/features/auth/components/AuthStatusCard";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function AuthPage() {
  return (
    <AppShell>
      <PageContainer title="Authentication" subtitle="Current authenticated user context">
        <AuthStatusCard />
      </PageContainer>
    </AppShell>
  );
}
