# DIS Student Study Portal — Deployment Readiness Review

> **Date:** 2026-06-01 | **Reviewer:** Automated Audit  
> **Status of Codebase:** Feature-complete, Phase 8 (Production Readiness & QA) finished

---

## How to Use This Checklist

Each item below is marked with one of three statuses:

| Mark | Meaning |
|------|---------|
| ✅ **Already Completed** | Done within the codebase or confirmed working — no action needed |
| ⚠️ **Needs Verification** | Likely done but must be confirmed in the cloud console/dashboard |
| ❌ **Must Be Completed Before Launch** | Missing or not yet done — **blocker for production** |

---

## 1. Git & GitHub

### 1.1 Repository Structure

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 1.1.1 | Repository initialized with `git init` | ⚠️ | Verify with `git status`. If no `.git` folder exists, run `git init` in the project root. |
| 1.1.2 | Remote origin configured (`git remote add origin <url>`) | ⚠️ | Confirm with `git remote -v`. Create a new **private** GitHub repo and add it as origin. |
| 1.1.3 | Branch strategy defined (`main` as production) | ⚠️ | Ensure `main` is the default branch. Consider creating a `develop` branch for ongoing work. |
| 1.1.4 | `.gitignore` file present and comprehensive | ❌ | **No `.gitignore` exists.** A complete `.gitignore` must be created (see Section 1.2). |
| 1.1.5 | `README.md` is complete and accurate | ✅ | [`README.md`](README.md) created in Phase 8.8 — covers tech stack, structure, architecture, data model, security, deployment guide. |
| 1.1.6 | No sensitive files accidentally staged | ❌ | After creating `.gitignore`, verify with `git status` that no `.env`, credentials, or backup files are tracked. |
| 1.1.7 | Release tagging strategy | ⚠️ | Recommended: use semantic versioning tags (`v1.0.0`, `v1.1.0`). Tag the first production release as `v1.0.0`. |

### 1.2 Required `.gitignore` Contents

The following patterns MUST be excluded from version control. Create a [`.gitignore`](.gitignore) file at the project root with:

```gitignore
# Dependencies
/node_modules/

# Environment & secrets
.env
.env.local
.env.*.local
*.pem
*.key
service-account*.json

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Editor / IDE
.vscode/settings.json
.idea/
*.swp
*.swo
*~

# Supabase
supabase/.temp/

# Firebase
.firebase/
firebase-debug.log*

# Build artifacts
dist/
build/
*.log

# Temporary files
tmp/
temp/
*.bak
*.orig
```

---

## 2. Firebase

### 2.1 Firestore

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 2.1.1 | Firestore database created in Firebase Console | ⚠️ | Verify at [Firebase Console](https://console.firebase.google.com/) → Firestore Database. Must be in **Native mode** (not Datastore mode). |
| 2.1.2 | `firestore.rules` deployed | ⚠️ | The rules file exists at [`firestore.rules`](firestore.rules) (155 lines, v2, 9 collections). Must be deployed via Firebase CLI: `firebase deploy --only firestore:rules` |
| 2.1.3 | Firestore rules tested — unauthorized reads denied | ⚠️ | Use the Rules Playground in Firebase Console to test: unauthenticated reads on any collection should be denied. |
| 2.1.4 | Firestore rules tested — student can only read own data | ⚠️ | Test in Rules Playground: simulate a student UID and verify they can read their own `users` doc but not other students' data. |
| 2.1.5 | Firestore rules tested — admin full access | ⚠️ | Test in Rules Playground: simulate admin role, verify CRUD access on all 9 collections. |

### 2.2 Firestore Composite Indexes

Single-field indexes are auto-created by Firestore. **Composite indexes must be created manually.** The following queries require composite indexes:

| # | Collection | Fields | Query Location | Status |
|---|-----------|--------|---------------|--------|
| 2.2.1 | `forum_replies` | `threadId` ASC + `createdAt` ASC | [`forum.js:195-198`](assets/js/portal/forum.js:195) | ❌ **Must create** |
| 2.2.2 | `forum_threads` | `courseCode` ASC + `isPinned` DESC + `createdAt` DESC | [`forum.js:217-221`](assets/js/portal/forum.js:217) | ❌ **Must create** |

**How to create indexes:** Go to Firebase Console → Firestore → Indexes → Add Composite Index, or deploy via `firestore.indexes.json`. Alternatively, run the queries in the browser — Firestore will return an error with a direct link to create the missing index.

> **Note:** The following single-field `where()` clauses do **not** need composite indexes (Firestore auto-creates single-field indexes): `studentUID`, `sessionId`, `role`, `universityUID`, `uid`.

### 2.3 Firebase Authentication

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 2.3.1 | Email/Password sign-in method enabled | ⚠️ | Firebase Console → Authentication → Sign-in method → Enable **Email/Password**. |
| 2.3.2 | Authorized domains configured | ⚠️ | Firebase Console → Authentication → Settings → Authorized domains. Add your production domain (e.g., `your-project.web.app`, `your-custom-domain.com`). |
| 2.3.3 | Password reset email templates configured (optional) | ⚠️ | Currently login page links to WhatsApp for password reset. If you want email-based reset, configure in Firebase Console → Authentication → Templates. |
| 2.3.4 | Firebase config (`apiKey`, `projectId`, etc.) is correct in [`app.js`](assets/js/app.js:7) | ⚠️ | Verify the config values match your Firebase project. The `apiKey` is public by design — this is acceptable for Firebase. |
| 2.3.5 | Admin account created manually | ⚠️ | The first admin must be created directly in Firestore (`users` collection, `role: "admin"`) or via Firebase Console Authentication. |

### 2.4 Firebase Storage (if used)

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 2.4.1 | Firebase Storage configured | ⚠️ | The project uses **Supabase Storage** for file uploads (not Firebase Storage). No Firebase Storage setup needed. |

---

## 3. Supabase

### 3.1 Project & API

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 3.1.1 | Supabase project created | ⚠️ | Verify at [Supabase Dashboard](https://app.supabase.com/). |
| 3.1.2 | Supabase URL and anon key in [`supabase-config.js`](assets/js/supabase-config.js) are correct | ⚠️ | The anon key is safe for client-side use. Verify values match your Supabase project settings. |
| 3.1.3 | Supabase project is on an active plan (not paused) | ⚠️ | Free tier projects pause after 1 week of inactivity. Ensure the project is active. |

### 3.2 Storage Bucket & RLS

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 3.2.1 | Storage bucket `portal-files` exists | ⚠️ | Must be created manually in Supabase Dashboard → Storage → New Bucket → name: `portal-files`, **public bucket** (unchecked "public bucket" actually — see 3.2.2). |
| 3.2.2 | RLS policies applied | ⚠️ | The SQL at [`supabase-storage-fix.sql`](supabase-storage-fix.sql) (55 lines) must be executed in Supabase SQL Editor. It creates authenticated-only SELECT/INSERT and owner-based UPDATE/DELETE policies. |
| 3.2.3 | RLS policies tested — unauthenticated uploads denied | ⚠️ | Test by attempting to upload without authentication. Should fail with 401/403. |
| 3.2.4 | File size limits configured | ⚠️ | The code has a 15MB client-side limit in [`upload.js:20-24`](assets/js/portal/upload.js:20). Supabase free tier has a 50MB/file limit by default. |
| 3.2.5 | Allowed MIME types configured (optional) | ⚠️ | The code accepts common document types in [`upload.js`](assets/js/portal/upload.js). Consider adding a Storage-level MIME restriction via RLS if needed. |

---

## 4. Security

### 4.1 Content Security Policy (CSP)

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 4.1.1 | CSP meta tag present on [`index.html`](index.html:21) | ✅ | Strict CSP with `script-src 'self' https://www.gstatic.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; connect-src https://*.firebaseio.com https://*.supabase.co https://firestore.googleapis.com wss://*.firebaseio.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; frame-src 'none';` |
| 4.1.2 | CSP meta tag present on [`login.html`](login.html:4) | ✅ | Same strict CSP as index.html. |
| 4.1.3 | CSP meta tag present on [`admin-dashboard.html`](admin-dashboard.html:4) | ✅ | Same strict CSP as index.html. |
| 4.1.4 | CSP meta tag present on [`dept-gate-2026.html`](dept-gate-2026.html:4) | ✅ | Same strict CSP as index.html. |
| 4.1.5 | `X-Frame-Options: DENY` present on all pages | ✅ | Present on all 4 HTML pages — clickjacking protection. |

### 4.2 Secret / Key Exposure

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 4.2.1 | Firebase `apiKey` is in [`app.js`](assets/js/app.js:7) — **this is acceptable** | ✅ | Firebase API keys are designed to be public in client-side code. They identify the project but do not grant access without Firebase Authentication + Security Rules. |
| 4.2.2 | Supabase `SUPABASE_ANON_KEY` is in [`supabase-config.js`](assets/js/supabase-config.js) — **this is acceptable** | ✅ | The anon key is the public key for Supabase. It respects RLS policies. The `service_role` key is **not** in the codebase — good. |
| 4.2.3 | No `.env` files committed | ⚠️ | Once `.gitignore` is created (Section 1.2), verify no `.env` files are tracked with `git status`. |
| 4.2.4 | No service account JSON files in repository | ⚠️ | Verify no `service-account*.json` files exist in the project directory. The `.gitignore` will prevent future commits. |

### 4.3 Production Security Checklist

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 4.3.1 | XSS protection — [`escapeHtml()`](assets/js/sanitize.js:13) used for all user-generated content | ✅ | All dynamic content rendered via `escapeHtml()` from [`sanitize.js`](assets/js/sanitize.js). |
| 4.3.2 | URL sanitization — [`sanitizeUrl()`](assets/js/sanitize.js:28) validates external links | ✅ | Resource links are sanitized before rendering. |
| 4.3.3 | No `eval()` or `innerHTML` with unsanitized data | ✅ | Verified in Phase 8.1 audit. |
| 4.3.4 | Firestore rules use `isAdmin()` and `isOwner()` helpers | ✅ | [`firestore.rules`](firestore.rules) v2 with granular access control. |
| 4.3.5 | Supabase Storage uses authenticated-only RLS | ✅ | [`supabase-storage-fix.sql`](supabase-storage-fix.sql) enforces authentication + owner-based write restrictions. |
| 4.3.6 | Default-deny catch-all in Firestore rules | ✅ | `firestore.rules` line 153: `match /{document=**} { allow read, write: if false; }` |

### 4.4 Backup & Recovery

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 4.4.1 | Firestore automated backups configured | ❌ | Firestore does **not** auto-backup. Set up: Firebase Console → Firestore → Import/Export, or use `gcloud firestore export` with a scheduled Cloud Function / Cloud Scheduler. |
| 4.4.2 | Supabase backup strategy | ⚠️ | Supabase Pro plan includes automated daily backups. On free tier, manually export via Dashboard → Database → Backups. |
| 4.4.3 | Manual export procedure documented | ❌ | Document steps: (1) `gcloud firestore export gs://[bucket]/[date]` for Firestore, (2) Supabase Dashboard → Database → Export for PostgreSQL. |

---

## 5. Deployment

### 5.1 Hosting Requirements

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 5.1.1 | Static hosting platform selected | ⚠️ | The project has a GitHub Pages workflow at [`.github/workflows/static.yml`](.github/workflows/static.yml). Alternative: Firebase Hosting (better integration) or Netlify/Vercel. |
| 5.1.2 | GitHub Pages workflow verified | ⚠️ | The workflow deploys on push to `main` branch. Action: push to `main` and check the Actions tab for successful deployment. |
| 5.1.3 | Custom domain (optional) | ⚠️ | If using a custom domain: configure DNS (CNAME for GitHub Pages, A records for Firebase Hosting) and add the domain to Firebase Authentication → Authorized domains. |
| 5.1.4 | HTTPS enforced | ⚠️ | GitHub Pages and Firebase Hosting both provide automatic HTTPS. Verify in production. |
| 5.1.5 | All pages load without console errors | ⚠️ | After deployment: open all 4 pages (`index.html`, `login.html`, `admin-dashboard.html`, `dept-gate-2026.html`) and check browser console for errors. |

### 5.2 CDN & Cache

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 5.2.1 | Static assets served from CDN | ✅ | Firebase SDK loaded from `www.gstatic.com`, Supabase from `cdn.jsdelivr.net`, Font Awesome from `cdnjs.cloudflare.com`. Tailwind via CDN script tag. |
| 5.2.2 | Cache headers configured for static assets | ⚠️ | GitHub Pages/Firebase Hosting set default cache headers. Consider adding cache-control for fingerprinted assets if migrating away from CDN scripts. |
| 5.2.3 | Logo and images load correctly | ⚠️ | Verify [`assets/img/logo.png`](assets/img/logo.png) loads on all pages after deployment. |

---

## 6. Monitoring & Maintenance

### 6.1 Error Logging

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 6.1.1 | Client-side error logging configured | ❌ | Currently only `console.error()` in catch blocks. Consider adding a lightweight error tracking service (e.g., Firebase Crashlytics for web, Sentry free tier, or a simple Cloud Function endpoint to log errors to Firestore). |
| 6.1.2 | Firestore rules deny logging in place | ✅ | Failed reads/writes are logged by Firebase automatically and visible in Firestore → Rules → Monitoring. |
| 6.1.3 | Supabase logs accessible | ⚠️ | Supabase Dashboard → Reports → Logs. Available on free tier but limited retention. Check after deployment. |

### 6.2 Analytics

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 6.2.1 | Usage analytics configured | ❌ | No analytics configured. Consider adding Firebase Analytics (free, integrates with Firebase) or Google Analytics for basic page views and user counts. |
| 6.2.2 | Admin dashboard shows key metrics | ✅ | Admin dashboard shows student count, routine count, resource count, forum thread count, notice count, and attendance records. |

### 6.3 Usage Monitoring

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 6.3.1 | Firestore usage monitoring | ⚠️ | Firebase Console → Firestore → Usage. Monitor reads/writes/deletes to stay within free quota (50K reads/day, 20K writes/day, 20K deletes/day). |
| 6.3.2 | Supabase usage monitoring | ⚠️ | Supabase Dashboard → Reports → Usage. Free tier: 1GB storage, 2GB transfer/month. |
| 6.3.3 | Firebase Auth usage monitoring | ⚠️ | Firebase Console → Authentication → Usage. Free tier: unlimited email/password sign-ins. |
| 6.3.4 | Budget alerts configured | ❌ | Set up billing alerts in Firebase Console (GCP Console → Billing → Budgets & alerts) and Supabase Dashboard → Billing. |

### 6.4 Backup Strategy

| # | Item | Status | Action / Notes |
|---|------|--------|----------------|
| 6.4.1 | Scheduled Firestore exports | ❌ | Implement via `gcloud firestore export` with Cloud Scheduler (daily). Or use Firebase Extension: "Export Collections to BigQuery". |
| 6.4.2 | Supabase automated backups | ⚠️ | Upgrade to Pro plan ($25/month) for automated daily backups, or manually export weekly. |
| 6.4.3 | Backup verification procedure | ❌ | After setting up backups: perform a test restore to a separate Firestore database to verify backup integrity. |

---

## 7. Production Go-Live Checklist

Execute these steps **in order** before going live:

### Step 1: Create `.gitignore`

- [ ] Create [`.gitignore`](.gitignore) using the template in Section 1.2
- [ ] Run `git status` — verify no sensitive files are staged

### Step 2: Initialize Git & Push to GitHub

- [ ] `git init` (if not already initialized)
- [ ] `git add .`
- [ ] `git commit -m "v1.0.0 — Production release of DIS Student Study Portal"`
- [ ] Create private GitHub repository
- [ ] `git remote add origin <repo-url>`
- [ ] `git push -u origin main`
- [ ] Tag release: `git tag -a v1.0.0 -m "Initial production release" && git push origin v1.0.0`

### Step 3: Deploy to Hosting

- [ ] Push to `main` triggers GitHub Pages deployment (verify in Actions tab)
- [ ] OR set up Firebase Hosting: `firebase init hosting` → `firebase deploy --only hosting`
- [ ] Verify all 4 pages load successfully on the production URL

### Step 4: Firebase Configuration (Console)

- [ ] Enable Email/Password sign-in in Authentication
- [ ] Add production domain to Authorized domains
- [ ] Deploy `firestore.rules`: `firebase deploy --only firestore:rules`
- [ ] Create composite indexes for `forum_replies` (threadId + createdAt) and `forum_threads` (courseCode + isPinned + createdAt)
- [ ] Create admin user manually in Firestore `users` collection or via Firebase Console
- [ ] Test Rules Playground for all user roles

### Step 5: Supabase Configuration (Console)

- [ ] Confirm storage bucket `portal-files` exists
- [ ] Execute [`supabase-storage-fix.sql`](supabase-storage-fix.sql) in SQL Editor
- [ ] Verify RLS policies are active (Dashboard → Storage → Policies)
- [ ] Test anonymous upload — should be denied

### Step 6: Security Verification

- [ ] Run through all 4 pages in production: check Console for CSP violations
- [ ] Test student login → dashboard → course detail → forum → resources
- [ ] Test admin login → manage routines → notices → students → forum → attendance
- [ ] Test unauthorized access: try accessing `admin-dashboard.html` as a student (should redirect)
- [ ] Test dept-gate login → admin dashboard redirect

### Step 7: Monitoring Setup

- [ ] Confirm Firestore usage visible in Console
- [ ] Set up budget alerts in GCP Billing
- [ ] (Optional) Add Firebase Analytics
- [ ] (Optional) Add error logging service

### Step 8: Documentation & Handoff

- [ ] Share `README.md` with any collaborators
- [ ] Document admin account credentials securely (not in the repo)
- [ ] Document Firebase project ID and Supabase project URL
- [ ] Document backup/restore procedures

---

## Summary

| Category | ✅ Completed | ⚠️ Needs Verification | ❌ Must Complete |
|----------|-------------|----------------------|------------------|
| 1. Git & GitHub | 1 | 3 | 3 |
| 2. Firebase | 0 | 9 | 2 |
| 3. Supabase | 0 | 8 | 0 |
| 4. Security | 8 | 2 | 2 |
| 5. Deployment | 1 | 5 | 0 |
| 6. Monitoring | 2 | 4 | 3 |
| 7. Go-Live Checklist | N/A | N/A | 8 steps |
| **Totals** | **12** | **31** | **18** |

### Critical Blockers (Must Fix Before Launch)

1. **❌ Create `.gitignore`** — No `.gitignore` file exists
2. **❌ Create Firestore composite indexes** — `forum_replies` and `forum_threads` queries will fail without them
3. **❌ Set up Firestore backups** — No automated backup configured
4. **❌ Configure budget alerts** — Prevent surprise billing
5. **⚠️ Deploy `firestore.rules`** — Rules file exists but must be deployed to Firebase
6. **⚠️ Execute `supabase-storage-fix.sql`** — RLS policies must be applied in SQL Editor
7. **⚠️ Create admin account** — First admin must be created manually in Firestore
8. **⚠️ Enable Email/Password auth** — Must be toggled in Firebase Console