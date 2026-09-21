import { HomeOverview } from "@/features/home/components/HomeOverview";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function HomePage() {
  return (
    <AppShell>
      <PageContainer
        title="Platform Overview"
        subtitle="Explore the platform capabilities — sign in to access the interactive workspace"
        breadcrumbs={[{ label: "Home" }]}
      >
        <HomeOverview />
      </PageContainer>
    </AppShell>
  );
}
