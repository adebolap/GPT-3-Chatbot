# Change safety policy

This repo now follows the user's **Contxt** product direction. Do not replace or rewrite user-owned product work unless the user explicitly asks for that specific change.

## Before changing existing work

1. Inspect the current files and git status first.
2. Preserve the user's Contxt direction from `README.md`.
3. Prefer additive changes over rewrites.
4. If a change would remove or replace existing behavior, document exactly what is being removed and why before making the edit.
5. Do not reintroduce the old PromptRefiner direction unless the user explicitly requests it.

## Current protected product assumptions

- Product name: **Contxt — Your AI Memory Layer**.
- Extension behavior: persona injection and local conversation memory.
- Local storage: Dexie.js / IndexedDB.
- Web app: Next.js landing, Clerk auth direction, Lemon Squeezy billing direction.
- Pro sync: Supabase-backed cloud sync direction.

## What happened in the last scaffold

The previous implementation replaced the old GPT-3 chatbot / PromptRefiner scaffold with a new Contxt monorepo based on the README direction supplied by the user. Future work should not overwrite additional user changes; it should build on this Contxt baseline.
