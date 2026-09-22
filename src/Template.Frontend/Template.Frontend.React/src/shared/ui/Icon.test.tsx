import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon } from "@/shared/ui/Icon";

describe("Icon", () => {
  it("renders a FontAwesome icon with the fa base class", () => {
    const { container } = render(<Icon name="fa-home" />);
    const icon = container.querySelector("i");

    expect(icon).not.toBeNull();
    expect(icon?.className).toBe("fa fa-home");
  });

  it("renders a Material Design Icons icon with the mdi base class", () => {
    const { container } = render(<Icon name="mdi-content-save" />);
    const icon = container.querySelector("i");

    expect(icon?.className).toBe("mdi mdi-content-save");
  });

  it("renders a Themify icon without an extra base class", () => {
    const { container } = render(<Icon name="ti-bolt" />);
    const icon = container.querySelector("i");

    expect(icon?.className).toBe("ti-bolt");
  });

  it("allows swapping icon sources with no other changes", () => {
    const { container: faContainer } = render(<Icon name="fa-save" />);
    const { container: mdiContainer } = render(<Icon name="mdi-content-save" />);
    const { container: tiContainer } = render(<Icon name="ti-save" />);

    expect(faContainer.querySelector("i")?.tagName).toBe("I");
    expect(mdiContainer.querySelector("i")?.tagName).toBe("I");
    expect(tiContainer.querySelector("i")?.tagName).toBe("I");
  });

  it("inherits the container font-size when no size is provided", () => {
    const { container } = render(<Icon name="ti-bolt" />);
    const icon = container.querySelector("i");

    expect(icon?.style.fontSize).toBe("");
  });

  it("applies a numeric size as pixels", () => {
    const { container } = render(<Icon name="ti-bolt" size={24} />);
    const icon = container.querySelector("i");

    expect(icon?.style.fontSize).toBe("24px");
  });

  it("applies a string size as-is", () => {
    const { container } = render(<Icon name="ti-bolt" size="1.5rem" />);
    const icon = container.querySelector("i");

    expect(icon?.style.fontSize).toBe("1.5rem");
  });

  it("merges a custom className with the resolved icon class", () => {
    const { container } = render(<Icon name="fa-home" className="sa-nav-icon" />);
    const icon = container.querySelector("i");

    expect(icon?.className).toBe("fa fa-home sa-nav-icon");
  });
});
