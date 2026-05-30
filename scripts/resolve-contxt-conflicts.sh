#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Resolve the known Contxt PR conflict set by choosing one side for product-owned files.

Usage:
  scripts/resolve-contxt-conflicts.sh --side ours   # keep the current branch version
  scripts/resolve-contxt-conflicts.sh --side theirs # keep the incoming/base branch version
  scripts/resolve-contxt-conflicts.sh --dry-run     # show conflicted files this script knows about

Important:
- Use this only while git is in a merge/rebase conflict state.
- In a PR branch after merging base into it, `--side ours` usually keeps the PR branch's Contxt files.
- If you are on the base branch merging the PR into it locally, the sides are reversed.
- Review `git diff --check` and `git diff --cached` before committing.
USAGE
}

SIDE=""
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --side)
      SIDE="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ "$DRY_RUN" == false && "$SIDE" != "ours" && "$SIDE" != "theirs" ]]; then
  echo "Expected --side ours or --side theirs (or --dry-run)." >&2
  usage >&2
  exit 2
fi

CONFLICT_PATHS=(
  ".gitignore"
  "README.md"
  "apps/api/package.json"
  "apps/api/src/server.ts"
  "apps/api/tsconfig.json"
  "apps/extension/background.ts"
  "apps/extension/contents/contxt.tsx"
  "apps/extension/package.json"
  "apps/extension/plasmo.config.ts"
  "apps/extension/popup.tsx"
  "apps/extension/src/adapters/base.ts"
  "apps/extension/src/adapters/sites.ts"
  "apps/extension/src/adapters/types.ts"
  "apps/extension/src/lib/context.ts"
  "apps/extension/src/lib/db.ts"
  "apps/extension/tsconfig.json"
  "apps/web/package.json"
  "apps/web/src/app/api/health/route.ts"
  "apps/web/src/app/api/lemon-webhook/route.ts"
  "apps/web/src/app/api/sync/conversations/route.ts"
  "apps/web/src/app/layout.tsx"
  "apps/web/src/app/page.tsx"
  "apps/web/src/lib/env.ts"
  "apps/web/src/middleware.ts"
  "docs/change-safety.md"
  "docs/deployed-app-test-report.md"
  "docs/product-direction.md"
  "docs/website-fix-list.md"
  "package.json"
  "packages/shared/package.json"
  "packages/shared/src/index.ts"
  "packages/shared/src/types.ts"
  "scripts/smoke-web.mjs"
  "supabase-schema.sql"
  "tsconfig.base.json"
)

mapfile -t UNMERGED < <(git diff --name-only --diff-filter=U || true)

if [[ ${#UNMERGED[@]} -eq 0 ]]; then
  echo "No unmerged files detected."
  exit 0
fi

printf 'Currently unmerged files:\n'
printf '  %s\n' "${UNMERGED[@]}"

KNOWN_TO_RESOLVE=()
for path in "${CONFLICT_PATHS[@]}"; do
  for conflicted in "${UNMERGED[@]}"; do
    if [[ "$path" == "$conflicted" ]]; then
      KNOWN_TO_RESOLVE+=("$path")
    fi
  done
done

if [[ ${#KNOWN_TO_RESOLVE[@]} -eq 0 ]]; then
  echo "No known Contxt conflict paths matched the current unmerged set."
  exit 0
fi

printf '\nKnown Contxt conflicts this script can resolve:\n'
printf '  %s\n' "${KNOWN_TO_RESOLVE[@]}"

if [[ "$DRY_RUN" == true ]]; then
  echo "\nDry run only. Re-run with --side ours or --side theirs to resolve these files."
  exit 0
fi

for path in "${KNOWN_TO_RESOLVE[@]}"; do
  echo "Resolving $path with --$SIDE"
  git checkout "--$SIDE" -- "$path"
  git add "$path"
done

mapfile -t REMAINING < <(git diff --name-only --diff-filter=U || true)
if [[ ${#REMAINING[@]} -gt 0 ]]; then
  printf '\nRemaining unmerged files (manual resolution still required):\n'
  printf '  %s\n' "${REMAINING[@]}"
  exit 1
fi

echo "\nAll known conflicts resolved and staged. Review with: git diff --cached"
