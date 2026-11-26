# Decision Log

New decisions go at the top. Status: **Accepted** · **Proposed** (waiting for the team) · **Superseded**.

| # | Date | Decision | Status |
|---|---|---|---|
| D-016 | 2026-11-27 | Post visibility: Everyone / Followers / Community | Accepted |
| D-015 | 2026-11-27 | Cut: direct messages, book exchange, lending | Accepted |
| D-014 | 2026-11-27 | Minimal deploy for real OTP: AWS EC2 Mumbai, fixed IP | Accepted |
| D-013 | 2026-11-27 | Authors & publishers: same phone login, role by verification (mockup) | Accepted |
| D-012 | 2026-11-26 | Competition source files kept out of the public repo | Accepted |
| D-011 | 2026-11-26 | Phase now: real OTP, everything else UI mockup | Accepted |
| D-010 | 2026-11-26 | Temporary storage: JSON file + in-memory until the backend phase | Accepted |
| D-009 | 2026-11-26 | Applink OTP = sign-up **and** subscription opt-in; consent first | Accepted |
| D-008 | 2026-11-26 | Theme/category for AppQuest | Dropped (handled by team) |
| D-007 | 2026-11-26 | Documentation lives in `/docs` in the repo | Accepted |
| D-006 | 2026-11-26 | UI principles: minimal text, accordions/modals, mobile-first | Accepted |
| D-005 | 2026-11-26 | Applink behind an adapter: mock → sandbox → live | Accepted |
| D-004 | 2026-11-26 | Applink API roles (revised, see below) | Proposed |
| D-003 | 2026-11-26 | Stack: Next.js + TypeScript (+ PostgreSQL later) | Accepted |
| D-002 | 2026-11-26 | Competition MVP = one hero journey, not the full vision | Accepted |
| D-001 | 2026-11-26 | Product is **Boi-O**, an independent product | Accepted |

---

### D-016 · Who sees a post
| Audience | Shows in |
|---|---|
| **Everyone** | Followers' *Following* feed, *Latest*, your profile, the book's page (if a book is attached). Can surface in *For You* / *Trending*. |
| **Followers** | Followers' *Following* feed, your profile (followers only). Never on book pages or public feeds. |
| **Community** | That community's page only. |
- The author always sees their own posts first in their feed. Spoilers stay hidden everywhere until tapped. Blocked users see nothing.
- The compose screen shows these places live under the audience picker (`reach` in `src/components/social/my-posts.tsx`).
- **Now (mockup):** posts saved in this browser (`localStorage`). **Later:** `Posts` table with an `audience` column, feed queries filter by follower graph and membership.

### D-015 · Scope cut: messages, exchange, lending
- **Why:** less to build and moderate before the deadline; DMs need abuse handling; exchange and lending need trust and dispute flows.
- **Instead:** marketplace buyers tap **Request**, and the seller gets an **SMS** (Applink) with the buyer's request. "Share" keeps Copy link and Quote card.

### D-014 · Minimal deploy (real OTP)
- **Why:** Applink only accepts calls from allow-listed IPs (`E1303`). Home IPs rotate (seen: .31 → .21 in minutes), so calls must come from a fixed IP.
- **Where:** AWS account 8151… (CLI profile `infoinlet-deploy`), `ap-south-1`, `t4g.micro` Ubuntu 24.04 + 2 GB swap, instance `boio-otp`.
- **Fixed IP (Applink allowed host):** `65.0.242.101` (Elastic IP).
- **URL:** https://65-0-242-101.sslip.io (Caddy, automatic HTTPS; no domain needed).
- **Runs as:** systemd `boio` (`next start` on 127.0.0.1:3000) behind Caddy. Env in `/opt/boio/.env.production` (600, live Applink URLs, mock off). Users in `/opt/boio/.data/` (single process, fits D-010).
- **SSH:** key `~/.ssh/boio-otp.pem`; port 22 open only to 103.187.95.0/24 (home ISP).
- **Redeploy:** `bash scripts/deploy.sh`.
- **Cost:** free tier if eligible, else ~$9–10/month. Delete the instance + release the Elastic IP when done.

### D-013 · Author & publisher accounts
- **Decision:** No separate login. Authors and publishers sign up with the same phone + OTP account, then **apply** for a role (name, official link, proof: ISBN or trade licence). An admin approves or rejects with a reason. Approval adds the role and unlocks **Studio**.
- **Paying:** authors don't pay; they earn **tips** (CaaS ৳2/5/10, 15% fee). Publishers buy **promotions** (Book Boost ৳1,000 / 7 days, Boi Mela Spotlight ৳5,000 / fair) **by invoice**, since these amounts are too large for carrier billing. Paying never grants verification (master prompt §16.5).
- **Now (mockup, per D-011):** `/partner` (apply), `/admin/verify` (demo admin, no auth), `/studio` (dashboards). State in `localStorage` (`src/components/partner-store.tsx`).
- **Later:** `role` on the user, `VerificationRequests` table, real admin role + audit log, invoices.

### D-012 · Source files stay local
- The booklet PDF, the master prompt `.docx` and the booklet notes are git-ignored. The repo only holds Boi-O's own work.

### D-011 · Real OTP, mocked rest
- **Decision:** Applink OTP is implemented for real (server-side, contract-checked). All other features are working UI mockups (client state in `localStorage`, demo data in `src/lib/mock-data.ts`).
- **Why:** The team's call. Show the full product shape fast; backends come next.

### D-010 · Temporary storage
- Users: `.data/users.json` (git-ignored). Pending OTP flows and rate limits: in-memory.
- **Limit:** single server process only; does not survive serverless deploys. Replace with PostgreSQL (+ Redis or DB rows for OTP flows) before deploying.

### D-009 · OTP is also the subscription opt-in
- **Fact (Applink docs):** a successful `/otp/verify` **activates the app's Applink subscription** and returns the `subscriberId`. The charge is whatever was set when the Applink app was created.
- **Decision:**
  - Show number + charge + "cancel anytime" in a consent sheet **before** the OTP is sent; store the consent (time, channel, amount, frequency).
  - The charge text comes from `BOIO_SUB_CHARGE_BDT` / `BOIO_SUB_FREQUENCY` and **must match** the Applink app's settings.
  - Applink is used once to bind the phone. After that, Boi-O has its own login (phone + password, own session cookie). Nothing on login or page load calls Applink.
- **Open:** what charge the Applink app was created with. See D-004 options.

---

### D-001 · Product is Boi-O
- **Decision:** Build **Boi-O** as its own product. The "Ultimate Master Prompt" (written for *BoiBoxd*) is the **long-term vision**, not the build spec for 30 Nov.
- **Why:** We submit it to AppQuest 2.0 and keep growing it afterwards. Same project must be improved if shortlisted (booklet rule).

### D-002 · MVP = one hero journey
- **Decision:** For the 30 Nov submission, build one complete end-to-end journey that shows Applink working (see `04-applink-integration.md`). Everything else goes to the roadmap.
- **Why:** The booklet's scope rule: "one strong end-to-end journey beats five half-built features". 45% of the score is Innovation + Applink integration.

### D-003 · Stack
- **Decision:** One Next.js 15 (App Router, TypeScript) app for both web UI and API routes; Tailwind CSS 4 (pinned 4.1.13: 4.3 breaks on Node 22.2); lucide icons. Later: Prisma + PostgreSQL; a host with a **static egress IP** (Applink whitelists caller IPs) and a public HTTPS URL for callbacks.
- **Code layout:** modular monolith: `src/server/modules/<domain>` (auth, catalog, library, applink, billing).
- **Why:** 4 days left. One codebase, one deploy, typed end to end. The master prompt's NestJS / Flutter / OpenSearch / Redis are deferred until there's a real need (the master prompt allows this).
- **Trade-off:** Long-running jobs (renewal reconciliation) need a cron route or a worker later.

### D-004 · Applink API roles (revised, proposed)
Constraint from the docs: **one Applink app = one subscription charge**, and OTP verify opts the user into it. So "free sign-up" and "paid Pro" can't both be the same subscription. Two options:

**Option A (recommended): free membership, paid extras via CaaS**
| API | Job |
|---|---|
| OTP | Sign-up: verify phone + opt in to the free Boi-O service |
| Subscription | Membership lifecycle: register/unregister, `STOP`, subscriber notifications, base size as a growth metric |
| SMS | Two-way: `LOG 45`, `STREAK`, `QUOTE`, `TRENDING`, `STOP`; return/event reminders |
| USSD | Boi Mela offline companion: trending, stall finder, my reading, unsubscribe |
| CaaS | All revenue, OTP-confirmed one-time charges: **Pro pass** (৳30 / 30 days), **author tips** (৳2/5/10), **Boi Mela pass**, later audiobook purchases and event tickets |

**Option B: the subscription is Pro**
The Applink app charges (e.g. ৳30/month). OTP = "Go Pro" only. Free users sign up without Applink. Recurring revenue, but OTP is no longer the sign-up and free users aren't reachable by SMS/USSD.

- **Why A:** Every reader joins through Applink (OTP + Subscription), gets SMS/USSD access, and every API has a distinct job. Revenue still runs on Applink (CaaS). Needs the Applink app set to free / ৳0.
- **Check with Applink:** free subscription allowed? CaaS amounts and limits? Revenue share.

### D-005 · Applink adapter
- **Decision:** All Applink calls go through one interface with `APPLINK_MODE=mock|sandbox|live`. Develop against the official local mock server (Applink-as-a-Skill) until SP + app approval arrives.
- **Rule:** Never show a payment or subscription as successful unless the server got a verified confirmation.

### D-006 · UI principles
- Mobile-first, standard patterns. Minimal copy: labels and icons over sentences.
- Use accordions for secondary detail, modals/bottom sheets for short tasks (OTP, rate, upgrade).
- Palette: forest green, warm cream, charcoal, muted gold. Light and dark themes.
- Bangla + English fonts (e.g. Hind Siliguri / Noto Sans Bengali + Inter).

### D-007 · Docs in the repo
- `/docs` holds decisions, features, business model, Applink integration, roadmap and check-in notes. The jury sees them in the GitHub repo (helps "Technical implementation").

### D-008 · Theme & category
- Dropped from this log: the team handles track/category.
