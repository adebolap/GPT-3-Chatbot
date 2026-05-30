# Website check fix list

Test target: `https://contxt-delta.vercel.app/`

Last checked: 2026-05-30 UTC

## Verification status

The deployed site still needs to be verified from a normal browser or CI runner. From this environment, `curl -I -L https://contxt-delta.vercel.app/` is blocked by the proxy with `CONNECT tunnel failed, response 403`, so the live UI cannot be confirmed here.

## Fixed in this pass

1. Added Clerk provider/middleware scaffolding for the web app.
2. Replaced trusted `x-clerk-user-id` sync headers with server-side Clerk `auth()` checks.
3. Added Supabase profile upsert and Pro-plan gating for cloud sync routes.
4. Added Lemon Squeezy `X-Signature` HMAC-SHA256 verification against the raw request body.
5. Added environment status reporting to `/api/health`.
6. Added popup entry point to open the web app for sign-in / Pro sync management.
7. Added persona update broadcasts so open LLM tabs can receive saved persona changes.
8. Added local 90-day history pruning and a free-plan persona limit constant in the Dexie layer.
9. Added `npm run smoke:web` for landing and health endpoint smoke checks.

## Still requires real-world validation

1. Confirm the landing page loads at `/` on Vercel.
2. Confirm `/api/health` returns `{ "ok": true, "service": "contxt-web" }` on Vercel.
3. Test ChatGPT, Claude, and Gemini manually to ensure context is injected before the host app sends the first message.
4. Validate contenteditable updates for React-managed editors on all supported LLM apps.
5. Trigger Lemon Squeezy test webhooks from the dashboard and confirm profile plan updates in Supabase.
6. Test Clerk extension sign-in / token handoff once the extension popup auth UX is finalized.
