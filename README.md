# Boi-O

A social reading app for Bangladesh: track, rate and discover Bangla and English books. Built for AppQuest 2.0 with Applink: phone sign-up by OTP today; SMS, USSD and carrier billing next.

## Run locally
Requires Node 20+.

```bash
npm install
cp .env.example .env.local   # then set SESSION_SECRET (command is in the file)
npm run dev                  # http://localhost:3000
```

By default OTP runs against the built-in Applink mock: any 014/019 number, code **123456**.
To use real Applink, see [docs/04-applink-integration.md](docs/04-applink-integration.md#local-mock).

## Docs
- [Product brief](docs/00-product-brief.md)
- [Decisions](docs/01-decisions.md)
- [Features](docs/02-features.md)
- [Business model](docs/03-business-model.md)
- [Applink integration](docs/04-applink-integration.md)
- [Roadmap](docs/05-roadmap.md)
- [Status](PROJECT_STATUS.md)

## Structure
```
src/app/(app)/      Home, Discover, Library, Community, Profile, Book, Boi Mela
src/app/(auth)/     Join (OTP) and Sign in
src/app/api/auth/   OTP request/verify, profile, login, logout, me
src/app/api/dev/    Local Applink mock (dev only)
src/server/         Applink client, OTP flow, session, user store
src/components/     Sheet, accordion, covers, stars, nav, toast
```

## Disclosure
Built during AppQuest 2.0 with help from AI tools (Claude Code). Open-source libraries: Next.js, React, Tailwind CSS, lucide-react. Book metadata in demo data is public bibliographic information; covers are generated, not copied.
