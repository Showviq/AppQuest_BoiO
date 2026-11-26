# Boi-O — Product Brief

**One line:** A social reading app for Bangladesh that works on any phone: smartphone app, SMS and USSD.

## Problem
- Bangla readers have no home for tracking, reviewing and discovering Bangla books. Global apps (Goodreads etc.) have poor Bangla catalogs and search (হিমু ≠ Himu).
- Many readers are on feature phones or patchy data. They are left out of every reading app.
- At Ekushey Boi Mela, finding a book or a publisher's stall is hard; mobile data is unreliable in the crowd.

> To do: add 2–3 sourced statistics (mobile/feature-phone share, Boi Mela visitors/sales). No unsourced numbers in the proposal.

## Solution
| Who | How they use Boi-O |
|---|---|
| Smartphone reader | Web app: Bangla/Banglish search, library, ratings, reviews |
| Feature-phone reader | SMS: log pages (`LOG 45`), check streak, daily quote |
| Boi Mela visitor | USSD `*xxx#`: trending books, find a stall, no data needed |
| Authors | Followers, tips by mobile balance (later) |
| Publishers | Promoted listings, Boi Mela stall visibility (later) |

## What makes it different
1. **Bangla-first canonical search:** হিমু, Himu, Himuu → same book.
2. **One reading profile across app, SMS and USSD.**
3. **Carrier billing** (Applink): pay with mobile balance, no card or bKash needed.

## MVP for 30 Nov (hero journey)
1. Sign up with phone → **OTP**
2. Search (Bangla/Banglish) → add book to library
3. Text `LOG 45` by **SMS** → progress updates in the app
4. Dial **USSD** → Boi Mela trending / stall finder
5. Upgrade to **Pro** → **Subscription**, unlocked only after confirmation

See: [Decisions](01-decisions.md) · [Features](02-features.md) · [Business model](03-business-model.md) · [Applink](04-applink-integration.md) · [Roadmap](05-roadmap.md)
