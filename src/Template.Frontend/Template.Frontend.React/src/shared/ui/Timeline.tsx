"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type TimelineLayout = "alternate" | "left" | "right";
export type TimelineBadgeVariant = "primary" | "success" | "warning" | "danger" | "info";
export type TimelineBadgeSize = "sm" | "md" | "lg";
export type TimelineSide = "left" | "right";

export type TimelineBadge = {
  /** Icon, image, emoji, or short text rendered inside the round badge. */
  content: ReactNode;
  variant?: TimelineBadgeVariant;
  size?: TimelineBadgeSize;
};

export type TimelineItemData = {
  id: string;
  badge?: TimelineBadge;
  /** Forces this entry to a specific side, overriding the container `layout`. */
  side?: TimelineSide;
  /** Freeform body content. Ignored when structured fields (title/subtitle/meta/description) are provided. */
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** E.g. a date range/period line, rendered under the subtitle. */
  meta?: ReactNode;
  description?: ReactNode;
  /**
   * Whether a long `description` string can be collapsed/expanded.
   * Defaults to `true`. Set to `false` to always render the description fully expanded.
   */
  expandable?: boolean;
  /** Number of lines shown before the description is clamped. Defaults to 4. */
  collapsedLines?: number;
  /** Extra content rendered below the body, e.g. actions. */
  footer?: ReactNode;
};

export type TimelineProps = {
  items: TimelineItemData[];
  layout?: TimelineLayout;
  className?: string;
};

function resolveSide(layout: TimelineLayout, index: number, itemSide?: TimelineSide): TimelineSide {
  if (itemSide) return itemSide;
  if (layout === "left") return "left";
  if (layout === "right") return "right";
  return index % 2 === 0 ? "left" : "right";
}

function TimelineDescription({
  description,
  expandable = true,
  collapsedLines = 4,
}: {
  description: ReactNode;
  expandable?: boolean;
  collapsedLines?: number;
}) {
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const isClamped = expandable && !isExpanded;

  useEffect(() => {
    if (!expandable) return;

    const node = contentRef.current;
    if (!node) return;

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      setIsOverflowing(node.scrollHeight - node.clientHeight > 1);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [description, expandable, collapsedLines]);

  return (
    <div className="sa-timeline-description-wrapper">
      <div
        id={contentId}
        ref={contentRef}
        className={["sa-timeline-description", isClamped ? "sa-timeline-description-clamped" : ""]
          .filter(Boolean)
          .join(" ")}
        style={isClamped ? { WebkitLineClamp: collapsedLines } : undefined}
      >
        {description}
      </div>
      {expandable && isOverflowing ? (
        <button
          type="button"
          className="sa-timeline-toggle"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}

function TimelineBadgeView({ badge }: { badge: TimelineBadge }) {
  const { content, variant = "primary", size = "md" } = badge;

  return (
    <div
      className={["sa-timeline-badge", `sa-timeline-badge-${variant}`, `sa-timeline-badge-${size}`].join(" ")}
      aria-hidden={typeof content === "string" ? undefined : true}
    >
      {content}
    </div>
  );
}

function TimelineEntry({
  item,
  side,
}: {
  item: TimelineItemData;
  side: TimelineSide;
}) {
  const hasStructuredContent = Boolean(item.title || item.subtitle || item.meta || item.description);

  return (
    <li className={["sa-timeline-item", side === "right" ? "sa-timeline-item-right" : ""].filter(Boolean).join(" ")}>
      {item.badge ? <TimelineBadgeView badge={item.badge} /> : null}
      <div className="sa-timeline-panel">
        {hasStructuredContent ? (
          <div className="sa-timeline-heading">
            {item.title ? <h4 className="sa-timeline-title">{item.title}</h4> : null}
            {item.subtitle ? <div className="sa-timeline-subtitle">{item.subtitle}</div> : null}
            {item.meta ? <div className="sa-timeline-meta">{item.meta}</div> : null}
          </div>
        ) : null}
        {item.description ? (
          <div className="sa-timeline-body">
            <TimelineDescription
              description={item.description}
              expandable={item.expandable}
              collapsedLines={item.collapsedLines}
            />
          </div>
        ) : item.children ? (
          <div className="sa-timeline-body">{item.children}</div>
        ) : null}
        {item.footer ? <div className="sa-timeline-footer">{item.footer}</div> : null}
      </div>
    </li>
  );
}

export function Timeline({ items, layout = "alternate", className }: TimelineProps) {
  return (
    <ol
      className={["sa-timeline", `sa-timeline-${layout}`, className].filter(Boolean).join(" ")}
    >
      {items.map((item, index) => (
        <TimelineEntry key={item.id} item={item} side={resolveSide(layout, index, item.side)} />
      ))}
    </ol>
  );
}
