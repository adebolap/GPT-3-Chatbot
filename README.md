# PromptRefiner MVP

PromptRefiner is a lightweight browser extension that refines rough prompts before sending them to ChatGPT, Claude, Gemini, or other LLM web apps.

## Monorepo structure

- `apps/extension`: Plasmo extension (MV3, React + TypeScript)
- `apps/api`: Express API for refinement, checkout, usage
- `apps/web`: minimal web shell for auth/billing UI
- `packages/shared`: shared TypeScript types

## MVP features implemented

- Site adapters for ChatGPT, Claude, Gemini, plus generic fallback.
- Floating **Refine** button injected near detected prompt input.
- Modal with **Original** and **Refined** text plus **Replace prompt**, **Copy refined prompt**, and **Cancel**.
- `/api/refine` endpoint with prompt-only rewrite behavior and JSON response shape.
- Refinement modes scaffolded and passed to backend.
- Free-tier usage guard (10 refinements/month-like counter scaffold per user id header).
- Stripe Checkout endpoint (`/api/checkout`) for annual subscription in test mode.
- Stripe webhook endpoint scaffold (`/api/stripe-webhook`) for subscription updates.
- Secret masking before model call.
- No hardcoded API keys (all from env).

## Environment variables

Create `.env` files (never commit):

### `apps/api/.env`

- `OPENAI_API_KEY`
- `REFINER_MODEL` (optional, default `gpt-4.1-mini`)
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `APP_URL` (e.g. `http://localhost:3000`)
- `STRIPE_WEBHOOK_SECRET` (for future signature verification)

### `apps/extension/.env`

- `PLASMO_PUBLIC_API_BASE_URL` (e.g. `http://localhost:8787`)

### `apps/web/.env.local`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase schema

```sql
create table users (
  id uuid primary key,
  email text not null unique,
  stripe_customer_id text,
  subscription_status text default 'free',
  plan text default 'free',
  created_at timestamptz default now()
);

create table usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  refinement_count int not null default 0,
  month text not null,
  created_at timestamptz default now()
);

create table prompt_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  default_mode text default 'default',
  custom_style_instruction text,
  allow_prompt_history boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## Local run

1. Install deps:
   - `npm install`
2. Run API:
   - `npm run dev -w @promptrefiner/api`
3. Run extension:
   - `npm run dev -w @promptrefiner/extension`
4. Load the unpacked extension from the generated Plasmo build folder in Chromium.

## Security notes

- Raw prompts are not persisted by default.
- Add optional setting (`allow_prompt_history`) before storing history.
- `/api/refine` masks obvious API keys, passwords, tokens, and card-like numbers.
- Add a production-grade distributed rate limiter (Redis/Upstash) before launch.

## Next steps

- Add proper Supabase JWT auth middleware for `/api/*`.
- Persist usage counters by month in `usage_events` table.
- Verify Stripe webhook signatures and update `users.subscription_status`.
- Add mode picker UI in extension modal.
- Add saved prompt styles and custom default mode controls.
