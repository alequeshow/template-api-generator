import { expect, test } from "@playwright/test";

test("redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
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

  await expect(page.getByText("Template.Frontend.React")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("opens the account menu, links to the profile page, and signs out", async ({ context, page }) => {
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
    {
      name: "tg_csrf_token",
      value: "csrf-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await context.route(/\/api\/bff\/auth\/userinfo(?:\?.*)?$/, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        userId: "alex",
        firstName: "Alex",
        lastName: "Doe",
        email: "alex@example.com",
      }),
    });
  });
  await context.route(/\/api\/bff\/auth\/logout(?:\?.*)?$/, async (route) => {
    await context.clearCookies();
    await route.fulfill({ status: 204 });
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open user account menu" }).click();
  await expect(page.getByRole("menu", { name: "User account" })).toBeVisible();
  await expect(page.getByText("Alex Doe")).toBeVisible();
  await expect(page.getByText("alex@example.com")).toBeVisible();
  await page.getByRole("menuitemcheckbox", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("menuitemcheckbox", { name: "Switch to light theme" })).toBeVisible();

  await page.getByRole("menuitem", { name: "My Profile" }).click();
  await expect(page).toHaveURL(/\/auth$/);

  await page.getByRole("button", { name: "Open user account menu" }).click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});
