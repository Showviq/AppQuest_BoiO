# Project Status

_Updated: 2026-11-26_

| Area | Status |
|---|---|
| Docs & decisions | ✅ |
| App skeleton (Next.js 15, design system, light/dark) | ✅ |
| **Applink OTP sign-up** | ✅ against local mock · ⬜ real Applink |
| Login / logout / session | ✅ |
| Home, Discover, Library, Community, Profile, Book, Boi Mela | 🎨 UI mockups (demo data, localStorage) |
| SMS · USSD · Subscription · CaaS | ⬜ |
| Database (PostgreSQL) | ⬜ (JSON file for now) |
| Deploy | ⬜ |

## Tests run (manual, 2026-11-26)
`npm run build` and `tsc` pass. API checks against the mock:
- Non-Banglalink number → rejected · missing consent → rejected
- Request → wrong code (E1850) → correct code → user created, session set
- Reused flow → "expired" · 4th request in 15 min → 429
- Mock rejects wrong credentials (E1313)
- Profile save, `/me`, login wrong/right password
- All pages return 200; unknown book → 404
- Browser: join flow end to end; book page and home render in dark theme

No automated test suite yet.

## Known limitations
- Users stored in `.data/users.json`; OTP flows in memory (single process; not deploy-ready).
- Library, ratings, likes, communities are per-browser (localStorage).
- Pro and tips are visible but disabled ("Coming soon").
- Boi Mela stall numbers are illustrative demo data.

## Dependencies
- Applink credentials (app approval) + server with a whitelisted static IP.
- Decision on the Applink app's subscription charge (D-004 / D-009).
