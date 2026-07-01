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
