import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageContainer title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
        <DashboardOverview />
      </PageContainer>
    </AppShell>
  );
}
