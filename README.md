# DIS Student Study Portal

**Department of Islamic Studies (DIS)** — A centralized academic hub connecting students and administrators through a shared platform for notices, class routines, course-based resource sharing, attendance tracking, discussion forums, and profile management.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Firestore Data Model](#firestore-data-model)
5. [Security](#security)
6. [Deployment](#deployment)
7. [Phase 8 Production Readiness](#phase-8-production-readiness)
8. [License](#license)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vanilla HTML/CSS/JS (ES modules), Tailwind CSS (CDN) |
| **Auth** | Firebase Authentication (email/password) |
| **Database** | Cloud Firestore (NoSQL, real-time via `onSnapshot`) |
| **File Storage** | Supabase Storage (`resources` bucket) |
| **Icons** | Font Awesome 6 (CDN) |
| **CDN** | Firebase 10.8.0, Tailwind CSS, Supabase JS 2.49.8 |
| **Hosting** | GitHub Pages (via `.github/workflows/static.yml`) |
| **i18n** | Custom JS module (English + Bangla) |

---

## Project Structure

```
DIS Student Study Portal/
├── index.html                  # Student portal (main SPA)
├── admin-dashboard.html        # Admin dashboard (SPA)
├── login.html                  # Login/Registration page
├── dept-gate-2026.html         # Admin gateway page
├── firestore.rules             # Firestore security rules (v2)
├── supabase-storage-fix.sql    # Supabase Storage RLS policies
├── SUPABASE_STORAGE_SETUP.md   # Supabase setup guide (Bangla)
├── README.md                   # This file
├── .github/workflows/static.yml # GitHub Pages deploy workflow
├── assets/
│   ├── css/
│   │   ├── portal-ui.css       # Portal-wide UI animations & components
│   │   ├── toast.css           # Toast notification styles
│   │   └── ui-states.css       # Loading/empty/error state styles
│   ├── img/
│   │   ├── logo.png            # Portal logo
│   │   └── DIS Student Portal Logo.ai  # Logo source (Adobe Illustrator)
│   └── js/
│       ├── app.js              # Firebase init (auth + firestore)
│       ├── supabase-config.js  # Supabase URL + anon key
│       ├── state.js            # Centralized state management (Proxy-based)
│       ├── toast.js            # Toast notification system
│       ├── sanitize.js         # HTML/URL sanitization utilities
│       ├── noticeFormat.js     # Notice markdown formatter (bold, italic, newlines)
│       ├── form-validation.js  # Client-side form validation engine
│       ├── ui-states.js        # Loading/empty/error/skeleton UI renderers
│       ├── portal-ui.js        # Portal-wide UI: nav menu, ripple, modals, scroll shadow
│       ├── fileStorage.js      # Supabase Storage abstraction (upload/download/delete)
│       ├── courseUtils.js      # Course identity, resource matching, categorization
│       ├── academicTerms.js    # Academic year/trimester/session helpers
│       ├── i18n.js             # Internationalization (en + bn translations)
│       ├── admin/
│       │   ├── attendanceManager.js  # Attendance sessions, marking, reports
│       │   ├── courseMapper.js       # Course-to-semester mapping CRUD
│       │   ├── forumManager.js       # Admin forum thread management
│       │   ├── noticeManager.js      # Notice CRUD + formatting toolbar
│       │   ├── resourceManager.js    # Admin resource list + edit
│       │   ├── routineManager.js     # Routine CRUD + tabbed display
│       │   └── studentManager.js     # Student table, password reset, delete
│       └── portal/
│           ├── attendance.js   # Student attendance summary + history
│           ├── courses.js      # Course grid, detail view, resource rendering
│           ├── forum.js        # Forum thread/reply rendering + interaction
│           ├── routines.js     # Routine + notice real-time listeners
│           └── upload.js       # Resource upload/share/edit/delete flows
├── plans/
│   ├── audit-report.md         # Comprehensive audit report (Phase 5)
│   └── phase-3-roadmap.md      # Phase 3 development roadmap
└── .vscode/
    └── extensions.json         # VS Code recommended extensions
```

---

## Architecture Overview

### Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌───────────────┐
│  Firebase    │────▶│  Firestore   │◀────│  Supabase     │
│  Auth        │     │  (NoSQL)     │     │  Storage      │
│  (email/pw)  │     │  Real-time   │     │  (files only) │
└──────────────┘     └──────────────┘     └───────────────┘
       │                    │                      │
       ▼                    ▼                      ▼
┌──────────────────────────────────────────────────────┐
│                  Browser (SPA)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ index.html  │  │ admin.html  │  │  login.html  │  │
│  │ (student)   │  │ (admin)     │  │  (auth)      │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│         │                │                │          │
│         └────────────────┼────────────────┘          │
│                          ▼                           │
│              ┌─────────────────────┐                 │
│              │  JS Modules (ESM)   │                 │
│              │  portal/ + admin/   │                 │
│              └─────────────────────┘                 │
└──────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **No bundler/build step** — Pure ES modules loaded directly in the browser via `import` from CDN. Zero build pipeline.
2. **SPA architecture** — Both `index.html` and `admin-dashboard.html` are single-page applications with in-page navigation (no routing library).
3. **Dependency injection** — File storage loader (`fileStorage.js`) is dynamically imported and injected via `setFileStorageLoader()` to avoid circular dependencies.
4. **State management** — Centralized `state.js` using JavaScript Proxy for reactive state updates with subscriber pattern.
5. **Real-time data** — Firestore `onSnapshot()` listeners provide live updates for routines, notices, resources, attendance, and forum threads.

---

## Firestore Data Model

### Collections

| Collection | Document ID | Fields (key) | Write Access | Read Access |
|------------|------------|--------------|--------------|-------------|
| **notices** | auto-id | `content`, `createdAt`, `createdBy` | Admin only | All authenticated |
| **routines** | auto-id | `day`, `startTime`, `endTime`, `course`, `teacher`, `room`, `gender`, `boardType`, `session` | Admin only | All authenticated |
| **course_mappings** | `{year}-{termNum}-{term}-{sessionYear}` | `courses[]` (array of `{code, title, teacher}`) | Admin only | All authenticated |
| **resources** | auto-id | `userId`, `userName`, `courseCode`, `courseTitle`, `teacher`, `title`, `type`, `url`, `urlType`, `storagePath`, `createdAt` | Auth (own) | All authenticated |
| **users** | `{firebaseAuthUID}` | `name`, `email`, `role`, `universityUID`, `batchNumber`, `phone`, `bloodGroup`, `profileYear`, `profileTermNum`, `profileTerm`, `profileSessionYear`, `trimester`, `emergencyName`, `emergencyPhone`, `profilePic` | Self + Admin | All authenticated |
| **attendance_sessions** | auto-id | `courseCode`, `courseTitle`, `date`, `createdBy`, `createdAt` | Admin only | All authenticated |
| **attendance_records** | auto-id | `sessionId`, `studentUID`, `studentName`, `courseCode`, `courseTitle`, `status`, `date`, `markedAt`, `markedBy` | Admin only | Own records + Admin |
| **forum_threads** | auto-id | `courseCode`, `title`, `content`, `authorUID`, `authorName`, `createdAt`, `lastReplyAt`, `replyCount` | Auth (own) | All authenticated |
| **forum_replies** | auto-id | `threadId`, `content`, `authorUID`, `authorName`, `createdAt` | Auth (own) | All authenticated |

### Firestore Rules Summary

All rules use version 2 with helper functions `isAuthenticated()`, `isAdmin()`, and `isOwner()`. A default `match /{document=**} { allow read, write: if false; }` catch-all denies unlisted collections. The full rules are in [`firestore.rules`](firestore.rules).

---

## Security

### Content Security Policy (CSP)

All 4 HTML pages have a strict CSP header via `<meta http-equiv="Content-Security-Policy">`:

- `default-src 'self'`
- `script-src` — CDN only (Firebase, Tailwind, Font Awesome, jsDelivr)
- `style-src` — self + CDN
- `connect-src` — self + any HTTPS/WSS (Firestore + Supabase)
- `frame-ancestors 'none'` — No embedding
- `object-src 'none'` — No plugins
- `base-uri 'self'` — No base tag hijacking
- `form-action 'self'` — Forms only submit to same origin

### Additional Headers

- `X-Frame-Options: DENY` on all pages
- `rel="noopener noreferrer"` on all `window.open()` calls

### Supabase Storage RLS

The [`supabase-storage-fix.sql`](supabase-storage-fix.sql) file contains policies that:
- Require authentication for all operations (SELECT, INSERT, UPDATE, DELETE)
- Restrict UPDATE/DELETE to file owners (matched by `storage.foldername(name)[1] = auth.uid()`)

### Sanitization

- [`sanitize.js`](assets/js/sanitize.js) provides `escapeHtml()` for XSS prevention and `sanitizeUrl()` for safe URL handling
- All user-generated content rendered via `innerHTML` passes through `escapeHtml()` first

---

## Deployment

### GitHub Pages

The project is deployed via GitHub Pages using the workflow at [`.github/workflows/static.yml`](.github/workflows/static.yml). On every push to `main`, the entire repository is deployed.

### Pre-Deployment Checklist

1. **Firestore Rules** — Deploy [`firestore.rules`](firestore.rules) in Firebase Console → Firestore → Rules
2. **Firestore Indexes** — Ensure composite indexes exist for queries with `where()` + `orderBy()` clauses. Check Firebase Console → Firestore → Indexes for any missing index errors.
3. **Supabase RLS** — Run [`supabase-storage-fix.sql`](supabase-storage-fix.sql) in Supabase SQL Editor
4. **Supabase Config** — Verify [`assets/js/supabase-config.js`](assets/js/supabase-config.js) has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY` (never commit `service_role` key)
5. **Supabase Bucket** — Ensure `resources` bucket exists and is set to **Public**
6. **Firebase Config** — Verify [`assets/js/app.js`](assets/js/app.js) has correct Firebase config
7. **CORS** — Supabase Storage bucket should have CORS configured for the GitHub Pages domain

### Quick Start (Local Development)

No build step required. Serve with any static HTTP server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using VS Code Live Server extension
```

Then open `http://localhost:8080/login.html` in a browser.

---

## Phase 8 Production Readiness

Phase 8 was completed on 2026-06-01 with the following improvements:

### 8.1 Full Code Audit
- Removed dead code files: `assets/js/auth.js`, `assets/js/admin.js`
- Removed unused exports: `getStateSnapshot()`, `toastContainer()`, `sanitizeAndFormat()`, `fillDynamicArchiveYearSelect()`, `initDynamicAcademicYears()`
- Consolidated duplicate HTML escaping: [`noticeFormat.js`](assets/js/noticeFormat.js) now imports `escapeHtml` from [`sanitize.js`](assets/js/sanitize.js)
- Consolidated duplicate attendance constants: [`admin/attendanceManager.js`](assets/js/admin/attendanceManager.js) imports from [`portal/attendance.js`](assets/js/portal/attendance.js)

### 8.2 Firestore Query Audit
- Added `where("role", "==", "student")` filters to 2 admin student queries (reducing unnecessary reads)
- Merged duplicate forum thread count listener in admin dashboard by extending `renderAdminForumPanel()` with optional `countEl` parameter

### 8.3 Error Handling Review
- Added `try/catch` blocks to 5 unprotected async operations:
  - Admin auth check in [`admin-dashboard.html`](admin-dashboard.html)
  - Attendance marking handler (2 nested try/catch blocks)
  - Attendance session deletion handler
  - Auth redirect check in [`login.html`](login.html)
  - Sign-out promise chain (`.catch()` fallback)
- All existing error paths already use `showToast()` for user-friendly notifications

### 8.4 Memory Leak Review
- Fixed 3 orphaned `onSnapshot` listeners in [`index.html`](index.html):
  - `resourcesUnsubscribe` — stored for cleanup on sign-out
  - `attendanceUnsubscribe` — stored for cleanup on sign-out
  - `cleanupRoutineNotices` — now called on sign-out (was defined but never invoked)
- Forum `forumUnsubscribe` already properly cleaned up in `closeCourseDetail()`
- Admin dashboard `onSnapshot` listeners are acceptable (single-page, no in-page navigation)

### 8.5 Accessibility Audit
- Verified: skip-to-content links, `aria-live` regions, `aria-expanded`/`aria-controls` on interactive elements, `role="menu"`/`role="status"` attributes, labels on all form inputs
- All 4 pages pass basic accessibility checks

### 8.6 Mobile Device Audit
- Verified: all 4 HTML pages have `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Tailwind CSS responsive utilities used throughout
- Tables use `overflow-x-auto` wrappers for mobile scrolling

### 8.7 Deployment Checklist
- **Firestore Rules**: Version 2, comprehensive role-based access across 9 collections, default-deny catch-all
- **Supabase RLS**: Authenticated-only policies for SELECT/INSERT/UPDATE/DELETE with owner-based restrictions
- **CSP Headers**: Strict CSP on all 4 pages with CDN allowlisting, `frame-ancestors 'none'`, `X-Frame-Options: DENY`
- **CDN**: Firebase, Tailwind, Font Awesome, Supabase all loaded from CDN with CSP compatibility

---

## License

© 2026 DIS Student Portal. All rights reserved by Zubair Muhammad Zami.