# PromptRefiner MVP

A Chrome extension that injects a **✨ Refine** button into ChatGPT, Claude.ai, and Gemini, sending the draft prompt to a local refinement API before you hit Send.

## Monorepo structure

```
apps/
  extension/   – Plasmo MV3 Chrome extension (TypeScript)
  api/         – Express API (refinement + billing stubs)
  web/         – Web app placeholder
packages/
  shared/      – Shared TypeScript types
```

## What the MVP does

- Detects the textarea / contenteditable input on **ChatGPT**, **Claude.ai**, and **Gemini**
- Injects a floating **✨ Refine** button that tracks the input as you scroll
- Click flow: read draft → `POST /api/refine` → show side-by-side modal → Replace / Copy / Cancel
- Site-specific adapters handle React-controlled inputs correctly (no cursor/event loss)
- Refinement response: `refinedPrompt`, `detectedIntent`, `missingContext`, `confidence`
- Free-tier guard: 10 refinements per user-id in-memory counter
- Stripe checkout endpoint scaffold for paid plans
- Secrets (API keys, tokens, card numbers) are redacted before being sent to the LLM
- Rate limit: 30 calls / minute per IP+user-id pair
- `/api/health` endpoint for uptime checks

---

## Quick start

### 1. Install dependencies

```bash
npm install          # from repo root — installs all workspaces
```

### 2. Configure environment variables

**`apps/api/.env`**
```bash
OPENAI_API_KEY=sk-...
REFINER_MODEL=gpt-4o-mini          # default; change to gpt-4o for better quality
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_...
```

**`apps/extension/.env`** (optional — defaults to `http://localhost:8787`)
```bash
PLASMO_PUBLIC_API_BASE_URL=http://localhost:8787
```

### 3. Start the API

```bash
npm run dev:api      # from repo root  →  http://localhost:8787
```

### 4. Build the extension

```bash
npm run build:extension   # from repo root
# output: apps/extension/build/chrome-mv3-prod/
```

Or run in watch / dev mode:
```bash
npm run dev:extension     # from repo root
# output: apps/extension/build/chrome-mv3-dev/
```

### 5. Load the extension in Chrome

1. Open **chrome://extensions**
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the build folder:
   - Production build: `apps/extension/build/chrome-mv3-prod/`
   - Dev build (watch mode): `apps/extension/build/chrome-mv3-dev/`
5. Navigate to `https://chatgpt.com`, `https://claude.ai`, or `https://gemini.google.com`
6. The **✨ Refine** button should appear above the prompt input

---

## Build a distributable zip

```bash
npm run build:extension
npm run package -w @promptrefiner/extension
# zip is written to apps/extension/build/
```

---

## Architecture decisions

### Content script placement
Plasmo v0.90.x sets `PLASMO_SRC_DIR` to `src/` if that directory exists; content scripts must therefore live in `src/contents/`, **not** at the project root `contents/`.

### Manifest configuration (Plasmo v0.90.x)
`defineConfig` is **not** exported by `plasmo@0.90.5`. The `manifest` overrides (`permissions`, `host_permissions`) must be placed in `package.json` under the `"manifest"` key, not in `plasmo.config.ts`.

### React-controlled inputs
ChatGPT and Claude use React-controlled contenteditable elements. Setting `element.textContent = ...` bypasses React's virtual DOM and breaks the editor. The adapter uses `document.execCommand("insertText")` (with a `textContent` fallback) to keep React's event system intact.

### Button positioning
The Refine button uses `position: fixed` and re-positions itself on `scroll` and `resize` events so it always stays aligned with the input as the page re-flows.

---

## Supabase schema (target)

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

---

## Security notes

- No hardcoded API keys — environment variables only
- Raw prompt storage is **off** by default (`allow_prompt_history = false`)
- Add distributed rate limiting (Redis / Upstash) before going to production
- Add Stripe webhook signature validation before going to production
- All API errors are caught and returned as structured JSON; no stack traces leak to the client
