import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthAccountMenu } from "@/features/auth/components/AuthAccountMenu";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    [key: string]: unknown;
  }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockSessionQuery = vi.fn();
const mockLogoutMutation = vi.fn();

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSessionQuery: () => mockSessionQuery(),
  useLogoutMutation: () => mockLogoutMutation(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("AuthAccountMenu", () => {
  it("renders avatar link to /login when user is not authenticated", () => {
    mockSessionQuery.mockReturnValue({ data: { state: "anonymous" } });
    mockLogoutMutation.mockReturnValue({ isPending: false, mutateAsync: vi.fn() });

    const { container } = render(<AuthAccountMenu />, { wrapper });

    const link = screen.getByRole("link", { name: "Sign in" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");

    // The avatar image is decorative (alt="") so it has role="presentation",
    // query it directly via the DOM instead of by ARIA role.
    const avatar = container.querySelector("img");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "/users/default-avatar.jpg");
  });

  it("renders avatar link to /login when session data is undefined", () => {
    mockSessionQuery.mockReturnValue({ data: undefined });
    mockLogoutMutation.mockReturnValue({ isPending: false, mutateAsync: vi.fn() });

    render(<AuthAccountMenu />, { wrapper });

    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders the UserAccountMenu when user is authenticated", () => {
    mockSessionQuery.mockReturnValue({
      data: {
        state: "authenticated",
        user: {
          userId: "u1",
          firstName: "Alex",
          lastName: "Doe",
          email: "alex@example.com",
        },
      },
    });
    mockLogoutMutation.mockReturnValue({ isPending: false, mutateAsync: vi.fn() });

    render(<AuthAccountMenu />, { wrapper });

    // When authenticated, the UserAccountMenu trigger is rendered instead of the sign-in link
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open user account menu" }),
    ).toBeInTheDocument();
  });
});
