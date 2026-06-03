/**
 * i18n.js — Shared translation module for DIS Student Portal
 * Consolidates translations from all pages: portal, auth, gateway
 * All pages import { t, getLang, setLang, getDir } from this module.
 */

// ── All translations ──────────────────────────────────────────────

const TRANSLATIONS = {

    /* ---------- portal (index.html) ---------- */
    portal: {
        en: {
            navTitle: "DIS Student Portal", btnNavLogin: "Login / Register", btnMyProfile: "My Profile", btnLogout: "Logout",
            warningBanner: "⚠️ Profile incomplete! Please open My Profile and fill mandatory fields.",
            heroTitle: "Islamic Studies Student Portal", heroSubtitle: "Open platform to share class notes and lectures.",
            lblNoticeBoard: "📢 Notice Board", lblDailyRoutine: "⏳ Daily Routine Update", lblPermanentRoutine: "📅 Permanent Weekly Schedule Board",
            lblCourses: "Class Shared Resources Archive", lblSubTitleCourses: "Select year, trimester and session above to browse any semester.",
            sat: "Saturday", sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", fri: "Friday", friWeekend: "Weekend",
            noCourses: "No live courses mapped for this semester yet (admin panel).", noSharedFiles: "No shared files yet.",
            activeCourse: "Active Course", faculty: "Faculty",
            btnAddResource: "Upload", btnViewMaterials: "View materials", resourceCount: "shared items",
            sharedAcrossSemesters: "Same course in other semesters shares these files.",
            courseDetailResourcesTitle: "Study materials by type", courseDetailBack: "Back to courses",
            lblNavLang: "Language", lblNavMenuTitle: "Account & settings",
            loginToUpload: "Login to upload", uploadOwnSemOnly: "Upload only in your running semester",
            m_title: "My Personal Profile Card", m_pic: "Upload Profile Picture", m_name: "Full Name",
            m_uid: "University ID (UID)", m_batch: "Batch Number",
            m_academic_title: "Academic Trimester Status", m_emg_title: "⚠️ Emergency Data",
            m_phone: "My Mobile Number", m_emg_name: "Emergency Contact Name", m_emg_phone: "Emergency Contact Mobile",
            m_pass_title: "🔒 Change Password (optional)", m_pass_ph: "Min. 6 characters",
            m_blood: "Blood Group", m_blood_select: "Select Blood Group",
            btnCancelProfile: "Cancel", btnSaveProfileText: "Save Profile",
            sm_title: "Share Study Material", sm_name: "Contributor Name", sm_locked_course: "Locked Course",
            sm_topic: "Note / Lecture Title", sm_type: "Resource Type",
            sm_topic_ph: "e.g. Chapter 1 — Introduction notes", sm_cancel: "Cancel", sm_submit: "Publish Live",
            lblUploadMethod: "Choose upload method:", methodFile: "📁 Direct File", methodLink: "🔗 Cloud Link",
            lblSelectFile: "Select file (max 2MB)", lblLinkUrl: "Paste public link (must be Public)",
            shareUrl_ph: "https://drive.google.com/... (Public)",
            uploadSizeWarn: "⚠️ Direct upload limit: 2MB. If your file is larger, upload it to Google Drive or YouTube first, set sharing to Public, then paste the link here.",
            alertFileSizeAuto: "🔴 This file is over 2MB! Switched to Cloud Link mode. Upload to Drive/YouTube, set the link to Public, then paste it below.",
            lockSemBefore: "🔒 This file will be saved under your running semester",
            lockSemAfter: ". Classmates can view it in this course. You cannot upload to other semesters.",
            typePdf: "PDF / Handnote", typeVideo: "Video / YouTube Link", typeAudio: "Audio / Voice", typeImage: "Image / Document",
            alertLoginUpload: "Please login first to upload.",
            alertSemLock: "🔒 Locked! You can only upload in your own running semester.",
            alertFileSize: "🔴 File exceeds 2MB! Upload to Drive/YouTube and paste a public link.",
            alertPickFile: "Select a file under 2MB.", alertPasteLink: "Paste a link.",
            alertPublished: "Resource published successfully!",
            alertProfileSaved: "Profile saved!", alertProfileRequired: "Emergency info and blood group are required!",
            alertPassMin: "Password must be at least 6 characters.",
            alertPageLoadError: "Page load error. Please refresh or login again.",
            alertThreadPostFailed: "Failed to post thread. Please try again.",
            alertReplyPostFailed: "Failed to post reply. Please try again.",
            alertThreadDeleteFailed: "Failed to delete thread.",
            alertReplyDeleteFailed: "Failed to delete reply.",
            genderMale: "Male Section", genderFemale: "Female Section", genderCombined: "Combined Section",
            noClasses: "No classes.", loadFail: "Failed to load courses. Refresh the page.",
            displaySemSync: "Syncing...", byAuthor: "By:", profileIncomplete: "Profile incomplete!",
            loadingCourses: "Loading courses...",
            btnView: "View", btnEdit: "Edit", btnDelete: "Delete", btnViewFile: "Open file",
            confirmDeleteResource: "Delete this uploaded resource permanently?",
            alertResourceDeleted: "Resource deleted.",
            sm_edit_title: "Edit Study Material", sm_save: "Save changes",
            alertResourceUpdated: "Resource updated successfully!",
            alertUploading: "Uploading file, please wait...",
            alertNotOwner: "You can only edit or delete resources you uploaded.",
            fileLinkMissing: "File link missing — please upload again.",
            alertInvalidFileUrl: "Upload failed: no valid file URL. Check Supabase config (anon key) and public bucket.",
            alertOpenFileFailed: "Could not open file. Delete and upload again, or check Supabase Storage bucket.",
            myAttendance: "My Attendance", noAttendanceYet: "No attendance records yet.", overall: "Overall",
            presentOf: "present of", totalClasses: "total classes", perCourse: "Per Course",
            date: "Date", course: "Course", title: "Title", status: "Status",
            valProfileNameRequired: "Full name is required", valProfileUIDRequired: "University ID is required",
            valProfileBatchRequired: "Batch number is required", valProfilePhoneRequired: "Phone number is required",
            valProfileBloodRequired: "Blood group is required", valProfileEmgNameRequired: "Emergency contact name is required",
            valProfileEmgPhoneRequired: "Emergency phone is required",
            // Forum
            forumTab: "Discussion", forumNoThreads: "No discussions yet. Start the first one!",
            forumNewThread: "New Thread", forumThreadTitle: "Title", forumThreadTitlePH: "Ask a question or start a discussion...",
            forumThreadContent: "Details", forumThreadContentPH: "Describe your question or topic...",
            forumSubmitThread: "Post Thread", forumReply: "Reply", forumReplyPH: "Write a reply...",
            forumSubmitReply: "Send", forumCancelReply: "Cancel", forumReplies: "replies",
            forumPinned: "Pinned", forumLocked: "Locked", forumBy: "by",
            forumJustNow: "just now", forumMinutesAgo: "m ago", forumHoursAgo: "h ago", forumDaysAgo: "d ago",
            forumAlertTitleRequired: "Please enter a title.", forumAlertContentRequired: "Please enter a message.",
            forumAlertThreadPosted: "Thread posted!", forumAlertReplyPosted: "Reply posted!",
            forumAlertThreadDeleted: "Thread deleted.", forumAlertReplyDeleted: "Reply deleted.",
            forumConfirmDeleteThread: "Delete this thread and all replies?", forumConfirmDeleteReply: "Delete this reply?",
            forumLockedNotice: "This thread is locked. No new replies can be added.",
            valForumTitleRequired: "Title is required", valForumContentRequired: "Message is required",
            valForumReplyRequired: "Reply cannot be empty",
            loadingCourses: "Loading courses...", noResults: "No items found.", loadError: "Failed to load data.", retryBtn: "Retry",
            loadingForums: "Loading discussions...", noForums: "No discussions yet.", errorForums: "Failed to load discussions.",
            noAttendanceData: "No attendance records yet.",
            // Daily Class Resources
            dailyResourcesTitle: "Daily Class Resources", dailyResourcesBack: "Back to Home",
            dailyResourcesPrevDay: "Previous Day", dailyResourcesNextDay: "Next Day",
            dailyResourcesJumpDate: "Jump to Date", dailyResourcesClassDate: "Class Date",
            dailyResourcesUploaded: "Uploaded", dailyResourcesNoResources: "No resources for this class yet.",
            dailyResourcesLoading: "Loading daily resources...", dailyResourcesError: "Failed to load resources.",
            dailyResourcesBtnUpload: "Add Resource", dailyResourcesSlot: "Slot",
            dailyResourcesBy: "By", dailyResourcesCount: "resource(s)",
            dailyResourcesBadge: "Resources",
            resourcesDateFilter: "Filter by Class Date",
            resourcesAllDates: "All Dates",
            forumDateFilter: "Filter by Date",
            forumAllDates: "All Dates",
            forumTagDate: "Tag to Class Date",
            forumNoDate: "No Date (General)",
        },
        bn: {
            navTitle: "ডিআইএস স্টুডেন্ট পোর্টাল", btnNavLogin: "লগইন / রেজিস্টার", btnMyProfile: "আমার প্রোফাইল", btnLogout: "লগআউট",
            warningBanner: "⚠️ আপনার প্রোফাইল অসম্পূর্ণ! অনুগ্রহ করে 'আমার প্রোফাইল' বাটনে ক্লিক করে তথ্য পূরণ করুন।",
            heroTitle: "ইসলামিক স্টাডিজ স্টুডেন্ট পোর্টাল", heroSubtitle: "সহপাঠীদের মাঝে ক্লাস নোট ও লেকচার শেয়ার করার উন্মুক্ত প্ল্যাটফর্ম।",
            lblNoticeBoard: "📢 নোটিশ বোর্ড", lblDailyRoutine: "⏳ আজকের সাময়িক রুটিন", lblPermanentRoutine: "📅 স্থায়ী সাপ্তাহিক রুটিন বোর্ড",
            lblCourses: "ক্লাস শেয়ারড রিসোর্স আর্কাইভ", lblSubTitleCourses: "উপরের বছর, ট্রাইমেস্টার ও সেশন সিলেক্ট করে যেকোনো সেমিস্টারের ফাইল দেখুন।",
            sat: "শনিবার", sun: "রবিবার", mon: "সোমবার", tue: "মঙ্গলবার", wed: "বুধবার", fri: "শুক্রবার", friWeekend: "উইকেন্ড",
            noCourses: "এই সেমিস্টারে এখনো কোনো কোর্স ম্যাপ করা হয়নি (অ্যাডমিন প্যানেল)।", noSharedFiles: "এখনো কোনো শেয়ার নেই।",
            activeCourse: "সক্রিয় কোর্স", faculty: "শিক্ষক",
            btnAddResource: "আপলোড", btnViewMaterials: "মেটেরিয়াল দেখুন", resourceCount: "টি শেয়ার",
            sharedAcrossSemesters: "একই কোর্স অন্য সেমিস্টার/বছরে থাকলেও একই ফাইল দেখা যাবে।",
            courseDetailResourcesTitle: "ধরন অনুযায়ী রিসোর্স", courseDetailBack: "কোর্স তালিকায় ফিরুন",
            lblNavLang: "ভাষা", lblNavMenuTitle: "অ্যাকাউন্ট ও সেটিংস",
            loginToUpload: "আপলোডের জন্য লগইন করুন", uploadOwnSemOnly: "শুধু আপনার রানিং সেমিস্টারে আপলোড",
            m_title: "আমার প্রোফাইল", m_pic: "প্রোফাইল ছবি (ঐচ্ছিক)", m_name: "পূর্ণ নাম",
            m_uid: "ইউনিভার্সিটি আইডি", m_batch: "ব্যাচ নম্বর",
            m_academic_title: "একাডেমিক সেশন (বর্ষ / ট্রাইমেস্টার / সেশন / সাল)", m_emg_title: "⚠️ জরুরি তথ্য",
            m_phone: "আমার মোবাইল", m_emg_name: "জরুরি যোগাযোগের নাম", m_emg_phone: "জরুরি মোবাইল নম্বর",
            m_pass_title: "🔒 পাসওয়ার্ড (ঐচ্ছিক)", m_pass_ph: "কমপক্ষে ৬ অক্ষর",
            m_blood: "রক্তের গ্রুপ", m_blood_select: "রক্তের গ্রুপ সিলেক্ট করুন",
            btnCancelProfile: "বাতিল", btnSaveProfileText: "প্রোফাইল সেভ",
            sm_title: "স্টাডি মেটেরিয়াল আপলোড", sm_name: "আপনার নাম", sm_locked_course: "লক করা কোর্স",
            sm_topic: "নোট / লেকচারের শিরোনাম", sm_type: "রিসোর্সের ধরণ",
            sm_topic_ph: "যেমন: ১ম পরিচ্ছেদ — ভূমিকা", sm_cancel: "বাতিল", sm_submit: "প্রকাশ করুন",
            lblUploadMethod: "আপলোড পদ্ধতি সিলেক্ট করুন:", methodFile: "📁 সরাসরি ফাইল", methodLink: "🔗 ক্লাউড লিংক",
            lblSelectFile: "ফাইল সিলেক্ট (সর্বোচ্চ ২ এমবি)", lblLinkUrl: "পাবলিক লিংক পেস্ট করুন (অবশ্যই Public)",
            shareUrl_ph: "https://drive.google.com/... (Public)",
            uploadSizeWarn: "⚠️ সরাসরি আপলোড সীমা: ২ এমবি। ফাইল বড় হলে আগে Google Drive বা YouTube-এ আপলোড করুন, শেয়ারিং Public করুন, তারপর লিংক এখানে দিন।",
            alertFileSizeAuto: "🔴 ফাইল ২ এমবি-র বেশি! স্বয়ংক্রিয়ভাবে লিংক মোডে নেওয়া হয়েছে। Drive/YouTube-এ আপলোড করে Public লিংক পেস্ট করুন।",
            lockSemBefore: "🔒 এই ফাইলটি আপনার রানিং সেমিস্টার",
            lockSemAfter: " এ সংরক্ষিত হবে। সহপাঠীরা এই কোর্সে দেখতে পারবে। অন্য সেমিস্টারে আপলোড করা যাবে না।",
            typePdf: "পিডিএফ / হ্যান্ডনোট", typeVideo: "ভিডিও / ইউটিউব", typeAudio: "অডিও / ভয়েস", typeImage: "ছবি / ডকুমেন্ট",
            alertLoginUpload: "আপলোড করতে প্রথমে লগইন করুন।",
            alertSemLock: "🔴 লক! শুধু আপনার নিজের রানিং সেমিস্টারে আপলোড করা যাবে।",
            alertFileSize: "🔴 ফাইল ২ এমবি-র বেশি! ড্রাইভ/ইউটিউবে আপলোড করে পাবলিক লিংক দিন।",
            alertPickFile: "২ এমবি-র নিচে একটি ফাইল সিলেক্ট করুন।", alertPasteLink: "লিংক পেস্ট করুন।",
            alertPublished: "রিসোর্স সফলভাবে প্রকাশিত!",
            alertProfileSaved: "প্রোফাইল সেভ হয়েছে!", alertProfileRequired: "জরুরি তথ্য ও রক্তের গ্রুপ পূরণ বাধ্যতামূলক!",
            alertPassMin: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।",
            alertPageLoadError: "পেজ লোড করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করুন বা আবার লগইন করুন।",
            alertThreadPostFailed: "থ্রেড পোস্ট করতে ব্যর্থ। আবার চেষ্টা করুন।",
            alertReplyPostFailed: "উত্তর পোস্ট করতে ব্যর্থ। আবার চেষ্টা করুন।",
            alertThreadDeleteFailed: "থ্রেড মুছতে ব্যর্থ।",
            alertReplyDeleteFailed: "উত্তর মুছতে ব্যর্থ।",
            genderMale: "ভাইদের শাখা", genderFemale: "বোনদের শাখা", genderCombined: "সম্মিলিত শাখা",
            noClasses: "ক্লাস নেই।", loadFail: "কোর্স লোড ব্যর্থ। পেজ রিফ্রেশ করুন।",
            displaySemSync: "সিঙ্ক হচ্ছে...", byAuthor: "প্রকাশক:", profileIncomplete: "প্রোফাইল অসম্পূর্ণ!",
            loadingCourses: "কোর্স লোড হচ্ছে...",
            btnView: "দেখুন", btnEdit: "এডিট", btnDelete: "মুছুন", btnViewFile: "ফাইল খুলুন",
            confirmDeleteResource: "এই আপলোড করা রিসোর্স স্থায়ীভাবে মুছবেন?",
            alertResourceDeleted: "রিসোর্স মুছে ফেলা হয়েছে।",
            sm_edit_title: "স্টাডি মেটেরিয়াল এডিট", sm_save: "সংরক্ষণ করুন",
            alertResourceUpdated: "রিসোর্স আপডেট হয়েছে!", alertUploading: "ফাইল আপলোড হচ্ছে, অপেক্ষা করুন...",
            alertNotOwner: "শুধু নিজের আপলোড করা রিসোর্স এডিট বা ডিলিট করতে পারবেন।",
            fileLinkMissing: "ফাইল লিংক নেই — আবার আপলোড করুন।",
            alertInvalidFileUrl: "আপলোড সফ্য হয়নি: সঠিক URL তৈরি হয়নি। Supabase-এ anon key ও Public বাকেট চেক করুন।",
            alertOpenFileFailed: "ফাইল খোলা যায়নি। মুছে আবার আপলোড করুন অথবা Supabase Storage চেক করুন।",
            myAttendance: "আমার উপস্থিতি", noAttendanceYet: "এখনো কোনো উপস্থিতির রেকর্ড নেই।", overall: "সার্বিক",
            presentOf: "উপস্থিত - মোট", totalClasses: "ক্লাস", perCourse: "প্রতি কোর্স",
            date: "তারিখ", course: "কোর্স", title: "শিরোনাম", status: "অবস্থা",
            valProfileNameRequired: "পূর্ণ নাম প্রয়োজন", valProfileUIDRequired: "ইউনিভার্সিটি আইডি প্রয়োজন",
            valProfileBatchRequired: "ব্যাচ নম্বর প্রয়োজন", valProfilePhoneRequired: "ফোন নম্বর প্রয়োজন",
            valProfileBloodRequired: "রক্তের গ্রুপ প্রয়োজন", valProfileEmgNameRequired: "জরুরি যোগাযোগের নাম প্রয়োজন",
            valProfileEmgPhoneRequired: "জরুরি ফোন নম্বর প্রয়োজন",
            // Forum
            forumTab: "আলোচনা", forumNoThreads: "এখনো কোনো আলোচনা নেই। প্রথমটি শুরু করুন!",
            forumNewThread: "নতুন থ্রেড", forumThreadTitle: "শিরোনাম", forumThreadTitlePH: "একটি প্রশ্ন জিজ্ঞাসা করুন বা আলোচনা শুরু করুন...",
            forumThreadContent: "বিস্তারিত", forumThreadContentPH: "আপনার প্রশ্ন বা বিষয় বর্ণনা করুন...",
            forumSubmitThread: "পোস্ট করুন", forumReply: "উত্তর দিন", forumReplyPH: "একটি উত্তর লিখুন...",
            forumSubmitReply: "পাঠান", forumCancelReply: "বাতিল", forumReplies: "টি উত্তর",
            forumPinned: "পিন করা", forumLocked: "লক করা", forumBy: "লেখক:",
            forumJustNow: "এইমাত্র", forumMinutesAgo: "মি. আগে", forumHoursAgo: "ঘ. আগে", forumDaysAgo: "দি. আগে",
            forumAlertTitleRequired: "অনুগ্রহ করে শিরোনাম লিখুন।", forumAlertContentRequired: "অনুগ্রহ করে মেসেজ লিখুন।",
            forumAlertThreadPosted: "থ্রেড পোস্ট করা হয়েছে!", forumAlertReplyPosted: "উত্তর পোস্ট করা হয়েছে!",
            forumAlertThreadDeleted: "থ্রেড মুছে ফেলা হয়েছে।", forumAlertReplyDeleted: "উত্তর মুছে ফেলা হয়েছে।",
            forumConfirmDeleteThread: "এই থ্রেড এবং সব উত্তর মুছে ফেলবেন?", forumConfirmDeleteReply: "এই উত্তরটি মুছে ফেলবেন?",
            forumLockedNotice: "এই থ্রেড লক করা আছে। নতুন উত্তর যোগ করা যাবে না।",
            valForumTitleRequired: "শিরোনাম প্রয়োজন", valForumContentRequired: "মেসেজ প্রয়োজন",
            valForumReplyRequired: "উত্তর খালি রাখা যাবে না",
            loadingCourses: "কোর্স লোড হচ্ছে...", noResults: "কিছু পাওয়া যায়নি।", loadError: "ডেটা লোড করতে ব্যর্থ।", retryBtn: "আবার চেষ্টা",
            loadingForums: "আলোচনা লোড হচ্ছে...", noForums: "এখনো কোনো আলোচনা নেই।", errorForums: "আলোচনা লোড করতে ব্যর্থ।",
            noAttendanceData: "এখনো কোনো উপস্থিতি রেকর্ড নেই।",
            // Daily Class Resources
            dailyResourcesTitle: "দৈনিক ক্লাস রিসোর্স", dailyResourcesBack: "হোমে ফিরুন",
            dailyResourcesPrevDay: "আগের দিন", dailyResourcesNextDay: "পরের দিন",
            dailyResourcesJumpDate: "তারিখে যান", dailyResourcesClassDate: "ক্লাসের তারিখ",
            dailyResourcesUploaded: "আপলোড", dailyResourcesNoResources: "এই ক্লাসের জন্য এখনো কোনো রিসোর্স নেই।",
            dailyResourcesLoading: "দৈনিক রিসোর্স লোড হচ্ছে...", dailyResourcesError: "রিসোর্স লোড করতে ব্যর্থ।",
            dailyResourcesBtnUpload: "রিসোর্স যোগ করুন", dailyResourcesSlot: "স্লট",
            dailyResourcesBy: "প্রকাশক", dailyResourcesCount: "টি রিসোর্স",
            dailyResourcesBadge: "রিসোর্স",
            resourcesDateFilter: "ক্লাসের তারিখ অনুযায়ী ফিল্টার",
            resourcesAllDates: "সবগুলো তারিখ",
            forumDateFilter: "তারিখ অনুযায়ী ফিল্টার",
            forumAllDates: "সবগুলো তারিখ",
            forumTagDate: "ক্লাসের তারিখে ট্যাগ করুন",
            forumNoDate: "কোনো তারিখ নেই (সাধারণ)",
        }
    },

    /* ---------- auth (login.html) ---------- */
    auth: {
        en: {
            portalTitle: "DIS Student Portal", portalSubtitle: "Department of Islamic Studies",
            loginTab: "Login", registerTab: "Register",
            lblEmail: "Email Address", lblPassword: "Password", btnLogin: "Sign In",
            lblRegName: "Full Name", lblRegUID: "University ID (UID)",
            lblRegBatchNum: "Batch No", lblRegSemester: "Trimester", btnRegister: "Complete Registration",
            valEmailRequired: "Email is required", valEmailInvalid: "Please enter a valid email",
            valPasswordRequired: "Password is required", valPasswordMin: "Minimum 6 characters",
            valNameRequired: "Name is required", valUIDRequired: "UID is required",
            valBatchRequired: "Batch number is required", valSemesterRequired: "Trimester is required",
            alertRegSuccess: "Registration Successful!",
            alertRegError: "Registration Error: ",
            alertLoginError: "Login Error: "
        },
        bn: {
            portalTitle: "ডিআইএস স্টুডেন্ট পোর্টাল", portalSubtitle: "ইসলামিক স্টাডিজ বিভাগ",
            loginTab: "লগইন", registerTab: "নিবন্ধন",
            lblEmail: "ইমেইল ঠিকানা", lblPassword: "পাসওয়ার্ড", btnLogin: "প্রবেশ করুন",
            lblRegName: "পূর্ণ নাম", lblRegUID: "ইউনিভার্সিটি আইডি (UID)",
            lblRegBatchNum: "ব্যাচ নং", lblRegSemester: "সেমিস্টার", btnRegister: "নিবন্ধন সম্পন্ন করুন",
            valEmailRequired: "ইমেইল প্রয়োজন", valEmailInvalid: "সঠিক ইমেইল দিন",
            valPasswordRequired: "পাসওয়ার্ড প্রয়োজন", valPasswordMin: "সর্বনিম্ন ৬ অক্ষর",
            valNameRequired: "নাম প্রয়োজন", valUIDRequired: "UID প্রয়োজন",
            valBatchRequired: "ব্যাচ নম্বর প্রয়োজন", valSemesterRequired: "সেমিস্টার প্রয়োজন",
            alertRegSuccess: "নিবন্ধন সফল হয়েছে!",
            alertRegError: "নিবন্ধন ত্রুটি: ",
            alertLoginError: "লগইন ত্রুটি: "
        }
    },

    /* ---------- gateway (dept-gate-2026.html) ---------- */
    gateway: {
        en: {
            title: "Central Admin Gateway", subtitle: "Authorized personnel only",
            lblEmail: "Secret Email ID", lblPassword: "Master Password", btn: "Verify & Enter",
            accessDenied: "Access Denied! You do not have admin privileges.",
            success: "Access Granted! Welcome to Master Panel.",
            error: "Invalid Credentials!"
        },
        ar: {
            title: "بوابة المسؤول المركزية", subtitle: "للموظفين المصرح لهم فقط",
            lblEmail: "البريد الإلكتروني السري", lblPassword: "كلمة المرور الرئيسية", btn: "التحقق والدخول",
            accessDenied: "تم رفض الدخول! ليس لديك صلاحيات المسؤول.",
            success: "تم منح الدخول! مرحبًا بك في اللوحة الرئيسية.",
            error: "بيانات الاعتماد غير صالحة!"
        },
        bn: {
            title: "সেন্ট্রাল অ্যাডমিন গেটওয়ে", subtitle: "শুধুমাত্র অনুমোদিত ব্যক্তিদের জন্য",
            lblEmail: "গোপন ইমেইল আইডি", lblPassword: "মাস্টার পাসওয়ার্ড", btn: "যাচাই করুন এবং প্রবেশ করুন",
            accessDenied: "অ্যাক্সেস রিফিউজড! আপনার অ্যাডমিন পারমিশন নেই।",
            success: "অ্যাক্সেস গ্রান্টেড! মাস্টার প্যানেলে স্বাগতম।",
            error: "ভুল ইমেইল বা পাসওয়ার্ড!"
        }
    },

    /* ---------- admin (admin-dashboard.html) ---------- */
    admin: {
        en: {
            logoutConfirm: "Logout?", unsavedChanges: "You have unsaved changes. Discard?",
            editModalTitle: "Update Management Entry", btnClose: "Cancel", btnSave: "Save Changes",
            errorEmbedded: "🔥 This file could not be loaded!",
            errorRoutine: "Failed to load routines.", errorNotice: "Failed to load notices.",
            errorCourseMapping: "Failed to load course mappings.", errorResources: "Failed to load resources.",
            errorStudents: "Failed to load student directory.",
            alertDeleteConfirm: "Are you sure you want to permanently delete this?",
            alertDeleteStudentConfirm: "Are you sure you want to permanently DELETE this student account? This cannot be undone!",
            alertPasswordReset: "Are you sure you want to reset this student's password?",
            alertMappingDeleted: "Course mapping removed.",
            attendanceTitle: "Attendance Management",
            sessionLabel: "Attendance Session",
            courseLabel: "Course",
            dateLabel: "Date",
            createSession: "Create Session",
            noAttendanceSessions: "No attendance sessions created yet.",
            recordAttendance: "Mark Attendance",
            allPresent: "All Present",
            saveAttendance: "Save Attendance",
            deleteSessionConfirm: "Delete this attendance session and all its records?",
            attendanceReport: "Attendance Report",
            noAttendanceRecords: "No attendance records yet.",
            refreshBtn: "Refresh",
            noRoutines: "No routines created yet.",
            noNotices: "No notices posted yet.",
            noMappings: "No course mappings created yet.",
            noStudents: "No student accounts found.",
            noResources: "No student resources uploaded yet.",
            alertSaveFailed: "Failed to save: ",
            alertNoEmail: "No email found for this student.",
            alertResetSent: "Password reset email sent to ",
            alertResetFailed: "Reset failed: ",
            alertDeleteSuccess: "Deleted!",
            alertDeleteFailed: "Delete failed: ",
            alertAccountDeleted: "Account deleted successfully.",
            alertActionFailed: "Action failed. Please try again.",
            // Form submission toasts
            routinePermDayError: "Permanent schedule requires a class day (Sat–Fri). Please select the day.",
            routinePublished: "Routine schedule published!",
            routinePublishFailed: "Failed to publish routine: ",
            mapFieldsRequired: "Please fill in course code, title & teacher name.",
            mapSuccess: "Course mapped successfully",
            mapFailed: "Mapping failed: ",
            noticeContentRequired: "Notice content cannot be empty.",
            noticePublished: "Notice broadcasted!",
            noticePublishFailed: "Failed to broadcast notice: ",
        },
        bn: {
            logoutConfirm: "লগআউট করবেন?", unsavedChanges: "আপনার পরিবর্তন সেভ হয়নি। বাতিল করবেন?",
            editModalTitle: "ম্যানেজমেন্ট এন্ট্রি আপডেট", btnClose: "বাতিল", btnSave: "পরিবর্তন সংরক্ষণ",
            errorEmbedded: "🔥 এই ফাইলটি লোড করা যায়নি!",
            errorRoutine: "রুটিন লোড করতে ব্যর্থ।", errorNotice: "নোটিশ লোড করতে ব্যর্থ।",
            errorCourseMapping: "কোর্স ম্যাপিং লোড করতে ব্যর্থ।", errorResources: "রিসোর্স লোড করতে ব্যর্থ।",
            errorStudents: "স্টুডেন্ট ডিরেক্টরি লোড করতে ব্যর্থ।",
            alertDeleteConfirm: "আপনি কি নিশ্চিত যে এটি স্থায়ীভাবে মুছে ফেলবেন?",
            alertDeleteStudentConfirm: "আপনি কি নিশ্চিত যে এই শিক্ষার্থীর অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলবেন? এটি পূর্বাবস্থায় ফেরানো যাবে না!",
            alertPasswordReset: "আপনি কি এই শিক্ষার্থীর পাসওয়ার্ড রিসেট করতে চান?",
            alertMappingDeleted: "কোর্স ম্যাপিং সরানো হয়েছে।",
            attendanceTitle: "উপস্থিতি ব্যবস্থাপনা",
            sessionLabel: "উপস্থিতি সেশন",
            courseLabel: "কোর্স",
            dateLabel: "তারিখ",
            createSession: "সেশন তৈরি করুন",
            noAttendanceSessions: "এখনো কোনো উপস্থিতি সেশন তৈরি করা হয়নি।",
            recordAttendance: "উপস্থিতি রেকর্ড",
            allPresent: "সবাই উপস্থিত",
            saveAttendance: "উপস্থিতি সংরক্ষণ",
            deleteSessionConfirm: "এই উপস্থিতি সেশন এবং এর সব রেকর্ড মুছে ফেলবেন?",
            attendanceReport: "উপস্থিতি রিপোর্ট",
            noAttendanceRecords: "এখনো কোনো উপস্থিতি রেকর্ড নেই।",
            refreshBtn: "রিফ্রেশ",
            noRoutines: "এখনো কোনো রুটিন তৈরি করা হয়নি।",
            noNotices: "এখনো কোনো নোটিশ পোস্ট করা হয়নি।",
            noMappings: "এখনো কোনো কোর্স ম্যাপিং তৈরি করা হয়নি।",
            noStudents: "কোনো শিক্ষার্থী অ্যাকাউন্ট পাওয়া যায়নি।",
            noResources: "এখনো কোনো রিসোর্স আপলোড করা হয়নি।",
            alertSaveFailed: "সংরক্ষণ ব্যর্থ: ",
            alertNoEmail: "এই শিক্ষার্থীর কোনো ইমেইল পাওয়া যায়নি।",
            alertResetSent: "পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে ",
            alertResetFailed: "রিসেট ব্যর্থ: ",
            alertDeleteSuccess: "মুছে ফেলা হয়েছে!",
            alertDeleteFailed: "মুছতে ব্যর্থ: ",
            alertAccountDeleted: "অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে।",
            alertActionFailed: "কাজটি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
            // Form submission toasts
            routinePermDayError: "স্থায়ী সূচির জন্য ক্লাস ডে (শনি–শুক্র) নির্বাচন করুন।",
            routinePublished: "রুটিন সূচি প্রকাশিত হয়েছে!",
            routinePublishFailed: "রুটিন প্রকাশ ব্যর্থ: ",
            mapFieldsRequired: "কোর্স কোড, শিরোনাম ও শিক্ষকের নাম পূরণ করুন।",
            mapSuccess: "কোর্স সফলভাবে ম্যাপ করা হয়েছে",
            mapFailed: "ম্যাপিং ব্যর্থ: ",
            noticeContentRequired: "নোটিশের বিষয়বস্তু খালি রাখা যাবে না।",
            noticePublished: "নোটিশ প্রকাশিত হয়েছে!",
            noticePublishFailed: "নোটিশ প্রকাশ ব্যর্থ: ",
            // Forum moderation
            forumTitle: "আলোচনা ফোরাম মডারেশন",
            noForumThreads: "কোনো আলোচনা থ্রেড পাওয়া যায়নি।",
            pinThread: "পিন", unpinThread: "আনপিন",
            lockThread: "লক", unlockThread: "আনলক",
            deleteThread: "মুছুন", deleteReply: "উত্তর মুছুন",
            forumAlertPinned: "থ্রেড পিন করা হয়েছে।", forumAlertUnpinned: "থ্রেড আনপিন করা হয়েছে।",
            forumAlertLocked: "থ্রেড লক করা হয়েছে।", forumAlertUnlocked: "থ্রেড আনলক করা হয়েছে।",
            forumAlertThreadDeleted: "থ্রেড মুছে ফেলা হয়েছে।", forumAlertReplyDeleted: "উত্তর মুছে ফেলা হয়েছে।",
            confirmDeleteThread: "এই থ্রেড এবং সব উত্তর মুছে ফেলবেন?",
            confirmDeleteReply: "এই উত্তরটি মুছে ফেলবেন?",
        }
    }
};

// ── Language direction map ────────────────────────────────────────

const LANG_DIR = { en: "ltr", bn: "ltr", ar: "rtl" };

// ── Public API ────────────────────────────────────────────────────

/** Get the currently selected language code (e.g., "en", "bn", "ar") */
export function getLang() {
    return localStorage.getItem("preferredLang") || "en";
}

/** Set the language and persist to localStorage */
export function setLang(lang) {
    localStorage.setItem("preferredLang", lang);
}

/** Get the text direction for the current language ("ltr" or "rtl") */
export function getDir(lang) {
    return LANG_DIR[lang || getLang()] || "ltr";
}

/**
 * Translate a key within a namespace.
 * Falls back to English, then returns the key itself if missing.
 *
 * @param {string} ns   - Translation namespace (e.g., "portal", "auth", "gateway", "admin")
 * @param {string} key  - Translation key
 * @returns {string} Translated text
 *
 * Usage:
 *   import { t } from "./assets/js/i18n.js";
 *   t("portal", "navTitle")  →  "DIS Student Portal" (or Bengali equivalent)
 */
export function t(ns, key) {
    const lang = getLang();
    const bucket = TRANSLATIONS[ns];
    if (!bucket) return key;
    if (bucket[lang] && bucket[lang][key] !== undefined) return bucket[lang][key];
    if (bucket["en"] && bucket["en"][key] !== undefined) return bucket["en"][key];
    return key;
}

/**
 * Get all available language codes for a namespace.
 * @param {string} ns - Namespace
 * @returns {string[]}
 */
export function availableLangs(ns) {
    const bucket = TRANSLATIONS[ns];
    return bucket ? Object.keys(bucket) : [];
}

/**
 * Build a language selector <select> element.
 * @param {string[]} langs - Language codes to offer
 * @param {string} selected - Currently selected language
 * @returns {string} HTML string for the select
 */
export function langSelectHTML(langs, selected) {
    const labels = { en: "English", bn: "বাংলা", ar: "العربية" };
    return langs
        .map(
            (l) =>
                `<option value="${l}"${l === selected ? " selected" : ""}>${labels[l] || l}</option>`
        )
        .join("");
}

/**
 * Bind a <select id="langSelector"> to change language, trigger callback, and optionally reload.
 * @param {function} onLangChange - Called with the new language code after change
 * @param {boolean} reload - If true, calls location.reload() after change
 */
export function bindLangSelector(onLangChange, reload = false) {
    const sel = document.getElementById("langSelector");
    if (!sel || sel.dataset.i18nBound === "1") return;
    sel.dataset.i18nBound = "1";
    sel.addEventListener("change", (e) => {
        const lang = e.target.value;
        setLang(lang);
        if (onLangChange) onLangChange(lang);
        if (reload) window.location.reload();
    });
}

/**
 * Apply translations to multiple DOM elements at once.
 * Also updates document direction (LTR/RTL) and lang attribute.
 *
 * @param {string} ns - Translation namespace (e.g., "portal", "auth", "gateway", "admin")
 * @param {Object} elementMap - Map of { elementId: translationKey } or { elementId: { key, attr } }
 *   Supported attrs: innerText (default), placeholder, value, title, innerHTML
 * @param {Object} [options] - { lang: override language, dir: update document direction (default true) }
 *
 * Usage:
 *   applyPageLanguage("auth", {
 *     txtPortalTitle: "portalTitle",
 *     txtPortalSubtitle: "portalSubtitle",
 *     btnLogin: "btnLogin"
 *   });
 *
 *   // With custom attributes:
 *   applyPageLanguage("portal", {
 *     loginEmail: { key: "lblEmail", attr: "placeholder" },
 *     navTitle: { key: "navTitle", attr: "title" }
 *   });
 */
export function applyPageLanguage(ns, elementMap, options = {}) {
    const lang = options.lang || getLang();
    const dir = getDir(lang);

    if (options.dir !== false) {
        document.documentElement.lang = lang;
        document.body.dir = dir;
    }

    for (const [elementId, config] of Object.entries(elementMap)) {
        const el = document.getElementById(elementId);
        if (!el) continue;

        let key, attr;
        if (typeof config === "string") {
            key = config;
            attr = "innerText";
        } else {
            key = config.key;
            attr = config.attr || "innerText";
        }

        const translated = t(ns, key);
        if (attr === "innerText") el.innerText = translated;
        else if (attr === "placeholder") el.placeholder = translated;
        else if (attr === "value") el.value = translated;
        else if (attr === "title") el.title = translated;
        else if (attr === "innerHTML") el.innerHTML = translated;
    }
}

export function bindLangSelectorSimple() {
    const sel = document.getElementById("langSelector");
    if (!sel || sel.dataset.i18nBound === "1") return;
    sel.dataset.i18nBound = "1";
    sel.addEventListener("change", (e) => setLang(e.target.value));
}

// ── Legacy global bridge ──────────────────────────────────────────
// For backward compatibility with non-module inline <script> tags
// that rely on window.portalTranslations / window.portalT / window.getPortalLang

window.portalTranslations = TRANSLATIONS.portal;
window.getPortalLang = () => getLang();
window.portalT = (key) => t("portal", key);