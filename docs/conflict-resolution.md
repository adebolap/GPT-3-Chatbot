# Contxt conflict resolution guide

The GitHub conflict list shows the Contxt scaffold conflicting across app, extension, web, docs, and package files. Because this environment has no `origin` remote configured, the actual remote branch cannot be merged here. Use this guide in the checkout where the PR conflict exists.

## Fast path: keep the Contxt PR version

If you are on the PR branch and have just merged the base branch into it:

```bash
git status
scripts/resolve-contxt-conflicts.sh --dry-run
scripts/resolve-contxt-conflicts.sh --side ours
git diff --cached
git diff --check
npm install
npm run build:web
npm run build:extension
npm run smoke:web
git commit
```

## If you are on the base branch

If you are on the base branch and merging the PR branch into it, the sides are reversed. To keep the incoming Contxt PR version, run:

```bash
scripts/resolve-contxt-conflicts.sh --side theirs
```

## Manual review checklist

After resolving, verify these files preserve the Contxt direction:

- `README.md` keeps `# Contxt — Your AI Memory Layer`.
- `package.json` uses `@contxt/web` and `@contxt/extension` workspace scripts.
- `apps/extension/*` keeps persona injection, Dexie local memory, popup search, and ChatGPT/Claude/Gemini adapters.
- `apps/web/*` keeps Clerk, Lemon Squeezy, Supabase sync routes, and `/api/health`.
- `packages/shared/src/types.ts` keeps `Persona`, `ConversationMemory`, and `SubscriptionEntitlements`.
- `supabase-schema.sql` keeps profiles/personas/conversations plus Lemon Squeezy subscription columns.

## Do not blindly resolve these conflicts in GitHub's web editor

These are product-direction conflicts, not formatting conflicts. Resolve locally so you can run checks and inspect staged diffs before committing.
