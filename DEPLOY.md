# Deploy

## Recommended public deployment

Deploy only the Next.js site to Vercel.

The public site is configured to be content-only by default:

- paid AI demos stay hidden
- the website chat uses only local site content
- no Google API key, ADK backend, or Snowflake connection is required for the public site

## Vercel environment variables

- `NEXT_PUBLIC_SITE_URL`
- `ENABLE_PUBLIC_DEMOS=false`
- `NEXT_PUBLIC_ENABLE_LIVE_DEMOS=false`

## Deploy the frontend on Vercel

1. Import the same repo into Vercel.
2. Vercel should auto-detect it as a Next.js project.
3. Add environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
   - `ENABLE_PUBLIC_DEMOS=false`
   - `NEXT_PUBLIC_ENABLE_LIVE_DEMOS=false`
4. Deploy.

## Verify after publish

Check these routes:

- `/`
- `/projects`
- `/projects/cricket-analyst-raiders`
- `/experience`
- `/sports`
- `/contact`

These API routes should stay blocked on the public site:

- `/api/agents/pantry`
- `/api/text-to-sql`

Expect `403` responses unless you explicitly re-enable demos.

The `/api/adk` route is different: it is safe to expose publicly because it answers only from website content and does not call any paid external service.

## Recommended order

1. Push the repo to GitHub or GitLab
2. Import it into Vercel
3. Set the three public-safe environment variables above
4. Deploy
5. Attach your custom domain in Vercel

## Optional later: private demos

If you later want the AI assistant, pantry flow, or live Text-to-SQL back in a protected environment, this repo already includes the backend deployment files:

- `requirements.txt`
- `render.yaml`
- `agent_service.py`

At that point you would:

1. Deploy the FastAPI service to Render
2. Set `GOOGLE_API_KEY` on the backend
3. Set `ADK_URL` and `ADK_PANTRY_URL` on Vercel
4. Add any Snowflake credentials required for the private Text-to-SQL flow
5. Flip `ENABLE_PUBLIC_DEMOS` and `NEXT_PUBLIC_ENABLE_LIVE_DEMOS` to `true`
