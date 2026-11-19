# API notes

All routes are rooted at `/api`. Authentication uses HTTP-only access and refresh cookies. Send requests with credentials enabled. API errors avoid returning submitted personal data.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Sign in with email and password |
| POST | `/auth/refresh` | Refresh cookie | Refresh access cookie |
| POST | `/auth/logout` | Public | Clear session cookies |
| GET | `/auth/me` | Signed in | Current user |
| GET | `/dashboard` | All roles | MongoDB derived totals and ward overview |
| GET | `/citizens` | All roles | Search/list; ward accounts are always scoped |
| GET | `/citizens/:id` | All roles | Read profile, with ward scoping |
| POST | `/citizens` | All roles | Submit a citizen profile for review |
| PATCH | `/citizens/:id` | Admin/ward | Ward submitter can edit pending/correction records |
| POST | `/citizens/:id/verification` | Admin | Verify, reject, or request correction |
| GET | `/audit-logs` | Admin | Recent audit actions |

List filters: `q`, `ward` (admin/mayor), `status`, `category`, `page`, `limit`. Verification body is one of `{ "decision": "VERIFIED", "notes": "..." }`, `{ "decision": "REJECTED", "reason": "..." }`, or `{ "decision": "NEEDS_CORRECTION", "message": "..." }`.
