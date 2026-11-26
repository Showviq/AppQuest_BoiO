# Check-in · 27 Nov 2026

## 1. Applink integration
- **Working:** OTP sign-up. Phone → consent → Applink `/otp/request` → code → `/otp/verify` → account. Built to the published contract, with rate limits, attempt caps and expiry. Running against a local contract mock until credentials arrive.
- **Planned:** OTP + Subscription for free membership; SMS for logging reading by text (`LOG 45`); USSD as an offline Boi Mela companion; CaaS for Pro pass and author tips.
- **Approval:** SP account and app created, both approval emails sent. Waiting on approval/credentials.

## 2. Live demo
1. Join: number → consent sheet → code → profile (OTP flow)
2. Discover: search `Himu` / `হিমু` / `feluda` → same books
3. Book page: add to shelf, rate (half stars), accordions, spoiler-safe reviews
4. Home: progress update; Library shelves; Boi Mela stall finder; light/dark theme

## 3. Business model
- Free core. Revenue on Applink: **Pro pass ৳30 / 30 days** and **author tips ৳2/5/10** (CaaS); later publisher promotions at Boi Mela.
- Reach: university reading clubs → Ekushey Boi Mela (USSD code on posters) → Bangla book Facebook groups.

## 4. Blockers & questions
1. When do we get credentials? Can we test from a dev machine, or only from a whitelisted static IP?
2. An app has one subscription charge, and OTP verify subscribes the user. Can we set it to **free** and charge through CaaS? Or do we need two apps?
3. Allowed CaaS amounts (৳2 tip?) and revenue share.
4. USSD short code in Limited Production? Best way to show USSD in the demo video (simulator?)
5. Who pays outbound SMS during testing?
