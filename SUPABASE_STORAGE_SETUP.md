# Supabase Storage সেটআপ (ফ্রি)

Firebase Auth + Firestore আগের মতো থাকবে। শুধু **ছবি/PDF ফাইল** [Supabase Storage](https://supabase.com/) এ যাবে (ফ্রি টিয়ারে ~১GB)।

## ১. Supabase প্রজেক্ট

1. [supabase.com](https://supabase.com/) → **Start your project** (GitHub দিয়ে লগইন করা যায়)
2. নতুন প্রজেক্ট তৈরি করুন (ফ্রি প্ল্যান)

## ২. API কী কপি

**Project Settings → API**

- **Project URL** → `assets/js/supabase-config.js` এ `SUPABASE_URL`
- **anon public** key → `SUPABASE_ANON_KEY`

## ৩. Storage বাকেট

**Storage → New bucket**

- Name: `resources`
- **Public bucket**: ✅ চালু করুন (সবাই View করতে পারবে)

## ৪. Policies (জরুরি — আপলোড error হলে)

**Error:** `new row violates row-level security policy`

**সমাধান:** Supabase → **SQL Editor** → ফাইল `supabase-storage-fix.sql` খুলে **পুরোটা Run** করুন।

পুরনো policy ভুল ছিল (`resources/uid/file` চেক করত, কিন্তু আসল পাথ `uid/file`)। নতুন policy শুধু `bucket_id = 'resources'` চেক করে।

বাকেট **Public** ✅ অবশ্যই চালু রাখুন।

## ⚠️ API Key — গুরুত্বপূর্ণ

- `supabase-config.js` এ শুধু **anon public** key বসান
- **service_role key কখনো ব্রাউজার/ GitHub এ দেবেন না** — এটা পুরো ডাটাবেস নিয়ন্ত্রণ করে
- ভুলে service_role ব্যবহার করলে Supabase → Settings → API → **Rotate keys**

> নিরাপত্তা কড়া করতে চাইলে পরে Edge Function দিয়ে Firebase টোকেন ভেরিফাই করা যায়; এখন সহজ ফ্রি সেটআপ।

## ৫. GitHub Pages

এই ফাইলগুলো পushes করুন:

- `assets/js/supabase-config.js` (আপনার আসল URL/key সহ)
- `assets/js/fileStorage.js`
- `index.html`, `admin-dashboard.html`, `assets/js/app.js`

## ৬. টেস্ট

1. ছোট PDF/ছবি আপলোড
2. **View File** → URL `...supabase.co/storage/v1/object/public/resources/...` হওয়া উচিত
3. Supabase Dashboard → Storage → `resources` ফোল্ডারে ফাইল দেখা যাবে

## পুরনো Firebase Storage আপলোড

আগের `firebasestorage.googleapis.com` লিংক যেমন আছে তেমনই খুলবে; নতুন আপলোড Supabase এ যাবে।
