import { Timeline, type TimelineItemData } from "@/shared/ui/Timeline";

const experienceItems: TimelineItemData[] = [
  {
    id: "exp-senior-engineer",
    badge: { content: "🚀", variant: "primary", size: "lg" },
    title: "Senior Software Engineer",
    subtitle: "Contoso Digital · Remote",
    meta: "Mar 2023 — Present",
    description:
      "Lead the migration of the SmartAdmin-based frontend to a Next.js/React application, " +
      "introducing a typed shared UI library, a BFF authentication layer, and reusable dashboard " +
      "chart components. Mentor two engineers and drive accessibility and visual-parity reviews " +
      "for every migrated screen.",
    collapsedLines: 3,
  },
  {
    id: "exp-fullstack-engineer",
    badge: { content: "🛠️", variant: "info", size: "lg" },
    title: "Full-Stack Engineer",
    subtitle: "Fabrikam Systems · Porto Alegre, Brazil",
    meta: "Jan 2020 — Feb 2023",
    description:
      "Built and maintained a MongoDB-backed API generator platform, delivering CRUD endpoints, " +
      "CQRS command/query handlers, and JWT-based authentication for multiple generated solutions.",
    collapsedLines: 3,
  },
  {
    id: "exp-graduation",
    badge: { content: "🎓", variant: "success", size: "lg" },
    title: "B.Sc. in Computer Science",
    subtitle: "Universidade Federal",
    meta: "2015 — 2019",
    description: "Coursework focused on distributed systems, databases, and software architecture.",
    expandable: false,
  },
];

const activityItems: TimelineItemData[] = [
  {
    id: "activity-release",
    badge: { content: "✅", variant: "success", size: "sm" },
    children: <p>Shipped the shared Timeline component to the design system.</p>,
  },
  {
    id: "activity-review",
    badge: { content: "👀", variant: "warning", size: "sm" },
    children: <p>Requested review on the dashboard chart accessibility pass.</p>,
  },
];

/**
 * Demonstrates the Timeline component with two usage styles:
 * a LinkedIn-experience-like structured layout (alternating sides), and a
 * simple freeform activity feed (single-side layout).
 */
export function ActivityTimeline() {
  return (
    <div className="sa-dashboard-timeline-grid">
      <div>
        <h4 className="sa-timeline-showcase-heading">Experience</h4>
        <Timeline items={experienceItems} layout="left" />
      </div>
      <div>
        <h4 className="sa-timeline-showcase-heading">Recent activity</h4>
        <Timeline items={activityItems} layout="right" />
      </div>
    </div>
  );
}
