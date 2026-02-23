# CricChain Production Security & Lockdown Checklist

Before going live on **March 20, 2026**, ensure all items on this checklist are verified and signed off by the engineering team.

## 1. Smart Contract Security
- [ ] **Audit Completed:** Has the `CricChainMarket.sol` contract been audited by a reputable third-party firm (e.g., CertiK, Hacken, Consensys Diligence)?
- [ ] **Admin Keys:** Are the contract owner and fee wallet keys secured in a hardware wallet (e.g., Ledger/Trezor) or a multi-sig Safe (formerly Gnosis Safe)?
- [ ] **Emergency Pause:** Is the `Pausable` functionality working and tested? Can the multi-sig pause deposits in an emergency?
- [ ] **Verified Code:** Is the deployed contract code verified and publicly visible on Polygonscan/Etherscan?

## 2. Infrastructure & Database (Supabase)
- [ ] **RLS Enabled:** Is Row Level Security (RLS) enabled on ALL Supabase tables?
- [ ] **API Keys:** Is the Supabase `service_role` key strictly stored ONLY in the secure backend functions (Vercel env vars) and NEVER exposed to the frontend?
- [ ] **Point-in-Time Recovery (PITR):** Is PITR enabled on the Supabase production database?
- [ ] **Connection limits:** Are the PgBouncer connection pools sized correctly for expected launch day traffic?

## 3. Web Application (Next.js & Admin)
- [ ] **Environment Variables:** Are all `.env` files removed from version control? Are Vercel production environment variables correctly set?
- [ ] **Rate Limiting:** Is rate limiting enabled on all public API routes (especially `/api/predictions/place` and `/api/auth`) to prevent DDoS or spam?
- [ ] **CORS Settings:** Is the Next.js API strictly restricted to the actual frontend domain (`cricchain.io`)?
- [ ] **Admin Access:** Is the `/admin` path and Vercel Admin project restricted by VPN, IP whitelist, or strict Role-Based Access Control (RBAC)?
- [ ] **Authentication:** Is `NEXTAUTH_SECRET` a strong, randomly generated 32+ byte string?

## 4. Machine Learning Backend (FastAPI)
- [ ] **Network Isolation:** Is the FastAPI server accessible ONLY by the Next.js backend (e.g., VPC peering, internal network, or IP whitelisting)?
- [ ] **Data Validation:** Are all inputs to the prediction model sanitized to prevent injection attacks?
- [ ] **Fallback Logic:** If the ML service goes down, does the application safely gracefully degrade (e.g., falling back to default margin models instead of crashing)?

## 5. Domain & Operations
- [ ] **WAF / Cloudflare:** Is Cloudflare (or similar Web Application Firewall) proxying traffic to Vercel to cache assets and block malicious bots?
- [ ] **SSL/HTTPS:** Is strict HTTPS enforced (HSTS)?
- [ ] **Logging & Monitoring:** Are Datadog, Sentry, or Vercel Analytics configured with alerts for 500 errors and anomalous bet sizes?
- [ ] **Incident Response:** Is there a defined on-call rotation and emergency Slack channel for launch day?

---
*Signed off by: _____________  Date: _____________*
