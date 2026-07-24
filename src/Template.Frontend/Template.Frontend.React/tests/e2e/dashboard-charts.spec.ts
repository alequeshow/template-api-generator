import { expect, test, type BrowserContext } from "@playwright/test";

async function authenticate(context: BrowserContext) {
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
}

test("shows the reusable chart dashboard and supports pausing live updates", async ({ context, page }) => {
  await authenticate(context);
  await page.goto("/");

  await expect(page.getByText("Monthly report")).toBeVisible();
  await expect(page.getByText("Round progress")).toBeVisible();
  await expect(page.locator("tspan").filter({ hasText: /^Weekly peak: \d+$/ })).toBeVisible();
  await expect(page.locator("tspan").filter({ hasText: /^Weekly low: \d+$/ })).toBeVisible();
  await expect(page.getByText("SmartAdmin shell foundation with reusable cards and navigation")).toHaveCount(0);

  const pauseButton = page.getByRole("button", { name: "Pause updates" });
  await pauseButton.focus();
  await page.keyboard.press("Enter");

  const resumeButton = page.getByRole("button", { name: "Resume updates" });
  await expect(resumeButton).toHaveAttribute("aria-pressed", "true");
  await expect(resumeButton).toBeFocused();
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`matches the dashboard chart visual contract at ${viewport.name}`, async ({ context, page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await authenticate(context);
    await page.goto("/");

    const dashboard = page.locator(".sa-dashboard-chart-grid");
    await expect(dashboard).toBeVisible();
    await expect(dashboard).toHaveScreenshot(`dashboard-charts-${viewport.name}.png`, {
      animations: "disabled",
      mask: [page.locator(".sa-realtime-chart")],
      maxDiffPixelRatio: 0.02,
    });
  });
}
