# Branch integration notes: `codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o`

Requested branch: `codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o`

## Current repository limitation

This checkout has no `origin` remote configured, so this branch cannot be fetched or inspected here.

Observed commands:

```bash
git branch -a
# only local branch: work

git remote -v
# no remotes configured

git fetch origin codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o
# fatal: 'origin' does not appear to be a git repository
```

## Product-direction warning

The branch name indicates it is likely from the old **PromptRefiner browser extension** direction. The current protected direction is **Contxt — Your AI Memory Layer**.

Default conflict policy:

- Keep Contxt files and package names (`@contxt/*`).
- Do not restore PromptRefiner prompt-refinement/OpenAI routes unless explicitly requested.
- Keep persona injection, Dexie local memory, Clerk, Lemon Squeezy, and Supabase Pro sync.
- If the branch includes useful generic fixes (tooling, styles, tests), port those into the Contxt equivalents rather than restoring old product behavior.

## Fast path if this is only the old PromptRefiner branch

If you are on the Contxt PR branch and merged this PromptRefiner branch/base into it, keep the Contxt side for the known conflicted files:

```bash
scripts/resolve-contxt-conflicts.sh --dry-run
scripts/resolve-contxt-conflicts.sh --side ours
git diff --cached
git diff --check
```

If you are on the base branch and merging the Contxt PR into it, the side is reversed:

```bash
scripts/resolve-contxt-conflicts.sh --side theirs
```

## Files to drop if they come only from PromptRefiner

These old PromptRefiner files should generally remain deleted in the Contxt product unless you intentionally reintroduce prompt refinement:

- `apps/extension/contents/refiner.tsx`
- `apps/extension/src/lib/api.ts`
- OpenAI `/api/refine` route logic
- Stripe checkout/webhook logic
- `@promptrefiner/*` package names

## Manual validation after resolution

```bash
git diff --check
npm install
npm run build:web
npm run build:extension
npm run smoke:web
```

If dependency installation is blocked by registry/network policy, record the failure and run the commands in CI or a normal local environment.
