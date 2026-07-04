"use client";

import { useState, type ReactNode } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
};

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="sa-accordion">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);

        return (
          <div key={item.id} className="sa-accordion-item">
            <button
              type="button"
              className="sa-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              data-open={isOpen}
              onClick={() => toggle(item.id)}
            >
              {item.title}
              <span className="sa-accordion-icon" data-open={isOpen} aria-hidden="true">
                ▾
              </span>
            </button>
            {isOpen ? (
              <div
                id={`accordion-content-${item.id}`}
                className="sa-accordion-content"
              >
                <div className="sa-accordion-content-inner">{item.content}</div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
