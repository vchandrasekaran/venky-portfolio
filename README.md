# Venky Portfolio

Next.js portfolio site for BI, analytics, case studies, and sports-tech projects.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The default local dev script starts:

- the Next.js app
- the FastAPI agent service on port `8787`

Public deployment is content-only by default. The website chat is safe to leave on because it answers only from local site content and does not call Google, ADK, or Snowflake services.

## Main routes

- `/`
- `/projects`
- `/projects/trucklexa`
- `/projects/pantry-coach`
- `/projects/cricket-analyst-raiders`
- `/projects/ai-analyst`
- `/projects/text-to-sql-cortex`
- `/experience`
- `/sports`
- `/contact`

## Environment variables

Copy `.env.example` to `.env.local` for local frontend work and `.env` for local backend work as needed.

Public-safe defaults:

- `NEXT_PUBLIC_SITE_URL`
- `ENABLE_PUBLIC_DEMOS=false`
- `NEXT_PUBLIC_ENABLE_LIVE_DEMOS=false`

The website chat does not need any API key.

Only needed if you later re-enable private demos:

- `GOOGLE_API_KEY`
- `ADK_URL`
- `ADK_PANTRY_URL`
- optional Snowflake credentials for private Text-to-SQL

## Deployment

See [DEPLOY.md](./DEPLOY.md).

Recommended public deployment:

- Vercel for the Next.js site only

Optional later:

- Render for the FastAPI agent backend if you decide to re-enable private demos

## Retrieval index

The public website chat now runs from local portfolio content and markdown files only.
