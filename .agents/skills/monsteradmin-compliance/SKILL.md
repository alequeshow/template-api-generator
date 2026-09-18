---
name: monsteradmin-compliance
description: Implement or review Template.Frontend.React UI work against the local MonsterAdmin horizontal template, enforcing visual and behavioral parity for the approved reusable components.
---

# MonsterAdmin Compliance

Use this skill whenever work changes the shared UI, application shell, authentication layout, or any component listed in the scoped reference catalog below. This skill applies to both implementation and code review.

## Source of truth

Do not infer MonsterAdmin behavior from memory, a different admin theme, or external web pages. Inspect the local source template and its referenced local assets before implementing or approving each change.

| Component | Local MonsterAdmin reference | Required React target |
| --- | --- | --- |
| Theme controls | Inspect the horizontal shell, theme-related styles, and plugin behavior in `src\Template.Frontend\Template.MonsterAdmin\template` | Combined tint-color preset and light/dark mode control |
| Account menu | Inspect the horizontal shell/header markup and scripts | Top-right user icon with account hover/focus menu |
| Data table | `src\Template.Frontend\Template.MonsterAdmin\template\horizontal\table-data-table.html` | Reusable typed data table with pagination |
| Modal and alerts | `src\Template.Frontend\Template.MonsterAdmin\template\horizontal\ui-sweetalert.html` | Configurable modal and confirmation-alert APIs |
| Login | `src\Template.Frontend\Template.MonsterAdmin\template\horizontal\pages-login-2.html` | Login layout with panel on the right at desktop widths |
| Buttons | `src\Template.Frontend\Template.MonsterAdmin\template\horizontal\ui-buttons.html` | Shared button variants |
| Notifications | `src\Template.Frontend\Template.MonsterAdmin\template\horizontal\ui-notification.html` | Toastr-style notification system |

If a source page, its relevant assets, or an approved local visual baseline is unavailable, stop and report that parity cannot be claimed. Do not substitute a similar layout.

## Mandatory workflow

1. Read the relevant source template page and identify its markup, styles, states, breakpoints, and JavaScript-driven behavior.
2. Inspect existing React components, tests, and styles before editing. Reuse or evolve existing primitives when they meet the reference contract; do not add a competing duplicate.
3. Record the reference page, viewport sizes, dynamic regions to mask, and intended interaction states in the visual-test fixture or manifest added with the work.
4. Implement declaratively with React and TypeScript. Never add jQuery or imperative DOM plugins to the React runtime.
5. Preserve all backend API contracts and existing authentication security boundaries:
   - retain the Next.js BFF architecture, HTTP-only cookie handling, CSRF protections, and existing auth endpoints;
   - do not expose auth tokens to browser storage or client logs;
   - do not change backend endpoints solely for UI parity.
6. Add or update focused component tests, accessibility tests, and Playwright behavior/visual tests.
7. Run the required validation and report the evidence in the final response.

## Architecture rules

- Keep domain hooks, API contracts, and state logic independent of browser-only UI where practical.
- Place reusable presentation primitives in the shared UI/module boundary rather than inside a feature such as `status`.
- Keep unit and component test files outside production source paths: place them under `src\Template.Frontend\Template.Frontend.React\tests\` (for example, `tests\unit\shared\ui\`). Configure test discovery for that test tree rather than placing `*.test.ts(x)` files under `src\`.
- Extend the `smartadmin` namespace and module token for MonsterAdmin work
- Use typed public props and callback contracts. Avoid `any`, untyped configuration objects, or stringly typed event protocols.
- Preserve semantic HTML, keyboard operation, visible focus treatment, and appropriate ARIA state. Visual similarity never overrides accessibility.
- Do not use inline styles where a shared token or component class is required for consistent theming and screenshot parity.

## Component contracts

### Theme controls

- Provide independent, composable tint-color and light/dark selections, with a coherent combined control matching the reference interaction.
- Persist both choices and restore them before or during hydration without a visible incorrect-theme flash.
- Apply the selected tokens consistently to the shell, navigation, buttons, tables, modals, forms, and notifications.
- Ensure the control is keyboard operable and accurately exposes its selected state.

### Account menu

- Render an identifiable top-right user/avatar trigger.
- Support pointer hover and keyboard focus/open behavior consistent with the reference; retain the menu while moving pointer/focus between trigger and menu.
- Support keyboard navigation, Escape dismissal, outside interaction dismissal, and focus restoration to the trigger.
- Use menu semantics and connect the logout action to the existing session/logout flow.
- Do not replace the menu with a standalone sign-out button when authenticated.

### Data table

- Expose a reusable generic table API rather than keeping pagination, sorting, and filtering exclusive to a feature component.
- Match the reference hierarchy, controls, table density, states, pagination placement, and responsive behavior.
- Include loading, empty, error, filtered, and disabled pagination states.
- Use accessible sortable headers and communicate active sort and page state through semantic/ARIA attributes.
- Keep fixture data deterministic for visual tests.

### Modal and confirmation alerts

- Provide typed configuration for content, variant, actions, close policy, and lifecycle callbacks.
- Support explicit confirm, cancel, and dismiss callbacks. An action callback must run at most once per user action.
- Surface pending action state and prevent accidental duplicate confirmation while pending.
- Trap focus while open, restore focus when closed, and define Escape/backdrop behavior per configuration.
- Match the selected SweetAlert visual variants and action layout without importing SweetAlert or jQuery unless a future explicit architecture decision approves it.

### Login

- Keep the existing BFF login mutation, validation, error rendering, return-path validation, and auth guard behavior unchanged.
- Match the referenced MonsterAdmin composition, with the login panel on the right at desktop width and an intentional responsive layout at tablet/mobile widths.
- Do not show authenticated-only shell navigation on the login page.
- Include semantic labels, validation/error association, loading state, and keyboard-friendly submit behavior.

### Buttons

- Implement the reference variants, sizes, emphasis, disabled/loading states, and icon/text alignment as reusable components or documented shared classes.
- Use `<button>` for actions and links only for navigation. Disabled actions must not be invokable.
- Maintain visible focus and sufficient state contrast across every supported tint and light/dark combination.

### Notifications

- Provide typed severity, optional title, message, timeout, position, dismissibility, and progress configuration.
- Match the reference Toastr placement, stacking, visual severity treatment, and close interaction.
- Use an appropriate live region and avoid announcing the same notification twice.
- Clean up timers when notifications are dismissed or their provider unmounts.
- Specify queue/overflow behavior and cover it with tests.

## Visual parity gate

For every scoped component changed:

1. Capture deterministic screenshots of the reference and React implementation at these viewports:
   - desktop: 1440 x 900;
   - tablet: 1024 x 768;
   - mobile: 390 x 844.
2. Mask only documented dynamic regions such as timestamps, generated IDs, remote images, or intentionally variable data. Never mask the component being evaluated.
3. Compare screenshots in Playwright or the repository's approved image-diff tool.
4. Fail the change when more than 2% of comparable pixels differ at any viewport.
5. Keep approved baselines local and versioned with their test fixture. External screenshots are not acceptable evidence.

## Required tests

Run the smallest applicable tests first, then run these frontend quality gates from `src\Template.Frontend\Template.Frontend.React` when the change affects shared UI:

```text
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

At minimum, add tests for the changed component's interaction, keyboard behavior, visible state, and responsive/visual contract. Do not mark a component compliant based only on a static screenshot.

## Completion report

When applying this skill, report:

1. The exact local MonsterAdmin reference page(s) inspected.
2. The React components and tests changed.
3. The behavior states verified, including keyboard and responsive states.
4. The visual comparison viewport results and differing-pixel percentage.
5. Any documented mask and why it is necessary.

Do not claim MonsterAdmin compliance if any item above is missing or the 2% threshold is exceeded.
