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

-- Anonymous (device-based) usage — no FK to users
create table device_usage (
  device_id text not null,
  month text not null,
  refinement_count int not null default 0,
  primary key (device_id, month)
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

### `apps/web/.env.local` (web app + API routes)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # service role — never expose client-side

# OpenAI
OPENAI_API_KEY=sk-...
REFINER_MODEL=gpt-4.1-mini          # optional

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL (set to your Vercel domain in production)
APP_URL=http://localhost:3000
```

### `apps/extension/.env`

```env
PLASMO_PUBLIC_API_BASE_URL=http://localhost:3000   # points to Next.js app
PLASMO_PUBLIC_WEB_URL=http://localhost:3000
PLASMO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
PLASMO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### `apps/api/.env` (only needed if running the standalone Express server)

```env
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=http://localhost:3000
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Run the web app (web UI + all API routes)

```bash
# Create apps/web/.env.local first
npm run dev -w @promptrefiner/web
# App + API runs at http://localhost:3000
```

### 3. Run the extension

```bash
# Create apps/extension/.env first (PLASMO_PUBLIC_API_BASE_URL=http://localhost:3000)
npm run dev -w @promptrefiner/extension
# Plasmo outputs to apps/extension/.plasmo/chrome-mv3-dev/
```

### 4. Load the extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select `apps/extension/.plasmo/chrome-mv3-dev/`

## Stripe local testing

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to http://localhost:3000/api/stripe-webhook
# Copy the webhook signing secret into STRIPE_WEBHOOK_SECRET in apps/web/.env.local
```

## Deploy to Vercel

The `apps/web` Next.js app hosts both the marketing site and all API routes — one Vercel project.

### 1. Import the repo

Go to vercel.com → **Add New Project** → import `adebolap/GPT-3-Chatbot`.

### 2. Set the root directory

In **Build & Output Settings**, set **Root Directory** to `apps/web`.

### 3. Add environment variables

In **Settings → Environment Variables**, add every key from `apps/web/.env.local` (without the `NEXT_PUBLIC_` variables being secret — those are safe to expose).

Set `APP_URL` to your final Vercel domain (e.g. `https://promptrefiner.vercel.app`).

### 4. Deploy

Vercel auto-deploys on every push to `main`. API routes are available at `https://yourapp.vercel.app/api/*`.

### 5. Update Stripe webhook endpoint

In the Stripe Dashboard → **Webhooks**, point the endpoint to `https://yourapp.vercel.app/api/stripe-webhook`.

### 6. Update extension for production

In `apps/extension/.env`, set:
```env
PLASMO_PUBLIC_API_BASE_URL=https://yourapp.vercel.app
PLASMO_PUBLIC_WEB_URL=https://yourapp.vercel.app
```
Then rebuild: `npm run build -w @promptrefiner/extension`

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
