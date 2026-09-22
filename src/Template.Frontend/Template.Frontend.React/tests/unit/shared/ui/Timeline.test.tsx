import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Timeline, type TimelineItemData } from "@/shared/ui/Timeline";

class ImmediateResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }

  unobserve() {}

  disconnect() {}
}

function mockOverflow(scrollHeight: number, clientHeight: number) {
  const scrollHeightSpy = vi
    .spyOn(HTMLElement.prototype, "scrollHeight", "get")
    .mockReturnValue(scrollHeight);
  const clientHeightSpy = vi
    .spyOn(HTMLElement.prototype, "clientHeight", "get")
    .mockReturnValue(clientHeight);
  const originalResizeObserver = globalThis.ResizeObserver;
  globalThis.ResizeObserver = ImmediateResizeObserver as unknown as typeof ResizeObserver;

  return () => {
    scrollHeightSpy.mockRestore();
    clientHeightSpy.mockRestore();
    globalThis.ResizeObserver = originalResizeObserver;
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

const baseItems: TimelineItemData[] = [
  { id: "one", title: "First entry", description: "Short body." },
  { id: "two", title: "Second entry", description: "Another short body." },
  { id: "three", title: "Third entry", description: "Yet another short body." },
];

describe("Timeline", () => {
  it("alternates entries left/right by default", () => {
    const { container } = render(<Timeline items={baseItems} />);

    const listItems = container.querySelectorAll("li.sa-timeline-item");
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).not.toHaveClass("sa-timeline-item-right");
    expect(listItems[1]).toHaveClass("sa-timeline-item-right");
    expect(listItems[2]).not.toHaveClass("sa-timeline-item-right");
  });

  it("forces every entry to the right when layout is 'right'", () => {
    const { container } = render(<Timeline items={baseItems} layout="right" />);

    const listItems = container.querySelectorAll("li.sa-timeline-item");
    listItems.forEach((item) => expect(item).toHaveClass("sa-timeline-item-right"));
  });

  it("forces every entry to the left when layout is 'left'", () => {
    const { container } = render(<Timeline items={baseItems} layout="left" />);

    const listItems = container.querySelectorAll("li.sa-timeline-item");
    listItems.forEach((item) => expect(item).not.toHaveClass("sa-timeline-item-right"));
  });

  it.each(["alternate", "left", "right"] as const)(
    "renders grey rail-start and rail-end dot markers for layout '%s'",
    (layout) => {
      const { container } = render(<Timeline items={baseItems} layout={layout} />);

      expect(container.querySelector(".sa-timeline-rail-start")).toBeInTheDocument();
      expect(container.querySelector(".sa-timeline-rail-end")).toBeInTheDocument();
    },
  );

  it("honors a per-item side override regardless of layout", () => {
    const items: TimelineItemData[] = [
      { id: "one", title: "Forced right", description: "Body", side: "right" },
    ];
    const { container } = render(<Timeline items={items} layout="left" />);

    expect(container.querySelector("li.sa-timeline-item")).toHaveClass("sa-timeline-item-right");
  });

  it("renders icon, image, and text badge content with size and variant classes", () => {
    const items: TimelineItemData[] = [
      { id: "icon", badge: { content: "🚀", variant: "primary", size: "lg" }, children: "Body" },
      {
        id: "image",
        // eslint-disable-next-line @next/next/no-img-element
        badge: { content: <img alt="user" src="/user.jpg" />, variant: "success", size: "sm" },
        children: "Body",
      },
      { id: "text", badge: { content: "NEW", variant: "info", size: "md" }, children: "Body" },
    ];

    const { container } = render(<Timeline items={items} />);

    const badges = container.querySelectorAll(".sa-timeline-badge");
    expect(badges).toHaveLength(3);
    expect(badges[0]).toHaveClass("sa-timeline-badge-primary", "sa-timeline-badge-lg");
    expect(badges[1]).toHaveClass("sa-timeline-badge-success", "sa-timeline-badge-sm");
    expect(badges[1].querySelector("img")).toBeInTheDocument();
    expect(badges[2]).toHaveClass("sa-timeline-badge-info", "sa-timeline-badge-md");
    expect(badges[2]).toHaveTextContent("NEW");
  });

  it("renders simple freeform children when no structured fields are given", () => {
    const items: TimelineItemData[] = [{ id: "one", children: <p>Freeform content</p> }];
    render(<Timeline items={items} />);

    expect(screen.getByText("Freeform content")).toBeInTheDocument();
  });

  it("renders structured title/subtitle/meta/description content in order", () => {
    const items: TimelineItemData[] = [
      {
        id: "one",
        title: "Senior Software Engineer",
        subtitle: "Contoso Digital",
        meta: "Mar 2023 — Present",
        description: "Led the frontend migration.",
      },
    ];
    render(<Timeline items={items} />);

    expect(screen.getByRole("heading", { name: "Senior Software Engineer" })).toBeInTheDocument();
    expect(screen.getByText("Contoso Digital")).toBeInTheDocument();
    expect(screen.getByText("Mar 2023 — Present")).toBeInTheDocument();
    expect(screen.getByText("Led the frontend migration.")).toBeInTheDocument();
  });

  it("shows a Show more/less toggle only when the description overflows, and toggling only affects that entry", async () => {
    const restore = mockOverflow(120, 60);
    const user = userEvent.setup();

    const items: TimelineItemData[] = [
      { id: "overflowing", title: "Overflowing", description: "A very long description." },
    ];
    render(<Timeline items={items} />);

    const toggle = screen.getByRole("button", { name: "Show more" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute("aria-expanded", "true");

    restore();
  });

  it("does not render a toggle when the description does not overflow", () => {
    const restore = mockOverflow(60, 60);

    const items: TimelineItemData[] = [
      { id: "short", title: "Short", description: "Fits on the clamped lines." },
    ];
    render(<Timeline items={items} />);

    expect(screen.queryByRole("button", { name: /show (more|less)/i })).not.toBeInTheDocument();

    restore();
  });

  it("always renders the description fully expanded and skips the toggle when expandable is false", () => {
    const restore = mockOverflow(200, 40);

    const items: TimelineItemData[] = [
      {
        id: "always-expanded",
        title: "Education",
        description: "A long description that would otherwise overflow.",
        expandable: false,
      },
    ];
    const { container } = render(<Timeline items={items} />);

    expect(screen.queryByRole("button", { name: /show (more|less)/i })).not.toBeInTheDocument();
    expect(container.querySelector(".sa-timeline-description-clamped")).not.toBeInTheDocument();

    restore();
  });

  it("clamps to a default of 4 lines and honors a custom collapsedLines value", () => {
    const restore = mockOverflow(200, 40);

    const items: TimelineItemData[] = [
      { id: "default-clamp", title: "Default", description: "Default clamp description." },
      { id: "custom-clamp", title: "Custom", description: "Custom clamp description.", collapsedLines: 2 },
    ];
    const { container } = render(<Timeline items={items} />);

    const clampedNodes = container.querySelectorAll(".sa-timeline-description-clamped");
    expect(clampedNodes).toHaveLength(2);
    expect((clampedNodes[0] as HTMLElement).style.webkitLineClamp).toBe("4");
    expect((clampedNodes[1] as HTMLElement).style.webkitLineClamp).toBe("2");

    restore();
  });

  it("wires aria-controls from the toggle to the description content", async () => {
    const restore = mockOverflow(120, 60);
    const user = userEvent.setup();

    const items: TimelineItemData[] = [{ id: "one", title: "One", description: "Long body." }];
    const { container } = render(<Timeline items={items} />);

    const toggle = screen.getByRole("button", { name: "Show more" });
    const controlsId = toggle.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    expect(container.querySelector(`#${CSS.escape(controlsId ?? "")}`)).toHaveClass("sa-timeline-description");

    await user.click(toggle);
    expect(toggle).toHaveTextContent("Show less");

    restore();
  });
});
