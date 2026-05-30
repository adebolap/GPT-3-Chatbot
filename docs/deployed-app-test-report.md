# Deployed app smoke test report

Test target: `https://contxt-delta.vercel.app/`

Test date: 2026-05-30 UTC

## Result summary

The deployed URL could not be fully validated from this environment. Terminal HTTP checks are blocked by the environment proxy/DNS setup.

## What was tested

| Check | Result | Notes |
| --- | --- | --- |
| `curl -I -L https://contxt-delta.vercel.app/` | Blocked | The environment proxy returns `CONNECT tunnel failed, response 403`. |
| Direct curl without proxy | Blocked | DNS resolution is unavailable without the configured proxy. |
| `npm install` | Blocked | Registry request returns `403 Forbidden` from this environment policy. |

## Follow-up

- Validate the deployed Contxt landing page from a normal browser.
- Verify `https://contxt-delta.vercel.app/api/health` after deployment.
- Add Playwright smoke tests in CI once dependency installation is available.
