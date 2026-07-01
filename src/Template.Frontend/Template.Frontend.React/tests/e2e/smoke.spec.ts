import { expect, test } from "@playwright/test";

test("redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("allows dashboard access with auth cookie", async ({ context, page }) => {
  await context.addCookies([
    {
      name: "tg_access_token",
      value: "fake-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/");

  await expect(page.getByText("Temple SmartAdmin")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
