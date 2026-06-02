# 🚀 ধাপে ধাপে ডিপ্লয়মেন্ট গাইড (বাংলা)

> ⚠️ **গুরুত্বপূর্ণ:** আপনি পুরাতন সবকিছু ডিলেট করে নতুন করে শুরু করবেন। তাই প্রথমে Firebase ও Supabase-এর পুরাতন ডেটা ক্লিনআপ করতে হবে, তারপর নতুন করে সেটআপ। নিচের ধাপগুলো ঠিক এই অর্ডারে follow করুন।

---

## ✅ আপনার বর্তমান অবস্থা

- ✅ নতুন কোড গিটহাবে পুশ করা হয়েছে
- ⬜ Firebase-এ পুরাতন ডেটা আছে — ক্লিনআপ করতে হবে
- ⬜ Supabase-এও পুরাতন ফাইল আছে — ক্লিনআপ করতে হবে

---

## 🧹 পর্ব ১: Firebase ক্লিনআপ (পুরাতন সব মুছে ফেলা)

---

### ধাপ ১: Firebase Console খুলুন

https://console.firebase.google.com -এ যান → আপনার Google অ্যাকাউন্ট দিয়ে লগইন করুন → **dis-student-portal** প্রজেক্টে ক্লিক করুন

---

### ধাপ ২: পুরাতন Authentication ইউজার ডিলেট করুন

**কোথায়:** বাম সাইডবার → **Build** → **Authentication** → **Users** ট্যাব

**কি করবেন:**

১. সব ইউজার সিলেক্ট করতে চাইলে: প্রতিটি ইউজারের বাম পাশে চেকবক্সে টিক দিয়ে টিক দিয়ে… তারপর উপরে **Delete** বাটনে ক্লিক করুন

২. **আরো সহজ উপায় (একসাথে সব ডিলেট):**
   - প্রতিটি ইউজারের ডান পাশে তিনটি ডট (⋮) মেনুতে ক্লিক করুন
   - **Delete account** এ ক্লিক করুন
   - কনফার্মেশন বক্সে **Delete** লিখে কনফার্ম করুন

৩. সব ইউজার ডিলেট না হওয়া পর্যন্ত প্রতিটির জন্য এটি করুন

**✅ ভেরিফাই:** Users ট্যাবে "No users found" বা খালি লিস্ট দেখা যাবে।

---

### ধাপ ৩: পুরাতন Firestore কালেকশন ডিলেট করুন

**কোথায়:** বাম সাইডবার → **Build** → **Firestore Database** → **Data** ট্যাব

**কি করবেন:**

আপনার যে কালেকশনগুলো থাকতে পারে (যেমন: `users`, `notices`, `routines`, `course_mappings`, `resources`, `attendance_sessions`, `attendance_records`, `forum_threads`, `forum_replies`):

প্রতিটি কালেকশনের জন্য:

১. কালেকশনের নামের উপর ক্লিক করুন (যেমন: `users`)
২. প্রতিটি ডকুমেন্টের উপর ক্লিক করুন → উপরের ডান কোনায় তিনটি ডট (⋮) → **Delete document**
৩. এটি সব ডকুমেন্টের জন্য repeat করুন
৪. সব ডকুমেন্ট ডিলেট হয়ে গেলে কালেকশন নিজে থেকেই disappear করে যাবে

**দ্রুত উপায় (Firebase CLI থাকলে):**
টার্মিনালে:
```
firebase firestore:delete --all-collections --project dis-student-portal
```

**✅ ভেরিফাই:** Data ট্যাবে কোনো কালেকশন নেই — "Start collection" বাটন দেখা যাবে।

---

### ধাপ ৪: পুরাতন Firestore Indexes ডিলেট করুন

**কোথায়:** Firestore Database → **Indexes** ট্যাব

**কি করবেন:**

১. যদি কোনো পুরাতন Composite Index থাকে, প্রতিটির পাশে তিনটি ডট (⋮) → **Delete**
২. সব ডিলেট করুন

**✅ ভেরিফাই:** Composite Indexes ট্যাব খালি — "No composite indexes" দেখা যাবে।

---

### ধাপ ৫: পুরাতন Firestore Rules রিপ্লেস করুন (নতুন Rules লাগান)

**কোথায়:** Firestore Database → **Rules** ট্যাব

**কি করবেন:**

১. এডিটরের সবকিছু সিলেক্ট করে ডিলিট করে দিন
২. আপনার কম্পিউটারে `firestore.rules` ফাইলটি VS Code বা নোটপ্যাড দিয়ে খুলুন
৩. পুরো কন্টেন্ট কপি করুন (Ctrl+A → Ctrl+C)
৪. Firebase এর Rules এডিটরে পেস্ট করুন (Ctrl+V)
৫. নীল **Publish** বাটনে ক্লিক করুন

**✅ ভেরিফাই:** সবুজ নোটিফিকেশন: "Rules published successfully"

---

## 🧹 পর্ব ২: Supabase ক্লিনআপ (পুরাতন সব মুছে ফেলা)

---

### ধাপ ৬: Supabase Dashboard খুলুন

https://app.supabase.com -এ যান → লগইন করুন → আপনার প্রজেক্টে ক্লিক করুন (URL: `wwcyxlrvnjtssuicfhwc.supabase.co`)

---

### ধাপ ৭: পুরাতন Storage Bucket ফাইল ডিলেট করুন

**কোথায়:** বাম সাইডবার → **Storage**

**কি করবেন:**

১. `resources` bucket-এ ক্লিক করুন (যদি থাকে)
২. সব ফাইল সিলেক্ট করুন (প্রতিটি ফাইলের বামে চেকবক্সে টিক দিন)
৩. উপরের লাল **Delete** বাটনে ক্লিক করুন
৪. কনফার্মেশন বক্সে **Delete** লিখে কনফার্ম করুন

**✅ ভেরিফাই:** Bucket-এর ভিতর কোনো ফাইল নেই — "No files found" দেখা যাবে।

---

### ধাপ ৮: পুরাতন RLS Policies ডিলেট করুন

**কোথায়:** Storage → `resources` bucket → **Policies** ট্যাব

**কি করবেন:**

১. যদি কোনো পুরাতন পলিসি থাকে, প্রতিটির ডান পাশে লাল ট্র্যাশ 🗑️ আইকনে ক্লিক করুন
২. কনফার্ম করুন
৩. সব পলিসি ডিলেট করুন

**✅ ভেরিফাই:** Policies ট্যাব খালি — "No policies" দেখা যাবে।

---

### ধাপ ৯: নতুন RLS SQL চালান

**কোথায়:** বাম সাইডবার → **SQL Editor**

**কি করবেন:**

১. সবুজ **New query** বাটনে ক্লিক করুন
২. আপনার কম্পিউটারে `supabase-storage-fix.sql` ফাইলটি নোটপ্যাড বা VS Code দিয়ে খুলুন
৩. পুরো কন্টেন্ট কপি করুন (Ctrl+A → Ctrl+C)
৪. Supabase SQL Editor-এ পেস্ট করুন (Ctrl+V)
৫. সবুজ **Run** বাটনে ক্লিক করুন (বা Ctrl+Enter চাপুন)

**✅ ভেরিফাই:** "Success. No rows returned" মেসেজ আসবে।

---

### ধাপ ১০: Storage Bucket নিশ্চিত করুন

**কোথায়:** বাম সাইডবার → **Storage**

**কি করবেন:**

১. `resources` নামে bucket আছে কিনা দেখুন
২. **না থাকলে:** **New bucket** → নাম: `resources` → "Public bucket" **আনচেক** রাখুন → **Create bucket**
৩. `resources` bucket-এ ক্লিক করুন → **Policies** ট্যাবে ক্লিক করুন
৪. ৪টি পলিসি দেখা যাবে:
   - "Authenticated users can read files"
   - "Authenticated users can upload files"
   - "Users can update their own files"
   - "Users can delete their own files"

**✅ ভেরিফাই:** ৪টি পলিসিই দেখা যাচ্ছে।

---

## 🔥 পর্ব ৩: Firebase নতুন সেটআপ

---

### ধাপ ১১: Authentication — Email/Password সাইন-ইন চালু করুন

**কোথায়:** Firebase Console → বাম সাইডবার → **Build** → **Authentication** → **Sign-in method** ট্যাব

**কি করবেন:**

১. **Email/Password** রোতে ক্লিক করুন (বা পেন্সিল ✏️ আইকনে)
২. **Enable** টগলটি ON করুন (নীল হবে)
৩. "Passwordless sign-in" — **টিক দিবেন না**
৪. নীল **Save** বাটনে ক্লিক করুন

**✅ ভেরিফাই:** Email/Password এর পাশে সবুজ "Enabled" ব্যাজ দেখা যাবে।

---

### ধাপ ১২: Authorized Domains যোগ করুন

**কোথায়:** Authentication → **Settings** ট্যাব

**কি করবেন:**

১. নিচে "Authorized domains" সেকশনে স্ক্রল করুন
২. **Add domain** বাটনে ক্লিক করুন
৩. আপনার গিটহাব পেজেসের ডোমেইন লিখুন: `আপনার-ইউজারনেম.github.io` (আপনার গিটহাব ইউজারনেম দিয়ে replace করুন)
৪. **Add** ক্লিক করুন

**✅ ভেরিফাই:** আপনার ডোমেইনটি লিস্টে দেখা যাবে।

---

### ধাপ ১৩: Composite Index তৈরি — forum_replies

**কোথায়:** Firestore Database → **Indexes** ট্যাব → নীল **Add Index** বাটন

**কি করবেন:**

নিচের মতো ফিলাপ করুন:

| ফিল্ড | কি লিখবেন/সিলেক্ট করবেন |
|-------|------------------------|
| **Collection ID** | `forum_replies` (লিখে দিন) |
| **Field 1** — Field path | `threadId` |
| **Field 1** — Order | `Ascending` (এমনিই থাকবে) |
| **Field 2** — Field path | `createdAt` (Add field ক্লিক করে যোগ করুন) |
| **Field 2** — Order | `Ascending` (এমনিই থাকবে) |
| **Query scope** | `Collection` (এমনিই থাকবে) |

নীল **Create Index** বাটনে ক্লিক করুন।

**✅ ভেরিফাই:** সবুজ নোটিফিকেশন। ২-৫ মিনিট অপেক্ষা করে রিফ্রেশ করলে "Building" → "Enabled" হবে।

---

### ধাপ ১৪: Composite Index তৈরি — forum_threads

**কোথায়:** একই পেজে → নীল **Add Index** বাটন

**কি করবেন:**

| ফিল্ড | কি লিখবেন/সিলেক্ট করবেন |
|-------|------------------------|
| **Collection ID** | `forum_threads` (লিখে দিন) |
| **Field 1** — Field path | `courseCode` |
| **Field 1** — Order | `Ascending` |
| **Field 2** — Field path | `isPinned` (Add field ক্লিক করে) |
| **Field 2** — Order | **`Descending`** (ড্রপডাউন থেকে বদলান) |
| **Field 3** — Field path | `createdAt` (Add field ক্লিক করে) |
| **Field 3** — Order | **`Descending`** (ড্রপডাউন থেকে বদলান) |
| **Query scope** | `Collection` |

নীল **Create Index** বাটনে ক্লিক করুন।

**✅ ভেরিফাই:** "Building" → "Enabled" হওয়া পর্যন্ত অপেক্ষা করুন।

---

### ধাপ ১৫: অ্যাডমিন অ্যাকাউন্ট তৈরি করুন

**পর্ব A — Authentication এ ইউজার তৈরি:**

**কোথায়:** Authentication → **Users** ট্যাব → নীল **Add user** বাটন

১. **Email:** আপনার অ্যাডমিন ইমেইল লিখুন (যেমন: `admin@yourschool.com`)
২. **Password:** একটি শক্ত পাসওয়ার্ড দিন (কমপক্ষে ৮ অক্ষর)
৩. **Add user** ক্লিক করুন
৪. ইউজার তৈরি হয়ে গেলে, তার **User UID** কপি করুন (ডান পাশে কপি আইকন 📋 আছে)

**পর্ব B — Firestore এ অ্যাডমিন রোল দিন:**

**কোথায়:** Firestore Database → **Data** ট্যাব

১. **Start collection** বাটনে ক্লিক করুন
   - Collection ID-তে লিখুন: `users`
   - **Next** ক্লিক করুন
২. **Document ID** ফিল্ডে — **আগে কপি করা User UID টি পেস্ট করুন** (খুব জরুরি — ID মিলতে হবে!)
৩. এখন ফিল্ড যোগ করুন। **Add field** বাটনে ক্লিক করে নিচের প্রতিটি ফিল্ড যোগ করুন:

   | Field নাম | Type | Value (যা লিখবেন) |
   |-----------|------|-------------------|
   | `name` | string | `Admin` |
   | `email` | string | `admin@yourschool.com` (যে ইমেইল দিয়েছেন) |
   | `role` | string | `admin` |
   | `universityUID` | string | `ADMIN-001` |
   | `batch` | string | `N/A` |
   | `semester` | string | `N/A` |
   | `createdAt` | timestamp | ঘড়ি 🕐 আইকনে ক্লিক → current time |

৪. **Save** ক্লিক করুন

**✅ ভেরিফাই:** `users` কালেকশনে আপনার অ্যাডমিন ডকুমেন্ট দেখা যাবে — `role: "admin"` আছে কিনা চেক করুন।

---

## 🌐 পর্ব ৪: গিটহাব পেজেস ডিপ্লয়মেন্ট

---

### ধাপ ১৬: গিটহাব পেজেস অন করুন

**কোথায়:** আপনার গিটহাব রিপোজিটরি → **Settings** ট্যাব → বাম সাইডবার → **Pages**

**কি করবেন:**

১. "Build and deployment" এর নিচে:
   - **Source:** ড্রপডাউন থেকে **GitHub Actions** সিলেক্ট করুন
২. ব্রাউজারের বাইরে গিয়ে আবার একবার কোড পুশ করুন (তাহলে workflow trigger হবে):

```
git add .
git commit -m "Trigger deployment"
git push
```

**✅ ভেরিফাই:**
১. উপরের **Actions** ট্যাবে ক্লিক করুন
২. "Deploy static content to Pages" workflow-তে সবুজ ✅ চেকমার্ক দেখুন
৩. workflow-তে ক্লিক করলে ডিপ্লয়মেন্ট URL পাবেন (যেমন: `https://আপনার-ইউজারনেম.github.io/dis-student-study-portal/`)
৪. URL টি খুলে দেখুন — আপনার সাইট লোড হচ্ছে কিনা

---

## ✅ পর্ব ৫: ফাইনাল টেস্টিং

---

### ধাপ ১৭: স্টুডেন্ট রেজিস্ট্রেশন ও লগইন টেস্ট

**কোথায়:** আপনার ডিপ্লয় করা সাইটের URL → `login.html`

**কি করবেন:**

১. **Register** ট্যাবে ক্লিক করুন
২. নিচের মতো ফিলাপ করুন:
   - Name: `Test Student`
   - University UID: `TEST-001`
   - Batch: `1`
   - Semester: `Spring 2025`
   - Email: `teststudent@example.com`
   - Password: `test123456`
৩. **Register** বাটনে ক্লিক করুন
৪. রেজিস্ট্রেশন সফল হলে স্টুডেন্ট ড্যাশবোর্ডে (`index.html`) চলে আসবে
৫. Logout করে আবার একই ইমেইল/পাসওয়ার্ড দিয়ে Login করুন

**✅ ভেরিফাই:** রেজিস্ট্রেশন + লগইন — দুটোই কাজ করে।

---

### ধাপ ১৮: অ্যাডমিন লগইন টেস্ট

**কোথায়:** আপনার ডিপ্লয় করা সাইটের URL → `dept-gate-2026.html`

**কি করবেন:**

১. অ্যাডমিন ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন (ধাপ ১৫-তে যেইটা তৈরি করেছেন)
২. `admin-dashboard.html`-এ চলে আসবে

**✅ ভেরিফাই:** অ্যাডমিন ড্যাশবোর্ডের সব প্যানেল লোড হচ্ছে:
- Routine, Notice, Course Mapping ফর্ম
- Student list
- Attendance section
- Forum panel
- Resources list

---

### ধাপ ১৯: অ্যাডমিন থেকে কিছু ডেটা তৈরি করুন

**কোথায়:** `admin-dashboard.html`

**কি করবেন:** (এগুলো করলে স্টুডেন্ট সাইটে ডেটা দেখাবে)

১. **Routine যোগ করুন:** একটি routine এন্ট্রি তৈরি করুন (সব ফিল্ড ফিলাপ করে Add)
২. **Notice যোগ করুন:** একটি notice লিখে Publish করুন
৩. **Course Mapping যোগ করুন:** একটি course mapping তৈরি করুন

**✅ ভেরিফাই:** Routine, Notice, Course Mapping — সব সফলভাবে যোগ হয়েছে।

---

### ধাপ ২০: স্টুডেন্ট সাইট থেকে সব চেক করুন

**কোথায়:** `index.html` (স্টুডেন্ট হিসেবে লগইন করা)

**কি করবেন:**

১. Course grid-এ course দেখা যাচ্ছে কিনা দেখুন
২. একটি course-এ ক্লিক করে detail view খুলুন
৩. **Resources** ট্যাবে একটি ফাইল বা লিংক আপলোড করুন
৪. **Forum** ট্যাবে একটি থ্রেড তৈরি করুন এবং রিপ্লাই দিন
৫. Routine এবং Notice ঠিকমতো দেখাচ্ছে কিনা চেক করুন

**✅ ভেরিফাই:** সবকিছু কাজ করছে।

---

### ধাপ ২১: Console Error Check

**কোথায়:** প্রতিটি পেজে (login.html, index.html, admin-dashboard.html, dept-gate-2026.html)

**কি করবেন:**

১. Chrome/Firefox-এ F12 চাপুন
২. **Console** ট্যাবে ক্লিক করুন
৩. কোনো **লাল (red) error** আছে কিনা দেখুন
৪. থাকলে সেগুলো নোট করুন

**✅ ভেরিফাই:** Console-এ কোনো লাল error নেই।

---

### ধাপ ২২: মোবাইলে টেস্ট করুন

**কোথায়:** আপনার মোবাইল ফোনের ব্রাউজার

**কি করবেন:**

১. ডিপ্লয় করা সাইটের URL ওপেন করুন
২. লগইন, কোর্স ব্রাউজ, ফোরাম — সব চেক করুন
৩. ল্যান্ডস্কেপ ও পোর্ট্রেট দুই মোডেই দেখুন

**✅ ভেরিফাই:** মোবাইলে সব ঠিকমতো দেখা যাচ্ছে ও কাজ করছে।

---

## 📋 কমপ্লিট চেকলিস্ট

| ধাপ | কাজ | প্লাটফর্ম | Done? |
|-----|-----|-----------|-------|
| ১ | Firebase Console খোলা | Firebase | ⬜ |
| ২ | পুরাতন Authentication ইউজার ডিলেট | Firebase | ⬜ |
| ৩ | পুরাতন Firestore কালেকশন ডিলেট | Firebase | ⬜ |
| ৪ | পুরাতন Composite Indexes ডিলেট | Firebase | ⬜ |
| ৫ | নতুন Firestore Rules Publish | Firebase | ⬜ |
| ৬ | Supabase Dashboard খোলা | Supabase | ⬜ |
| ৭ | পুরাতন Storage ফাইল ডিলেট | Supabase | ⬜ |
| ৮ | পুরাতন RLS Policies ডিলেট | Supabase | ⬜ |
| ৯ | নতুন RLS SQL Run | Supabase | ⬜ |
| ১০ | Storage bucket + policies check | Supabase | ⬜ |
| ১১ | Email/Password sign-in Enable | Firebase | ⬜ |
| ১২ | Authorized domains যোগ | Firebase | ⬜ |
| ১৩ | Composite Index: `forum_replies` | Firebase | ⬜ |
| ১৪ | Composite Index: `forum_threads` | Firebase | ⬜ |
| ১৫ | Admin account তৈরি | Firebase | ⬜ |
| ১৬ | GitHub Pages অন + push | GitHub | ⬜ |
| ১৭ | Student registration/login test | সাইট | ⬜ |
| ১৮ | Admin login test | সাইট | ⬜ |
| ১৯ | Admin থেকে data তৈরি | সাইট | ⬜ |
| ২০ | Student site feature test | সাইট | ⬜ |
| ২১ | Console error check | সাইট | ⬜ |
| ২২ | Mobile test | ফোন | ⬜ |

---

**🎉 ২২টি ধাপ শেষ হলে আপনার DIS Student Study Portal সম্পূর্ণ নতুনভাবে লাইভ!**

**মনে রাখবেন:** Firebase Console → **Usage and billing** — মাসে একবার চেক করবেন ফ্রি লিমিটের মধ্যে আছেন কিনা।