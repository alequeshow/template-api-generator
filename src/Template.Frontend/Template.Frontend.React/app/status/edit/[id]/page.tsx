import { StatusEditCard } from "@/features/status/components/StatusEditCard";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default async function StatusEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <PageContainer
        title="Edit Status"
        subtitle="Update an existing status entry"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Status", href: "/status" }, { label: "Edit" }]}
      >
        <StatusEditCard id={id} />
      </PageContainer>
    </AppShell>
  );
}
