# Anilyst

Track the anime you watch, browse the full catalog, and get personalized recommendations — all in one place.

Anilyst is a personal anime-tracking app. You keep a list of anime with a status (Watching, Completed, Dropped, Paused, Plan to Watch), record your progress and score, and discover new titles. Anime metadata comes from the [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/) — the database only stores your account and your tracked entries.

> **Status:** Early development. The monorepo, database, and schema are set up. App features are being built in phases (see the roadmap below).

---

## Tech stack

- **Monorepo:** [Turborepo](https://turbo.build/) + [pnpm workspaces](https://pnpm.io/workspaces)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- **Database:** [PostgreSQL](https://www.postgresql.org/) on [Neon](https://neon.tech/)
- **ORM:** [Prisma 7](https://www.prisma.io/)
- **Anime data:** AniList GraphQL API

## Project structure

```
anilyst/
├── apps/
│   └── web/              # Next.js app (UI + API routes)
├── packages/
│   ├── db/               # Prisma schema, client, and migrations
│   ├── ui/               # Shared React components
│   ├── eslint-config/    # Shared ESLint config
│   └── typescript-config/# Shared tsconfig
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Prerequisites

- **Node.js** 20 or newer
- **pnpm** 9 or newer (`npm install -g pnpm`)
- A **PostgreSQL** database (a free [Neon](https://neon.tech/) project works well)

## Quick start

```bash
# 1. Clone the repo
git clone https://github.com/Deepansh3942/Anilyst.git
cd Anilyst

# 2. Install dependencies
pnpm install

# 3. Set up your environment
cp packages/db/.env.example packages/db/.env
# then open packages/db/.env and paste your database connection string

# 4. Create the database tables
cd packages/db
pnpm exec prisma migrate dev
cd ../..

# 5. Start the dev server
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Set these in `packages/db/.env`. Never commit this file — it is already git-ignored.

| Variable       | Description                                      | Required |
|----------------|--------------------------------------------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (Neon pooled URL)   | Yes      |

An example `DATABASE_URL` from Neon looks like:

```
postgresql://<user>:<password>@<host>-pooler.<region>.aws.neon.tech/<db>?sslmode=require
```

## Database

The schema lives in `packages/db/prisma/schema.prisma`. Two models:

- **User** — a person using Anilyst (id, email, name, timestamps).
- **TrackedAnime** — one anime a user is tracking. Stores the AniList ID (not the title or artwork — those are fetched from AniList), plus status, progress, score, and notes.

Useful commands (run from `packages/db`):

```bash
pnpm exec prisma migrate dev     # create/apply migrations in development
pnpm exec prisma generate        # regenerate the Prisma client
pnpm exec prisma studio          # open a visual database browser
```

---

## Roadmap

**Phase 1 — Core tracking (in progress)**
- [ ] Authentication (sign in)
- [ ] Search AniList for a title
- [ ] Add an anime to your list
- [ ] "My List" page filtered by status, with progress editing

**Phase 2 — Catalog browse & search**
- [ ] Trending, seasonal, and popular pages
- [ ] Genre filtering
- [ ] Anime detail pages

**Phase 3 — Recommendations**
- [ ] Rule-based recommendations from your highly-rated anime

**Phase 4 — Social, analytics & AI**
- [ ] Activity feed and following
- [ ] Watch-time and genre dashboards
- [ ] AI-powered search and recommendations

---

## License

Personal project. All rights reserved (for now).