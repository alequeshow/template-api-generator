# MonsterAdmin Compliance Skill Plan

## Problem

`Template.Frontend.React` currently contains a partial SmartAdmin-branded React adaptation: its shell, CSS tokens, test names, documentation, and component namespaces use `smartadmin`/`sa-*`. The target vendor reference is instead the MonsterAdmin template at `src\Template.Frontend\Template.MonsterAdmin\template`.

The requested reusable agent skill must prevent future frontend work from drifting away from the selected MonsterAdmin UI/UX. It must make both visual and behavioral parity measurable for these initial areas:

1. Combined tint-color and light/dark theme switching.
2. Top-right user icon and hover/focus account menu.
3. Data table, including pagination, based on `template\horizontal\table-data-table.html`.
4. Configurable action/callback modals and confirmation alerts based on `template\horizontal\ui-sweetalert.html`.
5. Login screen based on `template\horizontal\pages-login-2.html`, with the login panel positioned on the right.
6. Button variants based on `template\horizontal\ui-buttons.html`.
7. Toastr-style notifications based on `template\horizontal\ui-notification.html`.

## Current-State Findings

- The React application is a Next.js 16 / React 19 / TypeScript project at `src\Template.Frontend\Template.Frontend.React`, with Tailwind, TanStack Query, React Hook Form, Zod, Vitest, and Playwright.
- Its existing adaptation lives under `src\modules\smartadmin\`; `AppShell`, `Navigation`, CSS, tokens, page components, test assertions, and documentation are SmartAdmin-branded.
- Existing incomplete equivalents include:
  - `ThemeSwitcher`, which only toggles light/dark and has no tint presets.
  - `AuthActions`, which exposes sign-in/sign-out but no account avatar/menu.
  - `StatusListTable`, which implements client-side search, sorting, and basic pagination but is feature-specific rather than a reusable MonsterAdmin table component.
  - `Modal`, which supports open/close, title, footer, sizes, Escape, and backdrop close, but has no alert/action callback API.
  - `ToastProvider`, which has basic timed toasts but lacks a Toastr-compatible configuration and interaction surface.
  - `LoginPage`, which renders a centered card rather than the requested MonsterAdmin login-right layout.
- The checked template directory currently exposes `assets` and `horizontal\scss` to the available file reader; the five referenced HTML files were not discoverable. Implementation must first verify that the source HTML pages are present and readable. If they are missing, the plan must restore/provide them or create approved static screenshot fixtures before any parity claim is permitted.
- The worktree already contains unrelated user changes in `.env_template`, `docker-compose.yml`, `src\Template.Api\Dockerfile`, `app\login\page.tsx`, and a new `proxy.ts`; implementation must preserve them.

## Proposed Approach

### 1. Establish the reference catalog and test assets

- Verify the requested MonsterAdmin source pages and their referenced CSS, icons, images, and JavaScript behaviors.
- Create a versioned, local reference manifest that maps each required React component to:
  - source template page and relevant selector/behavior;
  - desktop, tablet, and mobile viewport definitions;
  - known dynamic regions to mask (time, generated IDs, network-dependent data);
  - behavioral acceptance scenarios.
- Generate approved baseline screenshots from the local MonsterAdmin pages at the defined viewports. Do not rely on external URLs.

### 2. Add the repository agent skill

- Create `.github\skills\monsteradmin-compliance\SKILL.md`.
- Write it as an implementation-and-review skill, with mandatory workflow gates:
  1. read the reference manifest and inspect the exact MonsterAdmin source page;
  2. inventory existing React components before adding/replacing code;
  3. preserve framework and security constraints (Next.js, existing BFF auth, no jQuery runtime dependency, no backend contract changes);
  4. implement through reusable, framework-neutral interfaces where practical;
  5. write or update behavior, accessibility, responsive, and visual regression tests;
  6. run the prescribed quality suite and report parity evidence.
- Encode the feature-specific obligations:
  - theme: tint preset plus light/dark persistence, SSR/hydration-safe initialization, and propagation through shell/component tokens;
  - account menu: avatar/icon, pointer hover and keyboard focus behavior, Escape/outside-click close behavior, semantic menu roles, logout integration;
  - data table: reusable typed API, pagination controls, responsive overflow/alternative layout, loading/empty/error states, keyboard and ARIA sorting/page state;
  - modal/alert: typed configuration, explicit confirm/cancel/dismiss callbacks, pending-action state, focus trap, focus restoration, Escape/backdrop policy, and no callback double-fire;
  - login: unauthenticated-only layout, right-positioned panel at desktop, responsive fallback, preserved existing authentication/BFF return flow, validation and errors;
  - buttons: documented semantic variants, sizes, disabled/loading state, icon alignment, focus states, and native button/link semantics;
  - notifications: typed severity, title/message, configurable timeout/progress/position/dismissal, queue behavior, live-region semantics, and cleanup.
- Instruct the skill to reject parity claims when source reference, screenshots, behavior tests, or visual-diff results are missing.

### 3. Build reusable parity infrastructure

- Create a dedicated MonsterAdmin module and tokens rather than extending the misleading `smartadmin` namespace. Migrate consumers incrementally to avoid mixing visual systems.
- Add a component preview/catalog route or test fixtures for the seven scoped components so snapshots do not depend on backend state.
- Add Playwright screenshot tests that compare the React preview/routes with local approved baselines at desktop, tablet, and mobile widths.
- Configure masking and deterministic fixture data; fail when the differing-pixel percentage exceeds 2%.
- Add unit/component tests for interactions and accessibility semantics, plus focused E2E flows for theme persistence, menu operation, table pagination, modal callbacks, login layout/auth guard, and notification lifecycle.

### 4. Apply the skill to the current frontend

- Replace or migrate the existing partial components only after the reference catalog is available.
- Keep auth contracts, BFF routes, cookie/CSRF protections, and existing API endpoints unchanged.
- Update frontend documentation to name MonsterAdmin as the source of truth and remove or clearly retire SmartAdmin-specific reference claims.

## Validation and Acceptance

For every scoped component, the implementation must:

- pass `npm run lint`, `npm run typecheck`, `npm run test`, and the relevant Playwright suite;
- have deterministic visual screenshots at the three approved breakpoints;
- differ by no more than 2% of comparable pixels after only documented dynamic masks;
- pass the component's behavior and keyboard/accessibility scenarios;
- cite its MonsterAdmin reference page in the reference manifest and the skill’s final report.

## Notes and Decisions

- Skill location: `.github\skills\monsteradmin-compliance\SKILL.md`.
- Compliance standard: visual **and** behavioral parity with screenshot evidence.
- Visual threshold: at most 2% differing pixels after masking documented dynamic content.
- The reference must be local and versioned; the agent must not make parity decisions from memory or a similar admin theme.
- The skill should guide agents, not replace normal repository instructions or permit broad unrelated refactors.
