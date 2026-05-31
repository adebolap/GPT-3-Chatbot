# Branch conflict scan

Base ref: `HEAD`
Base SHA: `67e674719f035ac2190702bd16cfd7ae365aa248`
Current branch: `work`

## Available refs

- `work` → `67e674719f035ac2190702bd16cfd7ae365aa248` (same commit as base)

## Mergeability against base

No branch other than the base commit is present in this checkout.

That means there are no local/remote branch contents available here to resolve. If GitHub shows conflicts for branches that are not listed above, this environment needs a configured `origin` remote or a patch/diff for those branches before conflicts can be resolved locally.

## Notes

- This scan is read-only; it does not modify the worktree.
- To include GitHub branches, first configure/fetch the remote in the environment where you run this script:

```bash
git remote add origin <repo-url> # only if origin is missing
git fetch --all --prune
scripts/scan-branch-conflicts.sh HEAD
```
