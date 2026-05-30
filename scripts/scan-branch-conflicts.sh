#!/usr/bin/env bash
set -euo pipefail

BASE_REF="${1:-HEAD}"
BASE_SHA="$(git rev-parse "$BASE_REF")"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

cat <<REPORT
# Branch conflict scan

Base ref: \`$BASE_REF\`
Base SHA: \`$BASE_SHA\`
Current branch: \`$CURRENT_BRANCH\`

## Available refs

REPORT

mapfile -t REFS < <(
  git for-each-ref --format='%(refname:short)' refs/heads refs/remotes \
    | grep -vE '(^|/)HEAD$' \
    | sort -u
)

if [[ ${#REFS[@]} -eq 0 ]]; then
  echo "No local or remote branches were found."
  exit 0
fi

for ref in "${REFS[@]}"; do
  sha="$(git rev-parse "$ref")"
  marker=""
  if [[ "$sha" == "$BASE_SHA" ]]; then
    marker=" (same commit as base)"
  fi
  echo "- \`$ref\` → \`$sha\`$marker"
done

cat <<'REPORT'

## Mergeability against base

REPORT

found_other=false
for ref in "${REFS[@]}"; do
  sha="$(git rev-parse "$ref")"
  if [[ "$sha" == "$BASE_SHA" ]]; then
    continue
  fi
  found_other=true

  echo "### $ref"
  echo
  echo "Commit: \`$sha\`"

  if ! merge_base="$(git merge-base "$BASE_SHA" "$sha" 2>/dev/null)"; then
    echo
    echo "Result: unrelated history or no merge base. Manual review required."
    echo
    continue
  fi

  echo "Merge base: \`$merge_base\`"
  changed_count="$(git diff --name-only "$BASE_SHA" "$sha" | wc -l | tr -d ' ')"
  echo "Files different from base: $changed_count"

  set +e
  merge_output="$(git merge-tree --write-tree --name-only "$BASE_SHA" "$sha" 2>&1)"
  merge_status=$?
  set -e

  echo
  if [[ $merge_status -eq 0 ]]; then
    echo "Result: clean merge by \`git merge-tree\`."
  else
    echo "Result: conflicts detected by \`git merge-tree\`."
    echo
    echo '```text'
    printf '%s\n' "$merge_output"
    echo '```'
  fi
  echo

done

if [[ "$found_other" == false ]]; then
  cat <<'REPORT'
No branch other than the base commit is present in this checkout.

That means there are no local/remote branch contents available here to resolve. If GitHub shows conflicts for branches that are not listed above, this environment needs a configured `origin` remote or a patch/diff for those branches before conflicts can be resolved locally.
REPORT
fi

cat <<'REPORT'

## Notes

- This scan is read-only; it does not modify the worktree.
- To include GitHub branches, first configure/fetch the remote in the environment where you run this script:

```bash
git remote add origin <repo-url> # only if origin is missing
git fetch --all --prune
scripts/scan-branch-conflicts.sh HEAD
```
REPORT
