# 🚀 DIS Student Study Portal — Step-by-Step Deployment Guide

> **Follow this guide from top to bottom. Do not skip steps.**  
> Each step tells you: where to go → what to click → what to do → how to verify.

---

## Before You Start

You will need access to these accounts:

| Platform | URL | What You'll Do |
|----------|-----|----------------|
| **GitHub** | https://github.com | Push code, enable hosting |
| **Firebase Console** | https://console.firebase.google.com | Deploy rules, create indexes, enable auth, create admin |
| **Supabase Dashboard** | https://app.supabase.com | Run SQL, verify storage bucket |

Your project details (from the codebase):

- **Firebase Project ID:** `dis-student-portal`
- **Firebase Auth Domain:** `dis-student-portal.firebaseapp.com`
- **Supabase Project URL:** `https://wwcyxlrvnjtssuicfhwc.supabase.co`
- **Supabase Bucket Name:** `resources`

---

## Phase 1: Push Code to GitHub

---

### Step 1 — Initialize Git (if not already done)

**Priority:** Required before launch

**Where:** Your computer's terminal (open VS Code terminal: `Ctrl + `` `)

**What to do:**

```
git init
```

**How to verify:** You should see: `Initialized empty Git repository in E:/DIS Student Study Portal/.git/`

---

### Step 2 — Stage all files and make the first commit

**Priority:** Required before launch

**Where:** Same terminal

**What to do:**

```
git add .
git commit -m "v1.0.0 — Initial production release of DIS Student Study Portal"
```

**How to verify:** You should see a list of all files being committed. No errors should appear.

---

### Step 3 — Create a GitHub repository

**Priority:** Required before launch

**Where:** https://github.com → Sign in → Click your profile picture (top-right) → **Your repositories** → Click the green **New** button

**What to do:**

1. **Repository name:** Type `dis-student-study-portal` (or any name you prefer)
2. **Description (optional):** "DIS Student Study Portal — A student portal for Dhaka Imperial School"
3. **Privacy:** Choose **Private** (recommended — your Firebase keys are in the code)
4. **Do NOT** check "Add a README file" — you already have one
5. **Do NOT** check "Add .gitignore" — you already have one
6. Click the green **Create repository** button

**How to verify:** You should see a page with instructions for "…or push an existing repository from the command line."

---

### Step 4 — Connect your local project to GitHub and push

**Priority:** Required before launch

**Where:** Same terminal

**What to do:** Copy the commands shown on the GitHub page (they will look like this):

```
git remote add origin https://github.com/YOUR-USERNAME/dis-student-study-portal.git
git branch -M main
git push -u origin main
```

**How to verify:**  
1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files: `index.html`, `login.html`, `admin-dashboard.html`, `dept-gate-2026.html`, `firestore.rules`, `README.md`, `.gitignore`, and all folders (`assets/`, `plans/`, `.github/`)

---

### Step 5 — Create a version tag

**Priority:** Recommended

**Where:** Same terminal

**What to do:**

```
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0
```

**How to verify:** Go to your GitHub repo → Click **Releases** (right sidebar) → You should see `v1.0.0`.

---

## Phase 2: Firebase — Firestore Security Rules

---

### Step 6 — Open Firebase Console

**Priority:** Required before launch

**Where:** https://console.firebase.google.com

**What to do:**

1. Sign in with your Google account
2. Click the project named **dis-student-portal** (or look for it in the list)
3. If you don't see it, you may need to create it — but the code already references this project ID, so it should already exist

**How to verify:** You should see the project dashboard with cards like "Authentication", "Firestore Database", "Hosting", etc.

---

### Step 7 — Deploy Firestore Security Rules

**Priority:** Required before launch — without this, anyone can read/write your database

**Where:** Firebase Console → Left sidebar → **Build** → **Firestore Database**

**What to do:**

1. Click the **Rules** tab at the top
2. You will see the current rules (probably just `allow read, write: if true;` — which is insecure)
3. Delete everything in the rules editor
4. Open your project folder on your computer → open [`firestore.rules`](firestore.rules) in Notepad or VS Code
5. Copy the entire content (Ctrl+A, Ctrl+C)
6. Paste it into the Firebase rules editor (Ctrl+V)
7. Click the blue **Publish** button

**How to verify:**  
1. After clicking Publish, you should see a green success notification: "Rules published successfully"
2. The rules editor should now show the full 155 lines of rules starting with `rules_version = '2';`

---

### Step 8 — Test Firestore Rules (Rules Playground)

**Priority:** Required before launch

**Where:** Same page — Firestore Database → **Rules** tab → Click **Rules Playground** (it's a button near the top)

**What to do:**

**Test 1 — Unauthenticated user (should be DENIED):**
1. Keep "Authenticated" toggle **OFF** (gray)
2. Under "Build a query", select:
   - Collection: `notices`
   - Action: `get`
3. Click **Run**
4. **Expected result:** ❌ Denied (red X) — "Simulated read denied"

**Test 2 — Authenticated student reading own data:**
1. Turn "Authenticated" toggle **ON** (blue)
2. In the "Firebase UID" field, type: `test-student-123`
3. Under "Custom claims (optional)", click **Add field** and add:
   - Key: `role`
   - Value: `student`
4. Under "Build a query", select:
   - Collection: `users`
   - Action: `get`
   - Document ID: `test-student-123`
5. Click **Run**
6. **Expected result:** ✅ Allowed (green check)

**Test 3 — Student trying to read another student's data:**
1. Keep same settings as Test 2
2. Change Document ID to: `another-student-456`
3. Click **Run**
4. **Expected result:** ❌ Denied (red X)

**How to verify:** All three tests produce the expected results above. If any test gives the wrong result, re-check the rules you pasted in Step 7.

---

## Phase 3: Firebase — Firestore Composite Indexes

---

### Step 9 — Create Composite Index: forum_replies

**Priority:** Required before launch — the forum reply feature will fail without this

**Where:** Firebase Console → Left sidebar → **Build** → **Firestore Database** → Click the **Indexes** tab

**What to do:**

1. Click the blue **Add Index** button
2. Fill in the form:
   - **Collection ID:** type `forum_replies`
   - **Field 1:** 
     - Field path: `threadId`
     - Order: `Ascending` (keep as is)
   - **Field 2:** Click **Add field** →
     - Field path: `createdAt`
     - Order: `Ascending` (keep as is)
   - **Query scope:** Leave as `Collection` (default)
3. Click the blue **Create Index** button

**How to verify:**  
1. You should see a green notification: "Index creation started"
2. The index will appear in the list with status "Building" (yellow)
3. Wait 2-5 minutes and refresh the page — it should change to "Enabled" (green)

---

### Step 10 — Create Composite Index: forum_threads

**Priority:** Required before launch — the forum thread listing will fail without this

**Where:** Same page — Firestore Database → **Indexes** tab

**What to do:**

1. Click the blue **Add Index** button
2. Fill in the form:
   - **Collection ID:** type `forum_threads`
   - **Field 1:**
     - Field path: `courseCode`
     - Order: `Ascending` (keep as is)
   - **Field 2:** Click **Add field** →
     - Field path: `isPinned`
     - Order: `Descending` (change to Descending)
   - **Field 3:** Click **Add field** →
     - Field path: `createdAt`
     - Order: `Descending` (change to Descending)
   - **Query scope:** Leave as `Collection` (default)
3. Click the blue **Create Index** button

**How to verify:** Same as Step 9 — wait for status to change from "Building" to "Enabled".

---

## Phase 4: Firebase — Authentication

---

### Step 11 — Enable Email/Password Sign-In

**Priority:** Required before launch — users cannot sign up or log in without this

**Where:** Firebase Console → Left sidebar → **Build** → **Authentication**

**What to do:**

1. Click the **Sign-in method** tab at the top
2. Look for **Email/Password** in the list of providers
3. Click the pencil icon (✏️) next to "Email/Password" (or click the row)
4. Toggle the **Enable** switch to ON (blue)
5. **Do NOT** check "Passwordless sign-in" — leave it off
6. Click the blue **Save** button

**How to verify:** The Email/Password row should now show "Enabled" with a green badge.

---

### Step 12 — Add Authorized Domains

**Priority:** Required before launch — login will be blocked on unrecognized domains

**Where:** Firebase Console → Left sidebar → **Build** → **Authentication** → Click the **Settings** tab

**What to do:**

1. Scroll down to the **Authorized domains** section
2. You will see `localhost` and `dis-student-portal.firebaseapp.com` already listed
3. If you plan to use GitHub Pages, click **Add domain** and type:
   - `YOUR-USERNAME.github.io` (replace with your actual GitHub username)
4. If you have a custom domain (e.g., `portal.yourschool.com`), add it too
5. Click **Add** for each

**How to verify:** Your domains appear in the authorized domains list.

---

## Phase 5: Firebase — Create Admin Account

---

### Step 13 — Create the First Admin User

**Priority:** Required before launch — you need an admin account to manage the portal

**Where:** Firebase Console → Left sidebar → **Build** → **Authentication** → Click the **Users** tab

**What to do:**

**Part A — Create the user in Authentication:**

1. Click the blue **Add user** button
2. Fill in:
   - **Email:** Your admin email (e.g., `admin@dis-school.edu`)
   - **Password:** A strong password (at least 8 characters)
3. Click **Add user**
4. After creation, you will see the user in the list. **Copy the "User UID"** (a long string of letters and numbers) — you'll need it in Part B. Click the copy icon next to it.

**Part B — Give the user admin role in Firestore:**

1. In the left sidebar, go to **Build** → **Firestore Database** → Click the **Data** tab
2. Click **Start collection** (if `users` doesn't exist yet) or click on the **users** collection
3. If creating new:
   - **Collection ID:** type `users`
   - Click **Next**
4. Click **Add document**
5. In the **Document ID** field, **paste the User UID** you copied in Part A (this is critical — the document ID must match the auth UID)
6. Add these fields (click **Add field** for each):

   | Field Name | Type | Value |
   |------------|------|-------|
   | `name` | string | `Admin` |
   | `email` | string | `admin@dis-school.edu` (same email you used) |
   | `role` | string | `admin` |
   | `universityUID` | string | `ADMIN-001` |
   | `batch` | string | `N/A` |
   | `semester` | string | `N/A` |
   | `createdAt` | timestamp | (click the clock icon to set to current time) |

7. Click **Save**

**How to verify:**  
1. Go to your deployed site → open `dept-gate-2026.html`
2. Log in with the admin email and password you just created
3. You should be redirected to `admin-dashboard.html`
4. If you see the admin dashboard with all management panels, it worked ✅

---

## Phase 6: Supabase — Storage RLS Policies

---

### Step 14 — Open Supabase Dashboard

**Priority:** Required before launch

**Where:** https://app.supabase.com

**What to do:**

1. Sign in with your account
2. You should see a project with the URL `https://wwcyxlrvnjtssuicfhwc.supabase.co`
3. Click on that project to open it

**How to verify:** You see the project dashboard with cards like "Database", "Storage", "Authentication", etc.

---

### Step 15 — Run the Storage RLS SQL

**Priority:** Required before launch — without this, file uploads may be insecure

**Where:** Supabase Dashboard → Left sidebar → **SQL Editor** (it's under the "Database" section or in the main sidebar)

**What to do:**

1. Click **SQL Editor** in the left sidebar
2. Click the green **New query** button
3. A blank editor opens. Now:
   - Open your project folder on your computer → open [`supabase-storage-fix.sql`](supabase-storage-fix.sql) in Notepad or VS Code
   - Copy the entire content (Ctrl+A, Ctrl+C)
   - Paste it into the Supabase SQL editor (Ctrl+V)
4. Click the green **Run** button (or press Ctrl+Enter)
5. You should see a result message: "Success. No rows returned"

**How to verify:**  
1. No error messages appeared
2. You see "Success" in the results panel

---

### Step 16 — Verify Storage Bucket and RLS Policies

**Priority:** Required before launch

**Where:** Supabase Dashboard → Left sidebar → **Storage**

**What to do:**

**Part A — Check bucket exists:**
1. Click **Storage** in the left sidebar
2. You should see a bucket named `resources`
3. If you don't see it, click **New bucket** → name it `resources` → **uncheck** "Public bucket" → click **Create bucket**

**Part B — Check RLS policies:**
1. Click on the `resources` bucket
2. Click the **Policies** tab (near the top)
3. You should see 4 policies:
   - "Authenticated users can read files"
   - "Authenticated users can upload files"
   - "Users can update their own files"
   - "Users can delete their own files"
4. If you see these policies, the SQL from Step 15 worked ✅

**How to verify:** All 4 policies are visible in the Policies tab.

---

## Phase 7: Deploy to Hosting (GitHub Pages)

---

### Step 17 — Enable GitHub Pages

**Priority:** Required before launch

**Where:** Your GitHub repository → Click the **Settings** tab (top bar)

**What to do:**

1. In the left sidebar, click **Pages** (under "Code and automation")
2. Under "Build and deployment":
   - **Source:** Select **GitHub Actions** (the project already has the workflow file)
3. That's it — the deployment will happen automatically when you push to `main`

**How to verify:**  
1. Click the **Actions** tab in your repository
2. You should see a workflow running (or already completed) called "Deploy static content to Pages"
3. If it's green with a ✅, the deployment succeeded
4. Click on the workflow run → you'll see the deployment URL (looks like `https://YOUR-USERNAME.github.io/dis-student-study-portal/`)

---

### Step 18 — Test the Deployed Site

**Priority:** Required before launch

**Where:** Your browser — open the deployment URL from Step 17

**What to do:** Test all 4 pages:

1. **Login page:** Go to `YOUR-URL/login.html`
   - Try registering a new student account
   - Try logging in with that account
   - Verify you land on the student dashboard

2. **Student dashboard:** Go to `YOUR-URL/index.html`
   - Verify the course grid loads
   - Click on a course → verify the detail view opens
   - Try uploading a resource (if you have course mappings)
   - Check the forum tab
   - Check the attendance tab

3. **Admin gateway:** Go to `YOUR-URL/dept-gate-2026.html`
   - Log in with your admin account
   - Verify you land on the admin dashboard

4. **Admin dashboard:** Go to `YOUR-URL/admin-dashboard.html`
   - Verify all panels load (Routines, Notices, Course Mappings, Students, Attendance, Forum, Resources)
   - Try adding a routine, a notice, and a course mapping
   - Verify the student list shows registered students

**How to verify:** All 4 pages load without errors. Check the browser console (F12 → Console) — no red errors should appear.

---

## Phase 8: Backup Setup

---

### Step 19 — Set Up Firestore Automated Backups

**Priority:** Recommended (not required for launch, but do it within the first week)

**Where:** Google Cloud Console — https://console.cloud.google.com

**What to do:**

1. Sign in with the same Google account used for Firebase
2. At the top, make sure the project `dis-student-portal` is selected (click the dropdown if needed)
3. In the left sidebar, go to **Firestore** → **Import/Export**
4. Click **Export**
5. Choose:
   - **Export entire database** (or choose specific collections)
   - **Destination:** You'll need a Cloud Storage bucket. If you don't have one:
     - Go to **Cloud Storage** → **Buckets** → **Create bucket**
     - Name it `dis-student-portal-backups`
     - Choose region (pick the one closest to Bangladesh — probably `asia-south1` or `asia-southeast1`)
     - Click **Create**
6. Back in the Export page, select your bucket as destination
7. Click **Export**

**To automate (schedule daily):**
1. Go to **Cloud Scheduler** (from the left sidebar or search bar)
2. Click **Create job**
3. Set:
   - **Name:** `firestore-daily-backup`
   - **Frequency:** `0 2 * * *` (runs daily at 2 AM)
   - **Timezone:** `Asia/Dhaka`
   - **Target:** Pub/Sub
   - This requires additional setup; for now, manual exports are sufficient

**How to verify:** After clicking Export, wait a few minutes. Go to Cloud Storage → your bucket → you should see the export files.

---

### Step 20 — Supabase Backup (Manual)

**Priority:** Recommended

**Where:** Supabase Dashboard → Left sidebar → **Database** → **Backups**

**What to do:**

1. Note: On the **free plan**, Supabase does NOT auto-backup. You need to upgrade to Pro ($25/month) for automated daily backups.
2. For manual backup: Go to **Database** → **Backups** → follow the on-screen instructions
3. Alternatively, from the SQL Editor, you can export data manually:
   - Go to **SQL Editor**
   - Run: `SELECT * FROM storage.objects;` to see your files
   - The data is in PostgreSQL tables; you can use the **Table Editor** to view and export CSV

**How to verify:** You have a copy of your data saved somewhere outside Supabase.

---

## Phase 9: Budget Alerts & Monitoring

---

### Step 21 — Set Up Firebase Billing Alert

**Priority:** Recommended — prevents surprise charges

**Where:** Google Cloud Console → https://console.cloud.google.com → Make sure `dis-student-portal` is selected

**What to do:**

1. In the left sidebar, go to **Billing** (if you don't see it, search "Billing" in the top search bar)
2. Click **Budgets & alerts** in the left sidebar
3. Click **Create budget**
4. Set:
   - **Name:** `Monthly budget alert`
   - **Scope:** Select the `dis-student-portal` project
   - **Amount:** Set to `$5.00` (or your preferred limit)
   - **Alert thresholds:** 
     - 50% of budget
     - 75% of budget
     - 90% of budget
     - 100% of budget
   - **Email recipients:** Add your email
5. Click **Create**

**How to verify:** You should see the budget in the list. You'll receive email alerts when spending approaches the thresholds.

---

### Step 22 — Check Firebase Free Tier Limits

**Priority:** Recommended — know your limits before launch

**Where:** Firebase Console → Left sidebar (scroll to bottom) → **Usage and billing**

**What to do:**

1. Review the free tier limits:
   - **Firestore:** 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, 1 GB storage
   - **Authentication:** Unlimited email/password sign-ins (free forever)
   - **Hosting:** 10 GB storage, 360 MB/day transfer (if using Firebase Hosting)

2. Monitor this page weekly after launch

**How to verify:** You know what the free limits are and can watch for approaching them.

---

### Step 23 — Check Supabase Free Tier Limits

**Priority:** Recommended

**Where:** Supabase Dashboard → Left sidebar → **Reports** → **Usage**

**What to do:**

1. Review free tier limits:
   - **Storage:** 1 GB total
   - **Transfer:** 2 GB/month
   - **Database:** 500 MB
   - Projects pause after 1 week of inactivity

**How to verify:** You know the limits and can check usage here after launch.

---

## Phase 10: Final Go-Live Testing

---

### Step 24 — Student Registration & Login Flow

**Priority:** Required before launch

**Where:** Your deployed site → `login.html`

**What to do:**

1. Open the register tab
2. Fill in:
   - Name: `Test Student`
   - University UID: `TEST-001`
   - Batch: `1`
   - Semester: `Spring 2025`
   - Email: `teststudent@example.com`
   - Password: `test123456`
3. Click **Register**
4. After registration, you should be redirected to the student dashboard
5. Log out (click the menu button → Logout)
6. Log back in with the same email and password

**How to verify:** Registration and login both work without errors.

---

### Step 25 — Admin Login Flow

**Priority:** Required before launch

**Where:** Your deployed site → `dept-gate-2026.html`

**What to do:**

1. Enter your admin email and password (from Step 13)
2. Click **Login**
3. You should be redirected to `admin-dashboard.html`

**How to verify:** Admin dashboard loads with all management panels visible.

---

### Step 26 — Cross-Device Test

**Priority:** Required before launch

**What to do:**

1. Open the deployed site on your mobile phone
2. Test: login, register, browse courses, open forum
3. Verify all pages are readable and buttons are tappable
4. Test on both Wi-Fi and mobile data

**How to verify:** Everything works on mobile without layout issues or broken buttons.

---

### Step 27 — Browser Console Check

**Priority:** Required before launch

**Where:** Your deployed site — each of the 4 pages

**What to do:**

1. Open each page in Chrome
2. Press F12 to open Developer Tools
3. Click the **Console** tab
4. Look for any **red error messages**
5. If you see errors, note them down and investigate

**How to verify:** No red errors in the console on any page.

---

## Complete Checklist Summary

| Step | Task | Priority | Done? |
|------|------|----------|-------|
| 1 | Initialize Git (`git init`) | Required | ⬜ |
| 2 | First commit (`git commit`) | Required | ⬜ |
| 3 | Create GitHub repository | Required | ⬜ |
| 4 | Push code to GitHub (`git push`) | Required | ⬜ |
| 5 | Create version tag (`v1.0.0`) | Recommended | ⬜ |
| 6 | Open Firebase Console | Required | ⬜ |
| 7 | Deploy Firestore rules | Required | ⬜ |
| 8 | Test Firestore rules (Playground) | Required | ⬜ |
| 9 | Create composite index: `forum_replies` | Required | ⬜ |
| 10 | Create composite index: `forum_threads` | Required | ⬜ |
| 11 | Enable Email/Password sign-in | Required | ⬜ |
| 12 | Add authorized domains | Required | ⬜ |
| 13 | Create admin account | Required | ⬜ |
| 14 | Open Supabase Dashboard | Required | ⬜ |
| 15 | Run Storage RLS SQL | Required | ⬜ |
| 16 | Verify storage bucket & policies | Required | ⬜ |
| 17 | Enable GitHub Pages | Required | ⬜ |
| 18 | Test the deployed site | Required | ⬜ |
| 19 | Set up Firestore backups | Recommended | ⬜ |
| 20 | Supabase backup (manual) | Recommended | ⬜ |
| 21 | Set up billing alert | Recommended | ⬜ |
| 22 | Check Firebase free tier limits | Recommended | ⬜ |
| 23 | Check Supabase free tier limits | Recommended | ⬜ |
| 24 | Test student registration & login | Required | ⬜ |
| 25 | Test admin login flow | Required | ⬜ |
| 26 | Cross-device test (mobile) | Required | ⬜ |
| 27 | Browser console check (all pages) | Required | ⬜ |

---

**🎉 When all 27 steps are complete, your DIS Student Study Portal is LIVE!**