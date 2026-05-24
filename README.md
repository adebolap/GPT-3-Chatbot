# Cortex — Your AI Memory Layer

A browser extension that injects your context into every new LLM conversation and remembers everything you've ever discussed — across ChatGPT, Claude, Gemini, and more.

## How it works

1. You define a **persona** once (role, context, response style)
2. Cortex **auto-prepends** it to your first message in every new chat
3. Every conversation is **saved locally** (Dexie.js / IndexedDB)
4. Search your entire AI history from the extension popup

## Monorepo structure

```
apps/
  extension/   Plasmo MV3 extension — context injection + local memory
  api/         Legacy Express server (unused — see apps/web/src/app/api)
  web/         Next.js 14 — landing page, auth (Clerk), billing (Stripe)
packages/
  shared/      Shared TypeScript types
```

## Tech stack

| Layer | Tech |
|---|---|
| Extension | Plasmo + React + TypeScript + Dexie.js |
| Auth | Clerk (drop-in, works in extension popup) |
| Billing | Stripe Checkout |
| Web | Next.js 14 on Vercel |
| Local storage | Dexie.js (IndexedDB, no backend needed) |

## Environment variables

### `apps/web/.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=http://localhost:3000
```

### `apps/extension/.env`

```env
PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
PLASMO_PUBLIC_WEB_URL=http://localhost:3000
```

That's it — 6 env vars total, no database setup required.

## Local development

### 1. Set up Clerk

1. Go to [clerk.com](https://clerk.com) → **Create application**
2. Enable **Email** sign-in method
3. Copy **Publishable key** and **Secret key**

### 2. Set up Stripe

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Test mode
2. Create a product (Cortex Pro, €49/year recurring)
3. Copy the **Price ID** and **Secret key**

### 3. Install and run

```bash
npm install

# Terminal 1 — web app + API
# Create apps/web/.env.local first
npm run dev -w @cortex/web
# → http://localhost:3000

# Terminal 2 — extension
# Create apps/extension/.env first
npm run dev -w @cortex/extension
# → apps/extension/.plasmo/chrome-mv3-dev/
```

### 4. Load extension in Chrome

1. `chrome://extensions` → Enable **Developer mode**
2. **Load unpacked** → select `apps/extension/.plasmo/chrome-mv3-dev/`

### 5. Stripe webhook (local)

```bash
stripe listen --forward-to http://localhost:3000/api/stripe-webhook
# Copy the whsec_... secret → STRIPE_WEBHOOK_SECRET in .env.local
```

## Deploy to Vercel

1. Import repo → set **Root Directory** to `apps/web`
2. Add the 5 `apps/web/.env.local` vars in Vercel dashboard
3. Set `APP_URL` to your Vercel domain
4. Deploy
5. Update Stripe webhook to `https://yourapp.vercel.app/api/stripe-webhook`
6. In Clerk dashboard → **JWT Templates** → set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` redirect URLs to your Vercel domain

## Free vs Pro

| | Free | Pro |
|---|---|---|
| Personas | 3 | Unlimited |
| History | 90 days local | Full history + cloud sync |
| Search | Local only | Across all devices |
| Price | €0 | €49/year |

## Roadmap

- [ ] Clerk auth in extension popup (sign in for cloud sync)
- [ ] Supabase cloud sync for Pro conversations
- [ ] Smart recall — surface similar past conversations
- [ ] Team personas — share context across a team
- [ ] Firefox support
