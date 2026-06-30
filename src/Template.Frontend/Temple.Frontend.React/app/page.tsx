import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function Home() {
  return (
    <AppShell>
      <PageContainer
        title="Dashboard"
        subtitle="SmartAdmin shell foundation with reusable cards and navigation"
      >
        <DashboardOverview />
      </PageContainer>
    </AppShell>
  );
}
