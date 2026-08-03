# Anilyst

Anime tracking platform — mark what you've watched, browse the catalog, and get recommendations.

Built as a **pnpm + Turborepo monorepo** with a Next.js frontend and Express API. Anime metadata comes from the [AniList GraphQL API](https://docs.anilist.co/); your database only stores user and library data.

## Features (planned)

- Track anime with statuses: Watching, Completed, Dropped, Paused, Plan to Watch
- Browse / search the full catalog (trending, seasonal, popular, genres)
- Personalized recommendations
- Social, analytics, and AI features in later phases

## Monorepo structure

```
Anilyst/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── api/          # Express + TypeScript backend
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── validation/   # Shared Zod schemas
│   ├── config/       # Shared ESLint / TS configs
│   └── utils/        # Shared helpers
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Express, TypeScript, Prisma |
| Data | PostgreSQL, Redis |
| Catalog | AniList GraphQL |
| Tooling | Turborepo, pnpm, Docker |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+
- Docker (for PostgreSQL and Redis)

## Getting started

```bash
# Install dependencies
pnpm install

# Start Postgres + Redis
docker compose up -d

# Run all apps in development
pnpm dev
```

| App | URL |
|-----|-----|
| Web | http://localhost:3000 |
| API | http://localhost:4000 |

Copy env examples before running:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web + api in watch mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint the workspace |
| `pnpm typecheck` | Type-check the workspace |
| `pnpm format` | Format with Prettier |

## Development roadmap

| Phase | Focus |
|-------|--------|
| 0 | Monorepo foundation (current) |
| 1 | Auth + backend API + AniList client |
| 2 | Frontend shell + design system |
| 3 | Anime catalog (search / discovery / detail) |
| 4 | User library (watchlist, ratings, progress) |
| 5 | Recommendations |
| 6–10 | Social, analytics, AI, polish, deploy |

See `Anilyst_Monorepo_Project_Roadmap.pdf` for the full plan.

## License

Private / unpublished — all rights reserved.
