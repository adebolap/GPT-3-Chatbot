#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'USAGE'
Usage:
  scripts/fix-github-pr-conflicts.sh [pr-branch] [base-branch]

Defaults:
  pr-branch:   codex/build-mvp-for-promptrefiner-browser-extension-gu8m6c
  base-branch: main

Run this in a normal local clone with an origin remote and a clean worktree.
USAGE
  exit 0
fi

BRANCH="${1:-codex/build-mvp-for-promptrefiner-browser-extension-gu8m6c}"
BASE="${2:-main}"
COMMIT_MESSAGE="Resolve ${BASE} conflicts for Contxt scaffold"

cat <<INFO
Fixing GitHub PR conflicts
  PR branch: ${BRANCH}
  Base:      ${BASE}

This script checks out the PR branch, merges origin/${BASE}, keeps the PR branch
version for known Contxt scaffold conflicts, validates the staged result, commits,
and prints the push command.
INFO

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Missing origin remote. Add it first, for example:" >&2
  echo "  git remote add origin https://github.com/adebolap/GPT-3-Chatbot.git" >&2
  exit 2
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit or stash your changes first." >&2
  git status --short >&2
  exit 2
fi

git fetch origin --prune
git checkout "${BRANCH}"

set +e
git merge "origin/${BASE}"
merge_status=$?
set -e

if [[ $merge_status -ne 0 ]]; then
  echo "Merge produced conflicts. Resolving known Contxt scaffold conflicts with --ours..."
  if [[ ! -x scripts/resolve-contxt-conflicts.sh ]]; then
    echo "scripts/resolve-contxt-conflicts.sh is missing on this branch; using manual --ours fallback."
    git checkout --ours -- .gitignore README.md package.json tsconfig.base.json supabase-schema.sql 2>/dev/null || true
    git checkout --ours -- apps/api apps/extension apps/web packages/shared scripts docs 2>/dev/null || true
    git add -A
  else
    scripts/resolve-contxt-conflicts.sh --dry-run
    scripts/resolve-contxt-conflicts.sh --side ours
  fi
fi

if [[ -n "$(git diff --name-only --diff-filter=U)" ]]; then
  echo "Unmerged files remain:" >&2
  git diff --name-only --diff-filter=U >&2
  exit 1
fi

git diff --check

if git diff --cached --quiet && git diff --quiet; then
  echo "No merge changes to commit. Branch may already be up to date."
else
  git status --short
  git commit -m "${COMMIT_MESSAGE}"
fi

cat <<DONE

Conflict resolution complete locally.
Push with:
  git push origin ${BRANCH}
DONE
