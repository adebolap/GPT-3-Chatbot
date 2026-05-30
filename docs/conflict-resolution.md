# Contxt conflict resolution guide

The GitHub conflict list shows the Contxt scaffold conflicting across app, extension, web, docs, and package files. Because this environment has no `origin` remote configured, the actual remote branch cannot be merged here. Use this guide in the checkout where the PR conflict exists.



## Immediate GitHub conflict fix

For the exact GitHub warning "This branch has conflicts that must be resolved", use `docs/resolve-github-conflicts-now.md`. It includes both the recommended clean-branch approach and the command-line fallback for the current PR branch.

## Scan all branches available locally

Before resolving conflicts, run the branch scanner to see what branches actually exist in the checkout and whether Git can merge them against the current base without touching the worktree:

```bash
scripts/scan-branch-conflicts.sh HEAD > docs/branch-conflict-scan.md
```

If the scan only lists `work`, then this environment does not contain the GitHub branches shown in the PR UI. Configure/fetch `origin` or provide the patch before attempting resolution.

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


## Your PR screenshot: merge `main` into this PR branch

The screenshot shows GitHub saying: `adebolap wants to merge 1 commit into main from codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o`. That means the practical local fix is to check out the PR branch, merge `main` into it, and keep the PR branch's Contxt files for the known product-direction conflicts.

Run this from a normal clone with `origin` configured:

```bash
git fetch origin
git checkout codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o
git merge origin/main

# Resolve the known conflict list by keeping the PR branch version.
scripts/resolve-contxt-conflicts.sh --dry-run
scripts/resolve-contxt-conflicts.sh --side ours

# Review before committing.
git diff --cached
git diff --check

# If dependencies install in your environment, validate too.
npm install
npm run build:web
npm run build:extension
npm run smoke:web

git commit -m "Resolve main conflicts for Contxt scaffold"
git push origin codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o
```

Why `--side ours` here? During `git merge origin/main` while checked out on the PR branch, `ours` is the PR branch (`codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o`) and `theirs` is `main`. The screenshot's PR body is the Contxt implementation, so for product-owned files you want to keep the PR branch side.

If you instead run the merge while checked out on `main`, use `--side theirs` to keep the incoming PR branch's Contxt files.

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

## PromptRefiner branch conflicts

For conflicts with `codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o`, treat the branch as likely old PromptRefiner work unless inspection proves otherwise. Keep Contxt as the product direction and see `docs/branch-integration-codex-build-mvp-for-promptrefiner-browser-extension-h8zn9o.md`.
