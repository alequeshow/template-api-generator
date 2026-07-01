import { StatusEditCard } from "@/features/status/components/StatusEditCard";
import { AppShell } from "@/modules/smartadmin/components/AppShell";
import { PageContainer } from "@/modules/smartadmin/components/PageContainer";

export default function StatusEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <AppShell>
      <PageContainer title="Edit Status" subtitle="Update an existing status entry">
        <StatusEditCard id={id} />
      </PageContainer>
    </AppShell>
  );
}
