import { StatusListTable } from "@/features/status/components/StatusListTable";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function StatusPage() {
  return (
    <AppShell>
      <PageContainer title="Status" subtitle="Manage status entries migrated from Blazor pages">
        <StatusListTable />
      </PageContainer>
    </AppShell>
  );
}
