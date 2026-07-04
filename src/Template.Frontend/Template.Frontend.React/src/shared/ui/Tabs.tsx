"use client";

import { useState, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultTab?: string;
};

export function Tabs({ items, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? items[0]?.id ?? "");

  const active = items.find((t) => t.id === activeTab);

  return (
    <div className="sa-tabs">
      <ul className="sa-tabs-list" role="tablist">
        {items.map((tab) => (
          <li key={tab.id} role="presentation">
            <button
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              className="sa-tab-trigger"
              data-active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      {active ? (
        <div
          role="tabpanel"
          id={`tabpanel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="sa-tab-panel"
        >
          {active.content}
        </div>
      ) : null}
    </div>
  );
}
