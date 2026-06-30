# Template.Frontend.React Specification

## 1. Objective

Create a new frontend application under:

- `src/Template.Frontend/Template.Frontend.React`

This frontend will use React with Next.js (TypeScript), integrate with SmartAdmin, keep the current backend API contracts unchanged, and establish a reusable UI/BFF architecture that is adaptable to React Native.

## 2. Scope

### In scope

- Scaffold a new React application (Next.js + TypeScript) in `Template.Frontend.React`.
- Integrate SmartAdmin visual system (layout, navigation, tokens, components).
- Replace jQuery-dependent template behaviors with React-friendly modern libraries.
- Integrate authentication against existing backend endpoints without backend API changes.
- Enable cookie-based authentication persistence.
- Define reusable architecture for web and future React Native reuse.
- Define automated testing strategy and CI pipeline requirements.

### Out of scope

- Any backend endpoint signature changes.
- Full production feature migration from existing Blazor pages in this phase.
- Native mobile app implementation in this phase.

## 3. Target Stack

- **Framework**: Next.js (App Router) + React + TypeScript.
- **State/Server data**: TanStack Query for API data lifecycle.
- **Forms/validation**: React Hook Form + Zod.
- **Styling**: SmartAdmin styles + design tokens + utility-first conventions where needed.
- **Component primitives**: Headless UI approach (Radix UI or equivalent) for accessibility and composability.
- **Testing**:
  - Unit/component: Vitest + React Testing Library.
  - End-to-end: Playwright.
- **Quality**: ESLint + Prettier + TypeScript strict mode.

## 4. Repository Structure

Create initial structure:

```text
src/Template.Frontend/Template.Frontend.React/
  docs/
    specs.md
  app/
  src/
    shared/
      ui/
      design-tokens/
      utils/
      api/
      auth/
      bff/
    features/
      auth/
      dashboard/
    modules/
      smartadmin/
  tests/
    e2e/
```

Notes:

- `shared/` contains cross-feature, reusable building blocks.
- `features/` contains bounded business slices.
- `modules/smartadmin/` contains SmartAdmin adaptation layer (not raw vendor drop-in).

## 5. SmartAdmin Integration Plan

### 5.1 Integration goals

- Preserve SmartAdmin visual identity and page composition patterns.
- Avoid direct dependence on jQuery plugins and imperative DOM manipulation.
- Move to declarative React component wrappers.

### 5.2 Adaptation strategy

1. Import only required SmartAdmin assets (styles, icons, tokens, layouts).
2. Create React layout shell:
   - `AppShell` (header, sidebar, content, footer).
   - `PageContainer`.
   - `Navigation` components.
3. Build React equivalents for high-use SmartAdmin widgets:
   - tables, cards, forms, modals, notifications, menu interactions.
4. For jQuery-only widgets:
   - replace with React-native alternatives (e.g., TanStack Table, chart libs, headless dialogs).
   - do not embed jQuery inside React lifecycle except as temporary fallback during migration.

### 5.3 jQuery removal policy

- No new dependency on jQuery.
- Existing jQuery-dependent features are mapped to modern React-compatible libraries.
- Track each replaced widget in a migration checklist.

## 6. Authentication and Cookie Persistence

### 6.1 Non-negotiable constraints

- Keep backend APIs unchanged.
- Keep current auth contracts and token/cookie semantics.

### 6.2 Web auth architecture

- Use a **BFF layer inside Next.js** (route handlers/server actions) to proxy auth interactions to backend.
- Frontend browser should not directly manage sensitive tokens in localStorage/sessionStorage.
- Use HTTP-only, Secure, SameSite-configured cookies for auth persistence.

### 6.3 Flows to implement

1. Login:
   - UI posts credentials to BFF endpoint.
   - BFF calls backend auth endpoint and sets HTTP-only session cookies.
2. Authenticated API access:
   - Browser calls BFF.
   - BFF forwards cookie/session context to backend.
3. Refresh:
   - BFF handles refresh endpoint with backend and rotates cookie safely.
4. Logout:
   - BFF revokes token/session through backend revoke endpoint and clears cookies.

### 6.4 Security requirements

- CSRF mitigation for mutating requests.
- Strict cookie configuration by environment.
- No sensitive token leakage to client logs.
- Centralized auth error handling and forced re-authentication behavior.

## 7. UI/UX and Reuse for React Native

### 7.1 Reuse principles

- Keep domain/business logic framework-agnostic in `shared/`.
- Separate visual components from stateful/use-case hooks.
- Define API contracts in reusable typed clients.

### 7.2 Layering for reuse

- `shared/api`: contract and transport adapters.
- `shared/auth`: auth state and session orchestration interfaces.
- `shared/ui`: web component library mapped to design tokens.
- `shared/design-tokens`: colors, spacing, typography, elevations.

### 7.3 React Native readiness rules

- Avoid browser-only dependencies in shared business modules.
- Encapsulate web-only code (cookies, DOM APIs) under web adapters.
- Keep navigation and screen-level logic portable through composition-friendly hooks.

## 8. Testing and CI Specification

### 8.1 Test pyramid

- Unit tests for utilities, mappers, hooks.
- Component tests for UI and auth form flows.
- E2E tests for login/logout/session persistence and key navigation.

### 8.2 Mandatory CI jobs

1. Install dependencies with lockfile enforcement.
2. Type check (`tsc --noEmit`).
3. Lint (`eslint`).
4. Unit/component tests (`vitest`).
5. E2E tests (`playwright`) against test environment.
6. Build verification (`next build`).

### 8.3 CI quality gates

- Fail on lint/type/test/build errors.
- Publish test reports and Playwright artifacts.
- Optional: enforce minimum coverage threshold for critical modules.

## 9. Implementation Phases

### Phase 1: Foundation

- Scaffold Next.js TypeScript app.
- Configure linting, formatting, testing baseline.
- Configure environment and secret handling.

### Phase 2: SmartAdmin Shell

- Implement AppShell and navigation from SmartAdmin.
- Port style tokens and baseline components.
- Remove/replace jQuery-dependent mechanics.

### Phase 3: Auth + BFF

- Implement BFF auth endpoints and cookie persistence.
- Integrate login/logout/refresh flows with backend.
- Add auth guards and session recovery behavior.

### Phase 4: Feature Migration

- Migrate high-priority pages first (dashboard/status/auth-related).
- Use feature-by-feature rollout and parity checks.

### Phase 5: Hardening

- Complete E2E coverage for core flows.
- Performance profiling and accessibility improvements.
- Documentation and handoff.

## 10. Deliverables

- New folder and project skeleton in `Template.Frontend.React`.
- This specification document in `docs/specs.md`.
- Architecture decisions documented for SmartAdmin integration, auth/BFF, and React Native readiness.
- CI test strategy and quality gates defined.

## 11. Acceptance Criteria

- `Template.Frontend.React` exists under `src/Template.Frontend`.
- `docs/specs.md` exists and covers:
  - React project creation approach.
  - SmartAdmin integration strategy.
  - jQuery modernization strategy.
  - backend-compatible authentication integration.
  - cookie persistence approach.
  - reusable UI/UX + BFF design for React Native adaptation.
  - CI testing strategy.
