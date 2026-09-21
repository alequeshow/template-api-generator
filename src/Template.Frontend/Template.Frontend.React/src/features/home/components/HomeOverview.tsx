"use client";

import Link from "next/link";

import { experienceItems } from "@/features/dashboard/components/ActivityTimeline";
import { Timeline } from "@/shared/ui/Timeline";

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="sa-home-feature-card">
      <span className="sa-home-feature-icon" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="sa-home-feature-title">{title}</h3>
      <p className="sa-home-feature-description">{description}</p>
    </div>
  );
}

/**
 * Public landing page overview.
 *
 * Presents the platform capabilities to unauthenticated visitors and
 * re-uses the same experience timeline data shown in the authenticated dashboard.
 */
export function HomeOverview() {
  return (
    <div className="sa-home-overview">
      {/* Hero */}
      <section className="sa-home-hero" aria-labelledby="home-hero-heading">
        <h2 id="home-hero-heading" className="sa-home-hero-title">
          Template API Generator — Platform Overview
        </h2>
        <p className="sa-home-hero-subtitle">
          A full-stack solution generator that scaffolds .NET APIs, React frontends, Docker
          orchestration, and local development environments from a single JSON schema. Explore
          the platform capabilities below — sign in to access the interactive workspace.
        </p>
        <div className="sa-home-hero-actions">
          <Link href="/login" className="sa-button">
            Sign in to get started
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="sa-home-features" aria-labelledby="home-features-heading">
        <h2 id="home-features-heading" className="sa-section-heading">
          Platform capabilities
        </h2>
        <div className="sa-home-feature-grid">
          <FeatureCard
            emoji="⚡"
            title="One-schema, full-stack scaffolding"
            description="Provide a JSON schema and get a complete .NET solution with CQRS handlers, repository pattern, JWT auth, and typed API endpoints — ready to run."
          />
          <FeatureCard
            emoji="🛡️"
            title="BFF Authentication layer"
            description="HTTP-only cookie session management with CSRF protection handled server-side via a Next.js Backend-for-Frontend — tokens never reach the browser."
          />
          <FeatureCard
            emoji="🎨"
            title="MonsterAdmin-compliant React frontend"
            description="A typed, reusable UI library built on the MonsterAdmin horizontal template: charts, data tables, modals, notifications, and an accessible account menu."
          />
          <FeatureCard
            emoji="🐳"
            title="Docker-first local development"
            description="Every generated solution ships with Docker Compose orchestration and a pre-configured reverse proxy so the entire stack runs with a single command."
          />
        </div>
      </section>

      {/* Experience Timeline — same data as the authenticated dashboard */}
      <section className="sa-home-timeline-section" aria-labelledby="home-experience-heading">
        <h2 id="home-experience-heading" className="sa-section-heading">
          Experience
        </h2>
        <p className="sa-home-timeline-description">
          The timeline below is the same component and data displayed inside the authenticated
          dashboard — it demonstrates the shared Timeline UI built for this platform.
        </p>
        <Timeline items={experienceItems} layout="left" />
      </section>
    </div>
  );
}
