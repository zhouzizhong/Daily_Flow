# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run lint             # Run ESLint

# Database (Cloudflare D1)
npm run db:generate      # Generate Drizzle migrations from schema changes
npm run db:migrate       # Apply migrations locally
npm run db:migrate:prod  # Apply migrations to production D1
npm run db:seed          # Seed local database

# Deployment (Cloudflare Pages)
npm run deploy           # Build + deploy to Cloudflare Pages
```

## Architecture

**Daily Flow** is a personal productivity dashboard (habits, todos, meals, schedule) built with Next.js App Router, deployed to Cloudflare Pages with D1 SQLite.

### Key patterns

- **Database access**: `src/lib/db/index.ts` exposes `getDB` which returns a Drizzle client bound to the Cloudflare D1 binding (`DB`). In local dev, it uses `.dev/d1.sqlite` via `better-sqlite3`.
- **Auth**: Better Auth (`src/lib/auth/auth.ts`) with email/password, backed by Drizzle adapter on the same D1 database. Session token stored in cookie `better-auth.session_token`.
- **Route protection**: `src/middleware.ts` guards `/, /meals, /schedule, /habits, /todos` — redirects unauthenticated users to `/login`.
- **Server Actions**: Live in `src/actions/`. Auth actions in `auth-actions.ts`.
- **Schema**: All tables defined in `src/lib/db/schema.ts` — `users`, `sessions`, `verifications`, `meals`, `dailyMeals`, `dailyPlans`, `todos`, `habits`, `habitLogs`. Tags/ingredients/steps stored as serialized text (JSON strings).
- **UI**: shadcn/ui components in `src/components/ui/`, feature components in `src/components/{dashboard,habits,meals,todos}/`.
- **Path alias**: `@/*` maps to `src/*`.

### Environment variables

Required in `.env.local` (see `.env.example`):
- `BETTER_AUTH_SECRET` — min 32 chars
- `BETTER_AUTH_URL` — base URL (e.g. `http://localhost:3000`)

For Wrangler, set D1 bindings in `.dev.vars` and `wrangler.toml` (`database_id` must be set for production).

### Deployment notes

See `DEPLOYMENT.md` for full Cloudflare Pages setup. The `output: 'standalone'` in `next.config.ts` and `nodejs_compat` flag in `wrangler.toml` are required for edge compatibility.
