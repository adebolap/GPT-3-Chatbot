# Product direction status

The product has pivoted from PromptRefiner to **Contxt — Your AI Memory Layer**.

## Current product

Contxt is a browser extension that:

1. Stores a user's persona locally.
2. Auto-prepends that persona to the first message in each new LLM chat.
3. Saves conversation memory locally with Dexie.js / IndexedDB.
4. Lets the user search AI history from the extension popup.

## What changed

- Removed prompt-refinement as the core workflow.
- Removed OpenAI refinement as a required backend dependency.
- Replaced Stripe billing direction with Lemon Squeezy.
- Reframed Supabase as Pro cloud sync only.
- Reframed `apps/api` as legacy/unused for the MVP.

## Keep building next

- Clerk auth in the extension popup for Pro sync.
- Supabase sync for personas and conversations.
- Smart recall that surfaces relevant past conversations before the user sends a message.
- Team personas and shared context.
