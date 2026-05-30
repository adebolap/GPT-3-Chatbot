# Branch integration notes: `resolutionsclaude/eloquent-curie-Zd4FF`

Requested branch: `resolutionsclaude/eloquent-curie-Zd4FF`

## Current repository limitation

This checkout does not currently have a remote configured, so the requested branch cannot be fetched or inspected from this environment.

Observed commands:

```bash
git branch -a
# only local branch: work

git remote -v
# no remotes configured

git fetch origin resolutionsclaude/eloquent-curie-Zd4FF
# fatal: 'origin' does not appear to be a git repository
```

Because the branch contents are not available locally, do **not** guess at or overwrite its changes. The safe next step is to fetch the branch in an environment that has the repository remote configured, then resolve conflicts file-by-file.

## Safe conflict-resolution plan

1. Add or restore the repository remote:
   ```bash
   git remote add origin <repo-url>
   git fetch origin resolutionsclaude/eloquent-curie-Zd4FF
   ```
2. Create a local integration branch from the current Contxt baseline:
   ```bash
   git checkout -b integrate/resolutionsclaude-eloquent-curie-Zd4FF
   git merge origin/resolutionsclaude/eloquent-curie-Zd4FF
   ```
3. When conflicts appear, preserve the current Contxt product direction:
   - Keep `README.md` as **Contxt — Your AI Memory Layer**.
   - Do not reintroduce PromptRefiner/OpenAI prompt-refinement flows unless explicitly requested.
   - Preserve Plasmo + Dexie local memory behavior.
   - Preserve Clerk + Lemon Squeezy + Supabase Pro-sync direction.
4. Resolve conflicts with additive merges where possible:
   - If the branch adds UI polish, integrate it into the Contxt landing/popup.
   - If the branch changes old PromptRefiner files, port only relevant behavior into Contxt equivalents.
   - If the branch changes package names back to `@promptrefiner/*`, keep `@contxt/*`.
5. Validate after resolving:
   ```bash
   git diff --check
   npm install
   npm run build:web
   npm run build:extension
   npm run smoke:web
   ```
6. Commit the resolved merge:
   ```bash
   git add -A
   git commit
   ```

## Files most likely to conflict

Based on this repo's history, expect conflicts in:

- `README.md`
- `package.json`
- `tsconfig.base.json`
- `apps/extension/package.json`
- `apps/extension/plasmo.config.ts`
- `apps/extension/contents/contxt.tsx`
- `apps/extension/popup.tsx`
- `apps/extension/src/lib/db.ts`
- `apps/web/package.json`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/api/*`
- `packages/shared/src/types.ts`

## Resolution defaults

Use these defaults unless the unavailable branch clearly contains newer Contxt-specific work:

| Area | Preferred resolution |
| --- | --- |
| Product name | Contxt |
| Extension purpose | Persona injection + local memory |
| Storage | Dexie / IndexedDB locally; Supabase only for Pro cloud sync |
| Billing | Lemon Squeezy |
| Auth | Clerk |
| API | Next.js app routes for active web APIs; Express app stays legacy |
| Old PromptRefiner logic | Drop or port only if it supports Contxt memory |

## Required input to complete the merge here

To resolve the branch in this environment, provide one of the following:

1. A configured git remote, or
2. A patch/diff from `resolutionsclaude/eloquent-curie-Zd4FF`, or
3. The conflicted files with conflict markers.
