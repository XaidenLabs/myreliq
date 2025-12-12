# Myreliq – Solana Proof-of-Work Portfolios

Myreliq is a Solana-native platform that lets students and early-career builders capture every role, milestone, and endorsement in a single verifiable proof-of-work profile. The marketing site already mirrors the live experience; this document dives into the product vision so the full project reads like a hackathon-winning build.

---

## 1. Problem

Students entering the workforce fight four structural issues:

- **Portfolio friction** – Rebuilding Notion pages, PDFs, or Squarespace sites for each opportunity is slow and expensive.  
- **Fragmented proof** – Work sits across GitHub, Drive, Figma, Medium, X, YouTube, etc., so recruiters cannot see the whole narrative.  
- **No objective verification** – References hide in DMs or emails, while credentials are screenshots that anyone can fake.  
- **No longitudinal story** – Traditional portfolios show glossy end results, not the messy, iterative journey that proves growth.

Result: students with multiple “hats” (designer + researcher + writer) juggle several portfolios that decay the moment they ship something new. There is no simple, structured, affordable way to build and continuously update a professional proof-of-work presence.

---

## 2. Vision

**Build a Solana-powered proof-of-work graph.**

Myreliq is the single, canonical profile where students:

- Document roles, projects, and milestones with guided prompts.  
- Split their identity into multiple skill lanes (“Frontend Dev”, “Content Lead”, “Researcher”) under one account.  
- Receive verifiable, cryptographic endorsements and credentials from institutions, DAOs, or mentors.  
- Publish a public, mobile-friendly timeline that anyone can verify against on-chain fingerprints.

On the other side, recruiters and communities query Myreliq to filter talent based on real, auditable history instead of static resumes.

---

## 3. Solution Overview

Myreliq combines a beautiful portfolio builder with Solana programs that anchor credibility:

- **Guided capture** – Prompted inputs for bio, education, skills, roles, projects, milestones, and proof artifacts.  
- **Skill identities** – Each “hat” gets its own curated set of roles and milestones, but all live under one wallet/account.  
- **Solana anchoring** – Publishing a portfolio produces a canonical JSON hash stored on-chain, proving timestamped authenticity.  
- **Soulbound credentials** – Bootcamps, universities, and communities mint non-transferable tokens to recognize verified achievements.  
- **On-chain endorsements** – Mentors/managers sign structured endorsements tied to specific roles.  
- **Single shareable link** – Output is a responsive profile showing roles, timelines, badges, and “Verified on Solana” sections.

---

## 4. Storage & Data Architecture

Myreliq treats persistence as three coordinated layers: relational data, object/file storage, and on-chain references.

### 4.1 Relational Database (Supabase / Neon / Railway)

Production uses Postgres as the system of record. Core tables:

- `users` – auth + roles (`student`, `recruiter`, `issuer_admin`, `super_admin`), wallet address, timestamps.
- `profiles` – extended bio, education, headline, availability, completion score.
- `skill_identities` – “hats” a user can switch between (name, slug, description, primary flag).
- `roles` + `role_tags` – experiences per identity plus tagged skills/tools.
- `milestones` – timeline entries with metrics, media references, achieved_at timestamp.
- `portfolio_versions` – immutable publish history (version number, JSON hash, Solana signature, visibility).
- `organizations` + `organization_members` – issuers/communities and their admins/instructors/students.
- `credentials` – logical representation of issued SBTs (title, description, metadata URI, Solana mint/PDA, status).
- `endorsements` – mentor/manager reviews tied to specific roles (rating, relationship, optional Solana tx).
- `connections` – social graph (follow, collaborator).
- `shortlists` + `shortlist_members` – recruiter-managed candidate lists.
- `audit_logs` – every privileged action (actor, entity, metadata JSONB).

> **Note:** The current prototype uses MongoDB (`models/Profile.ts`) for rapid iteration, but all fields map 1:1 with the relational schema above. Migrating to Postgres is a planned milestone.

### 4.2 Object & File Storage

Supabase Storage or S3 handles binary assets:

- `profiles/{user_id}/avatar.jpg` – headshots.
- `milestones/{milestone_id}/media/*` – screenshots, videos, docs.
- `credentials/{credential_id}/certificate.png` – issuer-branded certificates.

Issuers can optionally pin canonical credential media to IPFS/Arweave and keep the CID in `credentials.metadata_uri`.

### 4.3 On-Chain Layer (Solana)

Only proofs live on-chain:

- Portfolio hashes + metadata (PortfolioProgram).
- Credential/SBT mint references (CredentialProgram).
- Optional hashed endorsements.

This keeps chain costs minimal while letting anyone verify that the web experience matches the immutable record.

---

## 5. Development Setup (Current Prototype)

1. Install dependencies: `npm install`.
2. Configure `.env.local` with:
   - `MONGODB_URI=<connection_string>` (defaults to `mongodb://127.0.0.1:27017/myreliq` for local prototyping)
   - `ACCESS_TOKEN_SECRET=<random_64_char_string>` for signing access tokens
3. Start Mongo locally (`brew services start mongodb-community` or Docker).  
4. Run the dev server: `npm run dev`.

Once Supabase/Postgres is provisioned, swap the persistence layer to the schema described in §4.1.

Schemas for all profile data currently live in `models/Profile.ts`, and `lib/store.ts` exposes CRUD helpers consumed by API routes.

---

## 6. Frontend State Management Strategy

Myreliq distinguishes three categories of state:

### 6.1 Server State

- Data fetched from APIs/DB/Solana (profiles, roles, milestones, portfolio versions, organizations).
- Managed with **TanStack Query** (future milestone) via hooks like `useProfileQuery(userId)`, `useRolesQuery(skillId)`, etc.
- Cache keys follow `['profile', userId]`, `['milestones', roleId]`, etc., enabling optimistic updates and revalidation.

### 6.2 Client/UI State

- Form inputs, modal visibility, onboarding wizard steps, feature flags.
- Managed with **Zustand** (`store/useBuilderStore.ts`) for lightweight, explicit control; can be extended with contexts for modals or wizards.
- React Hook Form + Zod will handle validation-heavy flows (profile completion, role creation, credential issuance).

### 6.3 Auth & Wallet State

- Session info lives in HTTP-only cookies; frontend fetches `/api/me` and stores the user in a global store.
- Wallet connections handled via `@solana/wallet-adapter-react` for publish/credential signature flows.
- RBAC gating across UI (students vs issuers vs admins) happens via role checks on both server and client.

---

## 7. Authentication & Authorization

- Email/password registration + login with Argon2id hashing.
- Sessions persist via hashed refresh tokens stored in Mongo (`models/Session.ts`) and httpOnly cookies (`reliq_access`, `reliq_refresh`).
- Access tokens (15 min) power server-side guards and route protection; refresh tokens rotate every call.
- `/api/auth/me`, `/api/auth/refresh`, `/api/auth/logout` endpoints cover session lifecycle.
- Role-aware redirects: admins land on `/admin`, standard users on `/dashboard`.
- Server components enforce RBAC via helpers in `lib/auth-guards.ts`.

Future upgrades (MFA, device management, audit logging, etc.) follow the specification above.

---

## 8. Relationship Model Between Users & Organizations

### 7.1 User Roles

- **Students** – create portfolios, log milestones, receive credentials.
- **Recruiters/Hiring Managers** – search/filter talent, manage shortlists, follow students.
- **Issuers/Organization Admins** – run bootcamps/cohorts, issue credentials/SBTs, manage members.
- **Platform Admins** – verify orgs, moderate content, manage abuse, oversee on-chain publication integrity.

Multi-role support comes from `users.role` plus `organization_members.role` to distinguish responsibilities per org.

### 7.2 Core Relationships

- **Student ↔ Organization** – many-to-many via membership (students in multiple communities, orgs with multiple cohorts).
- **Student ↔ Recruiter** – connections (`follow`, `collaborator`) and shortlist membership.
- **Student ↔ Student** – follows/collaborations enabling social feeds or shared milestones.
- **Student ↔ Mentor** – mentors issue endorsements; higher weight in scoring.
- **Issuer ↔ Student** – credentials link issuers to alumni; org admins can monitor issuance history.
- **Admin ↔ Everything** – super admins approve orgs, ban users, audit credential issuance.

Optional social extensions include project collaborators, shared milestones, and an activity feed (“X shipped a new milestone”).

---

## 9. Admin Surfaces

Myreliq ships two admin flavors: super admin (platform) and organization admin.

### 8.1 Platform Admin Panel (`/admin`, role = super_admin)

- **Overview Dashboard** – KPIs (users, published portfolios, verified orgs, credentials issued, on-chain publications), plus DAU and issuance charts.
- **User Management** – table with filters, role switches, suspend/unsuspend, view profile, reset 2FA.
- **Organization & Issuer Management** – approval queue, detailed org view, ability to approve/reject, inspect credential history.
- **Content & Abuse Moderation** – flagged milestones/media/endorsements, actions to hide/delete/warn; every action logged in `audit_logs`.
- **Credential & On-Chain Audit** – view credential ledger per org, compare portfolio JSON hash vs DB state, link to Solana tx.
- **System Settings** – feature flags, email templates, rate limits.

### 8.2 Organization Admin Panel (`/organizations/:slug/admin`, membership role = admin)

- **Org Overview** – summary cards (members, credentials issued, active programs).
- **Member Management** – add/remove/invite students and mentors, assign roles.
- **Programs/Cohorts** – define cohorts, attach completion criteria.
- **Credential Issuance** – templates, batch issuing, Solana status, revocations.
- **Endorsement Oversight** – monitor mentor endorsements, revoke/report misuse.

Both panels reuse the same state strategy (React Query for fetches, Zustand for UI) with middleware enforcing RBAC.

---

## 10. Feature Roadmap

### 9.1 Must-Have (7-day MVP)
1. **Onboarding & Base Profile**  
   - Email/password or seedless auth.  
   - Automatic base profile plus optional Phantom/Solflare connection.  
   - Fields: name, bio, education, interests, skills, availability, headshot, optional certifications.

2. **Role / Experience Entry**  
   - Title, org/project, start/end dates, work mode, description prompts, tags, proof links.

3. **Multi-Skill Portfolios**  
   - Create “hats” (e.g., Web3 Dev, Product Writer).  
   - Each hat has its own subset of roles/milestones and its own shareable URL.

4. **Milestone Logging**  
   - Per role: milestone description, date, optional metrics, media upload, timeline view.

5. **Shareable Portfolio Link**  
   - Public URL rendering profile + skill lanes + milestones + badges.  
   - Mobile responsive and recruiter-friendly.

6. **Initial Solana Hooks**  
   - First publish writes portfolio hash + version to a Solana program.  
   - Demo issuer mints an SBT credential to show verification working end-to-end.

### 9.2 Post-MVP Enhancements
- **Issuer dashboard** – Cohorts/batches mint SBTs in bulk, track alumni, revoke or update credentials.  
- **Verified endorsements** – Role-specific endorsements recorded on-chain with issuer reputation weighting.  
- **Downloadable CV & case-study PDFs** – Auto-generated documents with QR links to on-chain fingerprints.  
- **Portfolio personalization** – Theme picker, layout toggles, custom sections per skill.  
- **Recruiter search** – Filter by skills, tools, location, availability, Proof-of-Growth score, credential count.  
- **Integrations** – GitHub, Dribbble, Behance, Medium/Substack, YouTube, X; attach imported artifacts to roles.  
- **Analytics** – Views, clicks, recruiter engagement, milestone consistency metrics.  
- **Proof-of-Growth Explorer** – Visualize a student’s milestones, credentials, and endorsements as a timeline graph.

### 9.3 Hackathon “Wow” Ideas
- **Cohort dashboards** showing all alumni, their status, and aggregate stats for partner communities.  
- **One-click job package** – Generate the best-fit portfolio + endorsements + verifiable hash per job application.  
- **Open API** – Recruiters or EdTech partners can request candidate data (with consent) or trigger credential issuance.  
- **Tokenized incentives** – Off-chain points (future SPL token) for completing profiles, earning credentials, referrals, etc., redeemable for premium themes or featured placement.

---

## 11. Solana Architecture

| Layer | Responsibility |
| --- | --- |
| **Portfolio Program** | Stores `user_pubkey`, portfolio version, hash, timestamp. Guarantees that a public profile equals a specific on-chain fingerprint. |
| **Credential Program** | Registers issuers and mints non-transferable SBT credentials containing course/program metadata. |
| **Endorsement Program** | Records structured endorsements referencing role IDs with signer, relationship, rating, and note. |
| **Reputation Layer** | Off-chain score composed from credential count, issuer quality, endorsement weight, and milestone cadence. Anchoring references are on-chain for auditability. |

Heavy assets (images, PDFs, video) live in object storage (Supabase/S3 for MVP, optional IPFS/Arweave later). Only hashes and metadata pointers hit Solana to keep costs minimal.

---

## 12. System Architecture

### Frontend (Next.js)
- Onboarding, profile editor, milestone logger, skill lane manager.  
- Wallet connection + signing for publish and credential acceptance.  
- Issuer dashboard and recruiter view (post-MVP).  
- Public portfolio and Proof-of-Growth explorer screens.

### Backend
- Node/TypeScript service handling auth, CRUD, integrations, webhook ingestion.  
- Generates canonical portfolio JSON, computes hashes, and fires Solana transactions.  
- Job queue for PDF generation, scheduled syncs, and analytics aggregation.

### Database (SQL or Supabase)
- `users`, `profiles`, `skill_identities`, `roles`, `milestones`, `credentials`, `endorsements`, `analytics_events`.  
- Mirrors on-chain data for fast reads while referencing transaction IDs for verification.

---

## 13. Hackathon Demo Script

1. **Create profile live** – show onboarding, add a “Frontend Dev” hat, add roles and milestones.  
2. **Publish** – sign transaction, open Solana explorer to prove the portfolio hash was stored.  
3. **Show portfolio** – share link, highlight responsive UI, verified badge, timeline.  
4. **Issuer flow** – switch to issuer dashboard, mint an SBT credential to the same user. Refresh portfolio to show the new badge.  
5. **Proof-of-Growth Explorer** – display the timeline visualization correlating milestones with credentials and endorsements.  
6. **Recruiter search teaser** – filter by stack + credential count, open profile, verify fingerprint via on-chain hash.

Close with: “Students finally have proof-of-work **and** proof-of-trust. Myreliq leverages Solana to make portfolios verifiable, dynamic, and future-proof.”

---

## 14. Next Steps

- Finish wiring the MVP dashboards behind the marketing site.  
- Build the initial Solana programs (portfolio hash + demo credential).  
- Stand up issuer tooling and Proof-of-Growth explorer for the hackathon demo.  
- Line up partner institutions/communities for the first batch of verifiable credentials.

Myreliq already looks the part. With this documentation and architecture, the product pitch is now hackathon-ready and clearly grounded in Solana-native value. Let’s ship.
