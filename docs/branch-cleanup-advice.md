# Branch cleanup advice

Scan date: 2026-05-30 UTC

## What is available in this checkout

This checkout has only one local branch:

| Branch | Commit | Status |
| --- | --- | --- |
| `work` | `77e8629` | current branch |

There are no configured remotes and no remote-tracking branches in this environment. Running `git fetch origin --prune` fails because `origin` is not configured.

## What can be concluded here

- There are **no local unmerged branches** to merge, commit, or delete from this checkout.
- I cannot determine which GitHub PR branches are stale or unmerged without a remote or a branch list from GitHub.
- The GitHub UI may show open/conflicted branches, but they are not present in this local `.git` database.

## What should be committed

Commit only work that belongs to the current Contxt direction:

- `contxt/scaffold-clean` or equivalent clean branch created from current `main`.
- Follow-up feature branches that build on Contxt (extension memory, web auth, Pro sync, landing page, tests).
- Conflict-resolution commits that merge `main` into the active Contxt PR branch and preserve the Contxt product direction.

## What should be deleted or closed

Close/delete branches that only represent superseded directions after confirming no unique Contxt work remains:

- Old PromptRefiner branches, especially names like `codex/build-mvp-for-promptrefiner-browser-extension-*` if they reintroduce prompt refinement, OpenAI `/api/refine`, Stripe billing, or `@promptrefiner/*` packages.
- Experimental conflict-resolution branches that only add docs/scripts and do not contain product code needed by the final Contxt PR.
- Duplicate scaffold branches once a clean Contxt branch from current `main` exists and passes checks.

## Commands to run in a normal clone with GitHub access

```bash
git fetch --all --prune

# See branches not merged into main.
git branch -r --no-merged origin/main

# See already merged remote branches that are candidates for deletion.
git branch -r --merged origin/main

# Inspect a suspicious branch before deleting it.
git log --oneline --decorate origin/main..origin/<branch-name>
git diff --stat origin/main...origin/<branch-name>

# Delete a remote branch only after confirming it is obsolete.
git push origin --delete <branch-name>
```

## Recommended cleanup path

1. Create one clean Contxt PR branch from current `main`.
2. Make sure that branch contains the Contxt scaffold and passes checks.
3. Close the conflicted PR(s).
4. Delete old PromptRefiner/conflict-helper branches after verifying they contain no unique Contxt code.
