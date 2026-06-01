# 🚀 ধাপে ধাপে ডিপ্লয়মেন্ট গাইড (বাংলা)

## প্রথমে গিটহাবে কোড পুশ করুন

---

### ধাপ ১: গিট ইনিশিয়ালাইজ ও কমিট

টার্মিনাল খুলুন (VS Code এ `Ctrl + `` ` চাপুন) এবং নিচের কমান্ডগুলো একের পর এক চালান:

```
git init
```

```
git add .
```

```
git commit -m "v1.0.0 - Production release"
```

---

### ধাপ ২: গিটহাবে রিপোজিটরি তৈরি করুন

১. https://github.com -এ যান এবং লগইন করুন
২. উপরের ডান কোণায় আপনার প্রোফাইল পিকচারে ক্লিক করুন → **Your repositories**
৩. সবুজ **New** বাটনে ক্লিক করুন
৪. **Repository name** এ লিখুন: `dis-student-study-portal`
৫. **Private** সিলেক্ট করুন (এটা জরুরি — আপনার Firebase key গুলো কোডে আছে)
৬. "Add a README file" — এটা **টিক দিবেন না**
৭. "Add .gitignore" — এটা **টিক দিবেন না**
৮. সবুজ **Create repository** বাটনে ক্লিক করুন

---

### ধাপ ৩: কোড পুশ করুন

গিটহাব রিপোজিটরি তৈরি করার পর যে পেইজ আসবে, সেখানে "…or push an existing repository from the command line" এর নিচের কমান্ডগুলো কপি করে টার্মিনালে পেস্ট করে চালান:

```
git remote add origin https://github.com/আপনার-ইউজারনেম/dis-student-study-portal.git
git branch -M main
git push -u origin main
```

(আপনার-ইউজারনেম এর জায়গায় আপনার গিটহাব ইউজারনেম বসবে — গিটহাবই ঠিক করে দিবে)

**✅ ভেরিফাই:** গিটহাব রিপোজিটরি পেজ রিফ্রেশ করুন — সব ফাইল দেখা যাবে।

---

### ধাপ ৪: গিটহাব পেজেস অন করুন

১. আপনার গিটহাব রিপোজিটরিতে যান
২. উপরের **Settings** ট্যাবে ক্লিক করুন
৩. বাম সাইডবার থেকে **Pages** এ ক্লিক করুন
৪. "Build and deployment" এর নিচে:
   - **Source:** ড্রপডাউন থেকে **GitHub Actions** সিলেক্ট করুন
৫. হয়ে গেছে — কিছু করার দরকার নেই

**✅ ভেরিফাই:** উপরের **Actions** ট্যাবে ক্লিক করুন → "Deploy static content to Pages" নামে একটি workflow চলবে → সবুজ ✅ আসলে ডিপ্লয়মেন্ট শেষ। তার উপর ক্লিক করলে URL পাবেন (যেমন: `https://আপনার-ইউজারনেম.github.io/dis-student-study-portal/`)

---

## 🔥 Firebase কনসোলে যা যা করতে হবে

---

### ধাপ ৫: Firebase Console খুলুন

https://console.firebase.google.com -এ যান → আপনার Google অ্যাকাউন্ট দিয়ে লগইন করুন → **dis-student-portal** প্রজেক্টে ক্লিক করুন

---

### ধাপ ৬: Firestore Rules ডিপ্লয় করুন

**কোথায়:** বাম সাইডবার → **Build** → **Firestore Database**

**কি করবেন:**

১. উপরের **Rules** ট্যাবে ক্লিক করুন
২. এডিটরের সবকিছু সিলেক্ট করে ডিলিট করে দিন
৩. আপনার কম্পিউটারে `firestore.rules` ফাইলটি নোটপ্যাড বা VS Code দিয়ে খুলুন
৪. পুরো কন্টেন্ট কপি করুন (Ctrl+A → Ctrl+C)
৫. Firebase এর Rules এডিটরে পেস্ট করুন (Ctrl+V)
৬. নীল **Publish** বাটনে ক্লিক করুন

**✅ ভেরিফাই:** সবুজ নোটিফিকেশন আসবে "Rules published successfully"

---

### ধাপ ৭: Composite Index তৈরি করুন — forum_replies

**কোথায়:** Firestore Database → উপরের **Indexes** ট্যাবে ক্লিক করুন

**কি করবেন:**

১. নীল **Add Index** বাটনে ক্লিক করুন
২. নিচের মতো ফিলাপ করুন:

   **Collection ID:** লিখুন → `forum_replies`

   **Field 1:**
   - Field path: লিখুন → `threadId`
   - Order: `Ascending` (এমনিই থাকবে)

   **Field 2:** (নিচে "Add field" লিংকে ক্লিক করে Add করুন)
   - Field path: লিখুন → `createdAt`
   - Order: `Ascending` (এমনিই থাকবে)

   **Query scope:** `Collection` (এমনিই থাকবে)

৩. নীল **Create Index** বাটনে ক্লিক করুন

**✅ ভেরিফাই:** সবুজ নোটিফিকেশন আসবে "Index creation started"। ২-৫ মিনিট পর পেজ রিফ্রেশ করলে স্ট্যাটাস "Building" থেকে "Enabled" হবে।

---

### ধাপ ৮: Composite Index তৈরি করুন — forum_threads

**কোথায়:** একই পেজে — Firestore Database → **Indexes** ট্যাব

**কি করবেন:**

১. নীল **Add Index** বাটনে ক্লিক করুন
২. নিচের মতো ফিলাপ করুন:

   **Collection ID:** লিখুন → `forum_threads`

   **Field 1:**
   - Field path: লিখুন → `courseCode`
   - Order: `Ascending`

   **Field 2:** (Add field এ ক্লিক করে)
   - Field path: লিখুন → `isPinned`
   - Order: **`Descending`** (ড্রপডাউন থেকে বদলে দিন)

   **Field 3:** (Add field এ ক্লিক করে)
   - Field path: লিখুন → `createdAt`
   - Order: **`Descending`** (ড্রপডাউন থেকে বদলে দিন)

   **Query scope:** `Collection`

৩. নীল **Create Index** বাটনে ক্লিক করুন

**✅ ভেরিফাই:** আগের মত — "Building" থেকে "Enabled" হওয়া পর্যন্ত অপেক্ষা করুন।

---

### ধাপ ৯: Email/Password সাইন-ইন চালু করুন

**কোথায়:** বাম সাইডবার → **Build** → **Authentication**

**কি করবেন:**

১. উপরের **Sign-in method** ট্যাবে ক্লিক করুন
২. **Email/Password** রোতে ক্লিক করুন (বা পেন্সিল ✏️ আইকনে ক্লিক করুন)
৩. **Enable** টগলটি ON করুন (নীল হবে)
৪. "Passwordless sign-in" — **টিক দিবেন না**
৫. নীল **Save** বাটনে ক্লিক করুন

**✅ ভেরিফাই:** Email/Password এর পাশে সবুজ "Enabled" ব্যাজ দেখা যাবে।

---

### ধাপ ১০: Authorized Domains যোগ করুন

**কোথায়:** Authentication → উপরের **Settings** ট্যাবে ক্লিক করুন

**কি করবেন:**

১. নিচে "Authorized domains" সেকশনে স্ক্রল করুন
২. **Add domain** বাটনে ক্লিক করুন
৩. আপনার গিটহাব পেজেসের ডোমেইন লিখুন: `আপনার-ইউজারনেম.github.io`
৪. **Add** ক্লিক করুন

**✅ ভেরিফাই:** আপনার ডোমেইনটি লিস্টে দেখা যাবে।

---

### ধাপ ১১: অ্যাডমিন অ্যাকাউন্ট তৈরি করুন

**পর্ব ১ — Authentication এ ইউজার তৈরি:**

**কোথায়:** Authentication → **Users** ট্যাব

১. নীল **Add user** বাটনে ক্লিক করুন
২. **Email:** আপনার অ্যাডমিন ইমেইল লিখুন (যেমন: `admin@yourschool.com`)
৩. **Password:** একটি শক্ত পাসওয়ার্ড দিন (কমপক্ষে ৮ অক্ষর)
৪. **Add user** ক্লিক করুন
৫. ইউজার তৈরি হয়ে গেলে, লিস্টে তার **User UID** কপি করুন (ডান পাশে কপি আইকন আছে)

**পর্ব ২ — Firestore এ অ্যাডমিন রোল দিন:**

**কোথায়:** বাম সাইডবার → **Build** → **Firestore Database** → **Data** ট্যাব

১. **Start collection** এ ক্লিক করুন (যদি `users` কালেকশন না থাকে)
   - Collection ID: লিখুন → `users`
   - Next ক্লিক করুন
২. (যদি `users` কালেকশন আগে থেকেই থাকে, তাহলে সেটাতে ক্লিক করুন, তারপর **Add document** এ ক্লিক করুন)
৩. **Document ID** ফিল্ডে — **আগে কপি করা User UID টি পেস্ট করুন** (খুব জরুরি!)
৪. নিচের ফিল্ডগুলো Add করুন (একটার পর একটা **Add field** ক্লিক করে):

   | Field | Type | Value (যা লিখবেন) |
   |-------|------|-------------------|
   | `name` | string | `Admin` |
   | `email` | string | `admin@yourschool.com` (যে ইমেইল দিয়েছেন) |
   | `role` | string | `admin` |
   | `universityUID` | string | `ADMIN-001` |
   | `batch` | string | `N/A` |
   | `semester` | string | `N/A` |
   | `createdAt` | timestamp | (ঘড়ির আইকনে ক্লিক করে current time সিলেক্ট করুন) |

৫. **Save** ক্লিক করুন

**✅ ভেরিফাই:** ডিপ্লয় করা সাইটে `dept-gate-2026.html` খুলে অ্যাডমিন ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন → `admin-dashboard.html` এ চলে আসবে।

---

## 🟢 Supabase কনসোলে যা যা করতে হবে

---

### ধাপ ১২: Supabase Dashboard খুলুন

https://app.supabase.com -এ যান → লগইন করুন → আপনার প্রজেক্টে ক্লিক করুন (URL: `wwcyxlrvnjtssuicfhwc.supabase.co`)

---

### ধাপ ১৩: Storage RLS SQL চালান

**কোথায়:** বাম সাইডবার → **SQL Editor**

**কি করবেন:**

১. **New query** বাটনে ক্লিক করুন (সবুজ)
২. আপনার কম্পিউটারে `supabase-storage-fix.sql` ফাইলটি নোটপ্যাড দিয়ে খুলুন
৩. পুরো কন্টেন্ট কপি করুন (Ctrl+A → Ctrl+C)
৪. Supabase SQL Editor এ পেস্ট করুন (Ctrl+V)
৫. সবুজ **Run** বাটনে ক্লিক করুন (বা Ctrl+Enter)

**✅ ভেরিফাই:** "Success. No rows returned" মেসেজ আসবে।

---

### ধাপ ১৪: Storage Bucket check করুন

**কোথায়:** বাম সাইডবার → **Storage**

**কি করবেন:**

১. `resources` নামে একটি bucket আছে কিনা দেখুন
২. **না থাকলে:** **New bucket** → নাম: `resources` → "Public bucket" **আনচেক** রাখুন → **Create bucket**
৩. `resources` bucket-এ ক্লিক করুন → **Policies** ট্যাবে ক্লিক করুন
৪. ৪টি পলিসি দেখা যাবে:
   - "Authenticated users can read files"
   - "Authenticated users can upload files"
   - "Users can update their own files"
   - "Users can delete their own files"

**✅ ভেরিফাই:** ৪টি পলিসিই দেখা যাচ্ছে।

---

## ✅ ফাইনাল টেস্টিং

---

### ধাপ ১৫: ডিপ্লয় করা সাইট টেস্ট করুন

আপনার গিটহাব পেজেস URL এ যান (Actions ট্যাব থেকে পাবেন):

**১. student registration টেস্ট:**
- `login.html` খুলুন → Register ট্যাবে ক্লিক করুন
- ফর্ম ফিলাপ করে একটি টেস্ট স্টুডেন্ট তৈরি করুন
- লগইন করে দেখুন স্টুডেন্ট ড্যাশবোর্ড আসে কিনা

**২. admin login টেস্ট:**
- `dept-gate-2026.html` খুলুন
- অ্যাডমিন ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন
- অ্যাডমিন ড্যাশবোর্ডের সব প্যানেল লোড হয় কিনা দেখুন

**৩. resource upload টেস্ট:**
- স্টুডেন্ট হিসেবে লগইন করে একটি কোর্সে গিয়ে একটি ফাইল আপলোড করুন
- ফাইলটি আপলোড হয়ে ডাউনলোড করতে পারছেন কিনা দেখুন

**৪. forum টেস্ট:**
- একটি কোর্সের Forum ট্যাবে গিয়ে একটি থ্রেড তৈরি করুন
- রিপ্লাই দিন

**৫. Console error check:**
- F12 চাপুন → Console ট্যাবে ক্লিক করুন
- কোনো লাল (red) error নেই তো?

**✅ ভেরিফাই:** সবকিছু ঠিকমতো কাজ করছে, কোনো error নেই।

---

### ধাপ ১৬: মোবাইলে টেস্ট করুন

আপনার মোবাইল ফোন দিয়ে ডিপ্লয় করা সাইট খুলুন:
- লগইন করুন
- কোর্স ব্রাউজ করুন
- ফোরাম দেখুন
- সব পেজ ঠিকমতো দেখা যায় কিনা চেক করুন

**✅ ভেরিফাই:** মোবাইলে সবকিছু ঠিকমতো দেখা যাচ্ছে ও কাজ করছে।

---

## 📋 চেকলিস্ট (এক নজরে)

| ধাপ | কাজ | status |
|-----|-----|--------|
| ১ | `git init` + `git commit` | ⬜ |
| ২ | GitHub repository তৈরি | ⬜ |
| ৩ | `git push` | ⬜ |
| ৪ | GitHub Pages অন করা | ⬜ |
| ৫ | Firebase Console খোলা | ⬜ |
| ৬ | Firestore Rules ডিপ্লয় | ⬜ |
| ৭ | Composite Index: `forum_replies` | ⬜ |
| ৮ | Composite Index: `forum_threads` | ⬜ |
| ৯ | Email/Password sign-in চালু | ⬜ |
| ১০ | Authorized domains যোগ | ⬜ |
| ১১ | Admin account তৈরি | ⬜ |
| ১২ | Supabase Dashboard খোলা | ⬜ |
| ১৩ | Storage RLS SQL চালানো | ⬜ |
| ১৪ | Storage bucket check | ⬜ |
| ১৫ | ডিপ্লয় করা সাইট টেস্ট | ⬜ |
| ১৬ | মোবাইলে টেস্ট | ⬜ |

---

**🎉 সবগুলো ধাপ শেষ হলে আপনার পোর্টাল লাইভ!**

**মনে রাখবেন:** Firebase Console-এ গিয়ে মাসে একবার **Usage and billing** চেক করবেন — ফ্রি লিমিটের মধ্যে আছেন কিনা দেখার জন্য।