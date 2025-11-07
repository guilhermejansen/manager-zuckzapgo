# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts the Next.js App Router; `(admin)` and `(user)` drive the two dashboards, `api/` proxies requests, and `actions/` exposes server actions.
- Shared UI, state, and types live in `components/`, `contexts/`, `hooks/`, and `types/`. Keep reusable widgets in `components/ui`, feature-specific pieces next to their consumers.
- `lib/` wraps API clients, queue helpers, Prisma accessors, and logging; workers load from `lib/queue` and ship compiled code to `dist/workers`. `prisma/` manages the schema, `public/` holds assets, `scripts/` supplies ops tasks, and `zuckzapgo-private/` is the Go dispatcher that shares the same queues.

## Build, Test, and Development Commands
- Install with `npm install` and populate `.env.local` before running anything.
- `npm run dev` boots the Next.js app; `npm run workers` starts the BullMQ workers with `tsx`.
- `npm run build` produces the production bundle and triggers worker transpilation; `npm run start` serves the compiled output.
- Quality gates: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`, and the combined `npm run check`.
- Data and back-end: `npx prisma migrate dev` for new schema changes, `go test ./...` from `zuckzapgo-private/` when queue contracts shift.

- Prettier enforces 2-space indentation, double quotes, no semicolons, 100-character lines, and import sorting—format on save.
- ESLint expects `_` prefixes for intentional unused variables; `any` is tolerated but strongly prefer typed models.
- React components and hooks use PascalCase filenames and `useSomething` naming. Route folders under `app/` remain kebab-case, queue helpers use camelCase.
- Tailwind utilities stay inline until repeated, then migrate the pattern into `components/ui`.

## Testing Guidelines
- Run `npm run check` before every PR. Extend integration or end-to-end coverage when changing critical flows such as login, campaign editors, or queue dispatch.
- Keep API fixtures current in `lib/api`; when queue contracts shift, pair with the Go team and adjust `global_dispatcher_test.go`.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat(campaigns): add schedule controls`); scopes map to top-level folders (`auth`, `lib`, `ui`, `prisma`, `workers`, etc.). Add a `BREAKING CHANGE:` footer when behaviour changes.
- Before pushing, run `npm run check`, outstanding migrations, and `go test ./...` if shared queue code moved. Attach UI screenshots for visual updates and call out worker/back-end impacts.
- Link the issue or ticket, describe manual validation, and split large changes into reviewable chunks. Draft early when touching shared contracts.
