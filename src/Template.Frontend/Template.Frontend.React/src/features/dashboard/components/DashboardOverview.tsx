import { StatCard } from "@/shared/ui/StatCard";

const cards = [
  { label: "Total sessions", value: "128" },
  { label: "Successful auth", value: "97%" },
  { label: "Pending widgets", value: "14" },
  { label: "jQuery replacements", value: "5/17" },
] as const;

export function DashboardOverview() {
  return (
    <div className="sa-grid">
      {cards.map((card) => (
        <StatCard key={card.label} label={card.label} value={card.value} />
      ))}
    </div>
  );
}
