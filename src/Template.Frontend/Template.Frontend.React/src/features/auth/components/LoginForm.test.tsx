import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/components/LoginForm";

const mutateAsync = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/features/auth/hooks/useSession", () => ({
  useLoginMutation: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

describe("LoginForm", () => {
  it("validates required fields", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("User identifier is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });
});
