# Applink Integration

Applink runs on the **Banglalink** network (numbers starting 014 / 019). Every call is server-side only, with credentials in the JSON body. HTTP 200 is not success: the outcome comes from `statusCode`.

## Approval status
| Step | Status |
|---|---|
| SP account created + approval email | ✅ Done |
| App created + approval email | ✅ Done |
| App approved / credentials received | ❓ |
| OTP built against local mock | ✅ 2026-11-26 |
| OTP tested on real Applink | ⬜ needs credentials + whitelisted server IP |
| SMS / USSD / Subscription / CaaS | ⬜ |

## API roles
See **D-004** in [decisions](01-decisions.md) (Option A recommended: free membership via OTP + Subscription, revenue via CaaS).

## OTP: implemented
```
[Phone] → consent sheet (number, charge, cancel anytime)
   → POST /api/auth/otp/request → Applink /otp/request → referenceNo (kept server-side)
[Code]  → POST /api/auth/otp/verify  → Applink /otp/verify → subscriberId + subscriptionStatus
   → user created, own session cookie → [Name + password] → Home
Returning users: phone + password (no Applink call).
```

| Safeguard | How |
|---|---|
| Consent before OTP | Sheet shows number + charge; recorded with timestamp |
| Banglalink-only input | 014 / 019 validated server-side |
| SMS-bombing protection | 3 requests / number / 15 min, 10 / IP / 15 min |
| Brute force | 5 verify attempts per code, then a new code is required |
| Expiry | 5 min, enforced locally too |
| Secrets | `referenceNo` never sent to the browser (opaque httpOnly flow cookie); OTP/referenceNo never logged; credentials env-only |
| Error mapping | E1850 wrong code · E1851/E1855 expired · E1603 busy · config errors logged, generic message shown |

Code: `src/server/applink/` (config + client), `src/server/auth/otp-flow.ts`, `src/app/api/auth/*`.

## Local mock
`/api/dev/applink/otp/{request,verify}` follows the published contract (string-only values, credential check, E1850/E1851/E1855). Enabled only with `APPLINK_DEV_MOCK=1`, never in production. Test code: **123456**.

**Switch to real Applink:** set `APPLINK_APP_ID`, `APPLINK_PASSWORD`, point `APPLINK_OTP_*_URL` to `https://api.applink.com.bd/otp/...`, set `APPLINK_DEV_MOCK=0`, run from a whitelisted IP.

## Planned flows (not built yet)
- **SMS:** `LOG 45` → MO webhook → progress updated → reply "Page 45 ✓ Streak 6". Also `STREAK`, `QUOTE`, `TRENDING`, `STOP`.
- **USSD:** `1 Trending · 2 Find a stall · 3 My reading · 4 Unsubscribe`, session state server-side.
- **Subscription:** mirror status from subscriber notifications; unregister from app, SMS and USSD.
- **CaaS:** Pro pass / tips: `/caas/direct/debit` (P1003, OTP sent) → `/caas/otp/verify` → settle on charging notification. Idempotent `externalTrxId`.
