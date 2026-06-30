type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="sa-card">
      <div className="sa-card-label">{label}</div>
      <div className="sa-card-value">{value}</div>
    </article>
  );
}
