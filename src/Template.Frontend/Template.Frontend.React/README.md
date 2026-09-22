## Temple Frontend React

Phase 1 and 2 foundation for migrating the frontend to Next.js + React.

### Scripts

- `npm run dev`: Start local development server.
- `npm run lint`: Run ESLint.
- `npm run typecheck`: Run TypeScript checks.
- `npm run test`: Run Vitest unit/component tests.
- `npm run test:e2e`: Run Playwright smoke tests.
- `npm run build`: Build the Next.js application.
- `npm run format`: Check Prettier formatting.

### Environment

Copy `.env.example` to `.env.local` and set values:

- `NEXT_PUBLIC_API_BASE_URL`: backend API base URL.
- `NEXT_PUBLIC_APP_ENV`: environment name.
- `ALLOW_SELF_SIGNED_CERTS` (optional): set to `true` to accept self-signed HTTPS certificates for backend calls from BFF routes in local development.

### Updating Playwright visual snapshots

Some `tests/e2e/*.spec.ts` files use `toHaveScreenshot(...)` to assert pixel-level visual
contracts (e.g. `dashboard-charts.spec.ts`, `notification.spec.ts`). Their baseline images live
next to each spec in a `*.spec.ts-snapshots/` folder and are checked into source control.

Whenever a UI change intentionally alters the appearance of one of these covered pages/components
(layout, spacing, colors, removed/added elements, etc.), regenerate the affected baselines instead
of letting the test fail:

```powershell
# Regenerate every visual snapshot in the e2e suite
npx playwright test --update-snapshots

# Regenerate snapshots for a single spec file only (preferred, keeps the diff small)
npx playwright test tests/e2e/dashboard-charts.spec.ts --update-snapshots
```

After regenerating:

1. Re-run the same spec(s) without `--update-snapshots` to confirm they now pass:
   `npx playwright test tests/e2e/dashboard-charts.spec.ts`.
2. Review the updated `.png` files under `tests/e2e/*.spec.ts-snapshots/` (e.g. via `git diff` or
   an image viewer) to make sure only the expected visual change is reflected.
3. Commit the updated snapshot files alongside your code change.

Snapshots are generated per-OS/browser (the filename includes `chromium-win32`, etc.), so always
regenerate them on the same platform your CI runs on, or expect the first CI run after your change
to fail until CI-generated baselines are committed.
