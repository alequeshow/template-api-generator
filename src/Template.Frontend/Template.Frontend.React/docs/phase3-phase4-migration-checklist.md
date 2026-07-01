# Phase 3 and 4 Migration Checklist

## Phase 3 — Auth + BFF

- [x] Implement Next.js BFF auth routes (`/api/bff/auth/login`, `/refresh`, `/logout`, `/userinfo`)
- [x] Implement secure cookie persistence for access/refresh token handling
- [x] Implement CSRF validation for mutating BFF routes
- [x] Add middleware-based auth guard and login redirect flow
- [x] Add session query + login/logout orchestration with TanStack Query

## Phase 4 — Feature Migration

- [x] Migrate `Status` list page
- [x] Migrate `Status` create page
- [x] Migrate `Status` edit page
- [x] Migrate `Status` delete page
- [x] Migrate auth-related user context page (`/auth`)
- [x] Migrate dashboard cards to backend/session-driven data

## Rollout and parity checks

- [x] Protected routes verified through middleware (`/`, `/auth`, `/status`)
- [x] SmartAdmin navigation updated for migrated feature routes
- [x] Basic parity behavior preserved for status CRUD flow
- [x] Added component/unit tests and e2e auth-guard coverage
