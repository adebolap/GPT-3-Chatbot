# Conflict root cause

The current PR is fundamentally hard to resolve because it is a **single giant scaffold commit** on top of a repo that already has `README.md` on `main` and likely has overlapping files from the old PromptRefiner branch.

GitHub is not seeing a small feature diff. It is seeing a one-commit rewrite that:

- modifies `README.md`, and
- adds almost the entire monorepo in one commit (`apps/*`, `packages/*`, root config, docs, scripts, schema).

That is why the conflict list is broad. The branch is asking GitHub to reconcile a product pivot, repository restructure, package renaming, extension implementation, web app implementation, and docs all at once.

## Recommended fix

Do **not** keep trying to resolve this PR in the GitHub web conflict editor.

The clean fix is to replace the conflicted branch with a branch created from current `main`, then apply the Contxt scaffold as a clean commit on top of it.

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
git checkout -b contxt/scaffold-clean

# Apply/copy the Contxt scaffold files onto this clean branch.
# Then commit and push a new PR.
git add -A
git commit -m "Scaffold Contxt monorepo"
git push -u origin contxt/scaffold-clean
```

## If you must keep the current PR

Use command-line conflict resolution only:

```bash
git fetch origin
git checkout codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o
git merge origin/main
scripts/resolve-contxt-conflicts.sh --dry-run
scripts/resolve-contxt-conflicts.sh --side ours
git diff --cached
git diff --check
git commit -m "Resolve main conflicts for Contxt scaffold"
git push origin codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o
```

But if the web editor still reports dozens of conflicts afterward, abandon that PR and open a clean branch from `main`.

## Why this is safer

A clean branch from `main` avoids GitHub trying to merge two different product histories:

- old GPT-3/PromptRefiner repo history, and
- new Contxt monorepo scaffold.

It also makes future reviews smaller if follow-up work is split into separate PRs:

1. workspace/config only,
2. shared types/schema,
3. web app,
4. extension,
5. docs/scripts.
