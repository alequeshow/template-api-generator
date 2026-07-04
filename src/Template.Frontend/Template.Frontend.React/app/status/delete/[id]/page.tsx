import { StatusDeleteCard } from "@/features/status/components/StatusDeleteCard";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function StatusDeletePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <AppShell>
      <PageContainer
        title="Delete Status"
        subtitle="Delete a status entry"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Status", href: "/status" }, { label: "Delete" }]}
      >
        <StatusDeleteCard id={id} />
      </PageContainer>
    </AppShell>
  );
}
