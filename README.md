# Contxt — Your AI Memory Layer

A browser extension that injects your context into every new LLM conversation and remembers everything you've ever discussed — across ChatGPT, Claude, Gemini, and more.

## How it works

1. You define a **persona** once (role, context, response style)
2. Contxt **auto-prepends** it to your first message in every new chat
3. Every conversation is **saved locally** (Dexie.js / IndexedDB)
4. Search your entire AI history from the extension popup

## Monorepo structure

```
apps/
  extension/   Plasmo MV3 extension — context injection + local memory
  api/         Legacy Express server (unused — see apps/web/src/app/api)
  web/         Next.js 14 — landing page, auth (Clerk), billing (Lemon Squeezy)
packages/
  shared/      Shared TypeScript types
```

## Tech stack

| Layer | Tech |
|---|---|
| Extension | Plasmo + React + TypeScript + Dexie.js |
| Auth | Clerk (drop-in, works in extension popup) |
| Billing | Lemon Squeezy (merchant of record — handles EU VAT automatically) |
| Web | Next.js 14 on Vercel |
| Local storage | Dexie.js (IndexedDB, no backend needed) |

## Environment variables

### `apps/web/.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_LS_CHECKOUT_URL=https://yourstore.lemonsqueezy.com/checkout/buy/VARIANT_ID
LEMON_SQUEEZY_WEBHOOK_SECRET=whsec_...
APP_URL=http://localhost:3000
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### `apps/extension/.env`

```env
PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
PLASMO_PUBLIC_WEB_URL=http://localhost:3000
```

The Supabase vars are only required for Pro cloud sync (see "Set up Supabase" below).

## Local development

### 1. Set up Clerk

1. Go to [clerk.com](https://clerk.com) → **Create application**
2. Enable **Email** sign-in method
3. Copy **Publishable key** and **Secret key**

### 2. Set up Supabase (Pro cloud sync)

1. Go to [supabase.com](https://supabase.com) → **New project**
2. In **SQL Editor**, paste and run `supabase-schema.sql` from the repo root
3. Go to **Project Settings → API**
4. Copy **Project URL** → `SUPABASE_URL`
5. Copy **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set up Lemon Squeezy

1. [app.lemonsqueezy.com](https://app.lemonsqueezy.com) → Create a store
2. **Products** → New product → Contxt Pro, €49/year recurring subscription
3. Copy the **Variant checkout URL** → `NEXT_PUBLIC_LS_CHECKOUT_URL`
4. **Settings → Webhooks** → Add webhook pointing at your URL
5. Enable events: `order_created`, `subscription_cancelled`, `subscription_payment_failed`
6. Copy the **Signing secret** → `LEMON_SQUEEZY_WEBHOOK_SECRET`

### 4. Install and run

```bash
npm install

# Terminal 1 — web app + API
# Create apps/web/.env.local first
npm run dev -w @contxt/web
# → http://localhost:3000

# Terminal 2 — extension
# Create apps/extension/.env first
npm run dev -w @contxt/extension
# → apps/extension/.plasmo/chrome-mv3-dev/
```

### 5. Load extension in Chrome

1. `chrome://extensions` → Enable **Developer mode**
2. **Load unpacked** → select `apps/extension/.plasmo/chrome-mv3-dev/`

### 6. Lemon Squeezy webhook (local)

Use [ngrok](https://ngrok.com) or similar to expose your local server:

```bash
ngrok http 3000
# Use https://xxx.ngrok.io/api/lemon-webhook as the webhook URL in LS dashboard
```

## Deploy to Vercel

1. Import repo → set **Root Directory** to `apps/web`
2. Add the 4 `apps/web/.env.local` vars in Vercel dashboard
3. Set `APP_URL` to your Vercel domain
4. Deploy
5. Update Lemon Squeezy webhook URL to `https://yourapp.vercel.app/api/lemon-webhook`
6. In Clerk dashboard → **JWT Templates** → set redirect URLs to your Vercel domain

## Free vs Pro

| | Free | Pro |
|---|---|---|
| Personas | 3 | Unlimited |
| History | 90 days local | Full history + cloud sync |
| Search | Local only | Across all devices |
| Price | €0 | €49/year |

## Roadmap

- [ ] Clerk auth in extension popup (sign in for cloud sync)
- [x] Supabase cloud sync for Pro conversations
- [ ] Smart recall — surface similar past conversations
- [ ] Team personas — share context across a team
- [ ] Firefox support
