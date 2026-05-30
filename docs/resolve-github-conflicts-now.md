# Resolve the GitHub PR conflicts now

GitHub says: **This branch has conflicts that must be resolved. Use the command line to resolve conflicts before continuing.**

This environment cannot perform the actual GitHub merge because it has no `origin` remote and only one local branch. Run the following commands in your normal local clone of the GitHub repository.


## One-command helper for the screenshot branch

The screenshot branch is `codex/build-mvp-for-promptrefiner-browser-extension-zytd7z`. In a normal local clone with GitHub access, run:

```bash
scripts/fix-github-pr-conflicts.sh codex/build-mvp-for-promptrefiner-browser-extension-zytd7z main
git push origin codex/build-mvp-for-promptrefiner-browser-extension-zytd7z
```

This automates the command-line flow below: fetch, checkout PR branch, merge `origin/main`, keep the PR side for known Contxt scaffold conflicts, run `git diff --check`, and commit the merge resolution.

## Recommended: recreate the PR from current `main`

This is the safest fix because the current PR is a single large product-pivot scaffold commit.

```bash
# 1. Get current main
git fetch origin
git checkout main
git pull --ff-only origin main

# 2. Create a clean replacement branch
git checkout -b contxt/scaffold-clean

# 3. Copy/apply the Contxt scaffold files from this branch/patch into the clean branch.
#    If you have this agent branch locally, copy files from it or cherry-pick the scaffold commit.

# 4. Commit and push
git add -A
git diff --check
git commit -m "Scaffold Contxt monorepo"
git push -u origin contxt/scaffold-clean
```

Open a new PR from `contxt/scaffold-clean` into `main` and close the old conflicted PR.

## Alternative: resolve the existing PR branch

Only use this if you must keep the current PR number.

```bash
git fetch origin
git checkout codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o
git merge origin/main

# See exactly which conflicted files are present.
git status --short
scripts/resolve-contxt-conflicts.sh --dry-run

# In this workflow, "ours" is the PR branch and should keep the Contxt scaffold.
scripts/resolve-contxt-conflicts.sh --side ours

# Review and validate before committing.
git diff --cached
git diff --check
npm install
npm run build:web
npm run build:extension
npm run smoke:web

git commit -m "Resolve main conflicts for Contxt scaffold"
git push origin codex/build-mvp-for-promptrefiner-browser-extension-h8zn9o
```

## If `scripts/resolve-contxt-conflicts.sh` is not on the conflicted branch yet

Run the same concept manually for the files GitHub lists:

```bash
# While on the PR branch after `git merge origin/main`:
git checkout --ours -- .gitignore README.md package.json tsconfig.base.json supabase-schema.sql
git checkout --ours -- apps/api apps/extension apps/web packages/shared scripts docs
git add -A
git diff --cached
git diff --check
git commit -m "Resolve main conflicts for Contxt scaffold"
git push
```

## Critical rule

Do not use GitHub's web conflict editor for this PR. The conflict is not a small text conflict; it is a product-pivot/repository-structure conflict. Resolve locally, review the staged diff, and then push.
