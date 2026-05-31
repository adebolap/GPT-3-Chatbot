# PR #20 patch notes

Source reviewed: `https://github.com/adebolap/GPT-3-Chatbot/pull/20.patch` / PR page.

## Identified PR metadata

- PR: `#20`
- Title: `Scaffold Contxt monorepo: extension, web app, local memory, and cloud sync routes`
- Base: `main`
- Head branch: `codex/build-mvp-for-promptrefiner-browser-extension-gu8m6c`
- Commits: `1`
- Visible commit: `676662b Add PromptRefiner branch conflict guidance`

## Conflict-resolution implication

Previous docs/scripts used stale branch suffixes (`h8zn9o` and `zytd7z`). For PR #20, use `gu8m6c`:

```bash
scripts/fix-github-pr-conflicts.sh codex/build-mvp-for-promptrefiner-browser-extension-gu8m6c main
git push origin codex/build-mvp-for-promptrefiner-browser-extension-gu8m6c
```

If GitHub's web editor shows only `package.json` conflicted, keep the Contxt root `package.json` from this branch and mark it resolved.
