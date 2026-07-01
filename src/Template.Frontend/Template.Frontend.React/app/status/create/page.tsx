import { StatusCreateCard } from "@/features/status/components/StatusCreateCard";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function StatusCreatePage() {
  return (
    <AppShell>
      <PageContainer title="Create Status" subtitle="Create a new status entry">
        <StatusCreateCard />
      </PageContainer>
    </AppShell>
  );
}
