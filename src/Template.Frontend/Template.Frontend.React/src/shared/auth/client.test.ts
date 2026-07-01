import { afterEach, describe, expect, it, vi } from "vitest";

import { getSession } from "@/shared/auth/client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("auth client", () => {
  it("returns anonymous session when unauthorized", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 401,
        ok: false,
      }),
    );

    const session = await getSession();

    expect(session.state).toBe("anonymous");
  });
});
