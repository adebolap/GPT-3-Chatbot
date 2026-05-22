# PromptRefiner

A lightweight browser extension that refines rough prompts before sending them to ChatGPT, Claude, Gemini, or any LLM web app.

## Monorepo structure

```
apps/
  extension/   Plasmo MV3 extension (React + TypeScript)
  api/         Express backend (Node.js, TypeScript)
  web/         Next.js 14 marketing + auth + billing site
packages/
  shared/      Shared TypeScript types
```

## MVP features

- **Site adapters** for ChatGPT, Claude, Gemini + generic fallback.
- **Floating "✦ Refine" button** injected near the detected prompt input.
- **7 refinement modes**: Default · Professional · Accuracy-first · Technical/Coding · Marketing · Shorter · Deep Research.
- **Modal** with Original / Refined side-by-side view, plus **Replace**, **Copy**, and **Cancel** actions.
- **Mode picker** in the modal and as a default-mode setting in the extension popup.
- **Free tier**: 10 refinements/month (tracked per device ID for anonymous users, per Supabase user for signed-in users).
- **Pro tier** (€29/year early-bird): unlimited refinements, saved styles, custom default mode — via Stripe Checkout.
- **Stripe webhook** that updates `subscription_status` in Supabase on payment events.
- **Secret masking** before any model call (API keys, passwords, tokens, card numbers).
- **No hardcoded secrets** — all from `.env` files.

## Supabase schema

Run in your Supabase SQL editor:

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

## Environment variables

> Never commit `.env` files — they are git-ignored.

### `apps/api/.env`

```env
OPENAI_API_KEY=sk-...
REFINER_MODEL=gpt-4.1-mini          # optional, default gpt-4.1-mini
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=http://localhost:3000
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # service role key (keep secret)
PORT=8787                            # optional, default 8787
```

### `apps/extension/.env`

```env
PLASMO_PUBLIC_API_BASE_URL=http://localhost:8787
PLASMO_PUBLIC_WEB_URL=http://localhost:3000
PLASMO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
PLASMO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=http://localhost:8787
```

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Run the API

```bash
# Create apps/api/.env first
npm run dev -w @promptrefiner/api
# API listens on http://localhost:8787
```

### 3. Run the extension

```bash
# Create apps/extension/.env first
npm run dev -w @promptrefiner/extension
# Plasmo outputs to apps/extension/.plasmo/chrome-mv3-dev/
```

### 4. Load the extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select `apps/extension/.plasmo/chrome-mv3-dev/`

### 5. Run the web app (optional)

```bash
# Create apps/web/.env.local first
npm run dev -w @promptrefiner/web
# App runs at http://localhost:3000
```

## Stripe local testing

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to http://localhost:8787/api/stripe-webhook
# Copy the webhook signing secret into STRIPE_WEBHOOK_SECRET
```

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/refine` | optional JWT | Refine a prompt |
| POST | `/api/checkout` | optional JWT | Create Stripe Checkout session |
| POST | `/api/stripe-webhook` | Stripe signature | Handle subscription events |
| GET | `/api/me` | optional JWT | Current user profile |
| GET | `/api/usage` | optional JWT | Monthly refinement count |

## Refinement response shape

```json
{
  "refinedPrompt": "...",
  "detectedIntent": "coding | research | writing | analysis | general",
  "missingContext": ["..."],
  "confidence": "high | medium | low"
}
```

## Security notes

- Raw prompts are **not persisted** by default.
- Secrets (API keys, passwords, tokens, card-like numbers) are masked before model calls.
- Use a production-grade distributed rate limiter (Redis / Upstash) before public launch.
- Add Supabase Row Level Security (RLS) policies to `usage_events` and `prompt_preferences`.
- Verify `stripe-signature` header on every webhook — already implemented.

## Roadmap / next steps

- Add mode picker persistence via `prompt_preferences` table.
- Add saved prompt styles for Pro users.
- Add RLS policies to Supabase tables.
- Ship to Chrome Web Store.
- Add Firefox / Edge support (Plasmo MV2 target).
