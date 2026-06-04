/**
 * i18n.js â€” Shared translation module for DIS Student Portal
 * Consolidates translations from all pages: portal, auth, gateway
 * All pages import { t, getLang, setLang, getDir } from this module.
 */

// â”€â”€ All translations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TRANSLATIONS = {

    /* ---------- portal (index.html) ---------- */
    portal: {
        en: {
            navTitle: "DIS Student Portal", btnNavLogin: "Login / Register", btnMyProfile: "My Profile", btnLogout: "Logout",
            warningBanner: "âš ï¸ Profile incomplete! Please open My Profile and fill mandatory fields.",
            heroTitle: "Islamic Studies Student Portal", heroSubtitle: "Open platform to share class notes and lectures.",
            lblNoticeBoard: "ðŸ“¢ Notice Board", lblDailyRoutine: "â³ Daily Routine Update", lblPermanentRoutine: "ðŸ“… Permanent Weekly Schedule Board",
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
            m_academic_title: "Academic Trimester Status", m_emg_title: "âš ï¸ Emergency Data",
            m_phone: "My Mobile Number", m_emg_name: "Emergency Contact Name", m_emg_phone: "Emergency Contact Mobile",
            m_pass_title: "ðŸ”’ Change Password (optional)", m_pass_ph: "Min. 6 characters",
            m_blood: "Blood Group", m_blood_select: "Select Blood Group",
            btnCancelProfile: "Cancel", btnSaveProfileText: "Save Profile",
            sm_title: "Share Study Material", sm_name: "Contributor Name", sm_locked_course: "Locked Course",
            sm_topic: "Note / Lecture Title", sm_type: "Resource Type",
            sm_topic_ph: "e.g. Chapter 1 â€” Introduction notes", sm_cancel: "Cancel", sm_submit: "Publish Live",
            lblUploadMethod: "Choose upload method:", methodFile: "ðŸ“ Direct File", methodLink: "ðŸ”— Cloud Link",
            lblSelectFile: "Select file (max 2MB)", lblLinkUrl: "Paste public link (must be Public)",
            shareUrl_ph: "https://drive.google.com/... (Public)",
            uploadSizeWarn: "âš ï¸ Direct upload limit: 2MB. If your file is larger, upload it to Google Drive or YouTube first, set sharing to Public, then paste the link here.",
            alertFileSizeAuto: "ðŸ”´ This file is over 2MB! Switched to Cloud Link mode. Upload to Drive/YouTube, set the link to Public, then paste it below.",
            lockSemBefore: "ðŸ”’ This file will be saved under your running semester",
            lockSemAfter: ". Classmates can view it in this course. You cannot upload to other semesters.",
            typePdf: "PDF / Handnote", typeVideo: "Video / YouTube Link", typeAudio: "Audio / Voice", typeImage: "Image / Document",
            alertLoginUpload: "Please login first to upload.",
            alertSemLock: "ðŸ”’ Locked! You can only upload in your own running semester.",
            alertFileSize: "ðŸ”´ File exceeds 2MB! Upload to Drive/YouTube and paste a public link.",
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
            m_gender: "Gender",
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
            fileLinkMissing: "File link missing â€” please upload again.",
            alertInvalidFileUrl: "Upload failed: no valid file URL. Check Supabase config (anon key) and public bucket.",
            alertOpenFileFailed: "Could not open file. Delete and upload again, or check Supabase Storage bucket.",
            myAttendance: "My Attendance", noAttendanceYet: "No attendance records yet.", overall: "Overall",
            presentOf: "present of", totalClasses: "total classes", perCourse: "Per Course",
            date: "Date", course: "Course", title: "Title", status: "Status",
            statusPresent: "Present", statusAbsent: "Absent",
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
            attExpandHint: "Click to expand", attendanceCol: "Attendance", percentCol: "%",
        },
        bn: {
            navTitle: "à¦¡à¦¿à¦†à¦‡à¦à¦¸ à¦¸à§à¦Ÿà§à¦¡à§‡à¦¨à§à¦Ÿ à¦ªà§‹à¦°à§à¦Ÿà¦¾à¦²", btnNavLogin: "à¦²à¦—à¦‡à¦¨ / à¦°à§‡à¦œà¦¿à¦¸à§à¦Ÿà¦¾à¦°", btnMyProfile: "à¦†à¦®à¦¾à¦° à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦²", btnLogout: "à¦²à¦—à¦†à¦‰à¦Ÿ",
            warningBanner: "âš ï¸ à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦…à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£! à¦…à¦¨à§à¦—à§à¦°à¦¹ à¦•à¦°à§‡ 'à¦†à¦®à¦¾à¦° à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦²' à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§à¦²à¦¿à¦• à¦•à¦°à§‡ à¦¤à¦¥à§à¦¯ à¦ªà§‚à¦°à¦£ à¦•à¦°à§à¦¨à¥¤",
            heroTitle: "à¦‡à¦¸à¦²à¦¾à¦®à¦¿à¦• à¦¸à§à¦Ÿà¦¾à¦¡à¦¿à¦œ à¦¸à§à¦Ÿà§à¦¡à§‡à¦¨à§à¦Ÿ à¦ªà§‹à¦°à§à¦Ÿà¦¾à¦²", heroSubtitle: "à¦¸à¦¹à¦ªà¦¾à¦ à§€à¦¦à§‡à¦° à¦®à¦¾à¦à§‡ à¦•à§à¦²à¦¾à¦¸ à¦¨à§‹à¦Ÿ à¦“ à¦²à§‡à¦•à¦šà¦¾à¦° à¦¶à§‡à¦¯à¦¼à¦¾à¦° à¦•à¦°à¦¾à¦° à¦‰à¦¨à§à¦®à§à¦•à§à¦¤ à¦ªà§à¦²à§à¦¯à¦¾à¦Ÿà¦«à¦°à§à¦®à¥¤",
            lblNoticeBoard: "ðŸ“¢ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦¬à§‹à¦°à§à¦¡", lblDailyRoutine: "â³ à¦†à¦œà¦•à§‡à¦° à¦¸à¦¾à¦®à¦¯à¦¼à¦¿à¦• à¦°à§à¦Ÿà¦¿à¦¨", lblPermanentRoutine: "ðŸ“… à¦¸à§à¦¥à¦¾à¦¯à¦¼à§€ à¦¸à¦¾à¦ªà§à¦¤à¦¾à¦¹à¦¿à¦• à¦°à§à¦Ÿà¦¿à¦¨ à¦¬à§‹à¦°à§à¦¡",
            lblCourses: "à¦•à§à¦²à¦¾à¦¸ à¦¶à§‡à¦¯à¦¼à¦¾à¦°à¦¡ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦†à¦°à§à¦•à¦¾à¦‡à¦­", lblSubTitleCourses: "à¦‰à¦ªà¦°à§‡à¦° à¦¬à¦›à¦°, à¦Ÿà§à¦°à¦¾à¦‡à¦®à§‡à¦¸à§à¦Ÿà¦¾à¦° à¦“ à¦¸à§‡à¦¶à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§à¦Ÿ à¦•à¦°à§‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°à§‡à¦° à¦«à¦¾à¦‡à¦² à¦¦à§‡à¦–à§à¦¨à¥¤",
            sat: "à¦¶à¦¨à¦¿à¦¬à¦¾à¦°", sun: "à¦°à¦¬à¦¿à¦¬à¦¾à¦°", mon: "à¦¸à§‹à¦®à¦¬à¦¾à¦°", tue: "à¦®à¦™à§à¦—à¦²à¦¬à¦¾à¦°", wed: "à¦¬à§à¦§à¦¬à¦¾à¦°", fri: "à¦¶à§à¦•à§à¦°à¦¬à¦¾à¦°", friWeekend: "à¦‰à¦‡à¦•à§‡à¦¨à§à¦¡",
            noCourses: "à¦à¦‡ à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°à§‡ à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦•à§‹à¦°à§à¦¸ à¦®à§à¦¯à¦¾à¦ª à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿ (à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦ªà§à¦¯à¦¾à¦¨à§‡à¦²)à¥¤", noSharedFiles: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦¶à§‡à¦¯à¦¼à¦¾à¦° à¦¨à§‡à¦‡à¥¤",
            activeCourse: "à¦¸à¦•à§à¦°à¦¿à¦¯à¦¼ à¦•à§‹à¦°à§à¦¸", faculty: "à¦¶à¦¿à¦•à§à¦·à¦•",
            btnAddResource: "à¦†à¦ªà¦²à§‹à¦¡", btnViewMaterials: "à¦®à§‡à¦Ÿà§‡à¦°à¦¿à¦¯à¦¼à¦¾à¦² à¦¦à§‡à¦–à§à¦¨", resourceCount: "à¦Ÿà¦¿ à¦¶à§‡à¦¯à¦¼à¦¾à¦°",
            sharedAcrossSemesters: "à¦à¦•à¦‡ à¦•à§‹à¦°à§à¦¸ à¦…à¦¨à§à¦¯ à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°/à¦¬à¦›à¦°à§‡ à¦¥à¦¾à¦•à¦²à§‡à¦“ à¦à¦•à¦‡ à¦«à¦¾à¦‡à¦² à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
            courseDetailResourcesTitle: "à¦§à¦°à¦¨ à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸", courseDetailBack: "à¦•à§‹à¦°à§à¦¸ à¦¤à¦¾à¦²à¦¿à¦•à¦¾à¦¯à¦¼ à¦«à¦¿à¦°à§à¦¨",
            lblNavLang: "à¦­à¦¾à¦·à¦¾", lblNavMenuTitle: "à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦“ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸",
            loginToUpload: "à¦†à¦ªà¦²à§‹à¦¡à§‡à¦° à¦œà¦¨à§à¦¯ à¦²à¦—à¦‡à¦¨ à¦•à¦°à§à¦¨", uploadOwnSemOnly: "à¦¶à§à¦§à§ à¦†à¦ªà¦¨à¦¾à¦° à¦°à¦¾à¦¨à¦¿à¦‚ à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°à§‡ à¦†à¦ªà¦²à§‹à¦¡",
            m_title: "à¦†à¦®à¦¾à¦° à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦²", m_pic: "à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦›à¦¬à¦¿ (à¦à¦šà§à¦›à¦¿à¦•)", m_name: "à¦ªà§‚à¦°à§à¦£ à¦¨à¦¾à¦®",
            m_uid: "à¦‡à¦‰à¦¨à¦¿à¦­à¦¾à¦°à§à¦¸à¦¿à¦Ÿà¦¿ à¦†à¦‡à¦¡à¦¿", m_batch: "à¦¬à§à¦¯à¦¾à¦š à¦¨à¦®à§à¦¬à¦°",
            m_academic_title: "à¦à¦•à¦¾à¦¡à§‡à¦®à¦¿à¦• à¦¸à§‡à¦¶à¦¨ (à¦¬à¦°à§à¦· / à¦Ÿà§à¦°à¦¾à¦‡à¦®à§‡à¦¸à§à¦Ÿà¦¾à¦° / à¦¸à§‡à¦¶à¦¨ / à¦¸à¦¾à¦²)", m_emg_title: "âš ï¸ à¦œà¦°à§à¦°à¦¿ à¦¤à¦¥à§à¦¯",
            m_phone: "à¦†à¦®à¦¾à¦° à¦®à§‹à¦¬à¦¾à¦‡à¦²", m_emg_name: "à¦œà¦°à§à¦°à¦¿ à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦—à§‡à¦° à¦¨à¦¾à¦®", m_emg_phone: "à¦œà¦°à§à¦°à¦¿ à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦®à§à¦¬à¦°",
            m_pass_title: "ðŸ”’ à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ (à¦à¦šà§à¦›à¦¿à¦•)", m_pass_ph: "à¦•à¦®à¦ªà¦•à§à¦·à§‡ à§¬ à¦…à¦•à§à¦·à¦°",
            m_blood: "à¦°à¦•à§à¦¤à§‡à¦° à¦—à§à¦°à§à¦ª", m_blood_select: "à¦°à¦•à§à¦¤à§‡à¦° à¦—à§à¦°à§à¦ª à¦¸à¦¿à¦²à§‡à¦•à§à¦Ÿ à¦•à¦°à§à¦¨",
            btnCancelProfile: "à¦¬à¦¾à¦¤à¦¿à¦²", btnSaveProfileText: "à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¸à§‡à¦­",
            sm_title: "à¦¸à§à¦Ÿà¦¾à¦¡à¦¿ à¦®à§‡à¦Ÿà§‡à¦°à¦¿à¦¯à¦¼à¦¾à¦² à¦†à¦ªà¦²à§‹à¦¡", sm_name: "à¦†à¦ªà¦¨à¦¾à¦° à¦¨à¦¾à¦®", sm_locked_course: "à¦²à¦• à¦•à¦°à¦¾ à¦•à§‹à¦°à§à¦¸",
            sm_topic: "à¦¨à§‹à¦Ÿ / à¦²à§‡à¦•à¦šà¦¾à¦°à§‡à¦° à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦®", sm_type: "à¦°à¦¿à¦¸à§‹à¦°à§à¦¸à§‡à¦° à¦§à¦°à¦£",
            sm_topic_ph: "à¦¯à§‡à¦®à¦¨: à§§à¦® à¦ªà¦°à¦¿à¦šà§à¦›à§‡à¦¦ â€” à¦­à§‚à¦®à¦¿à¦•à¦¾", sm_cancel: "à¦¬à¦¾à¦¤à¦¿à¦²", sm_submit: "à¦ªà§à¦°à¦•à¦¾à¦¶ à¦•à¦°à§à¦¨",
            lblUploadMethod: "à¦†à¦ªà¦²à§‹à¦¡ à¦ªà¦¦à§à¦§à¦¤à¦¿ à¦¸à¦¿à¦²à§‡à¦•à§à¦Ÿ à¦•à¦°à§à¦¨:", methodFile: "ðŸ“ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦«à¦¾à¦‡à¦²", methodLink: "ðŸ”— à¦•à§à¦²à¦¾à¦‰à¦¡ à¦²à¦¿à¦‚à¦•",
            lblSelectFile: "à¦«à¦¾à¦‡à¦² à¦¸à¦¿à¦²à§‡à¦•à§à¦Ÿ (à¦¸à¦°à§à¦¬à§‹à¦šà§à¦š à§¨ à¦à¦®à¦¬à¦¿)", lblLinkUrl: "à¦ªà¦¾à¦¬à¦²à¦¿à¦• à¦²à¦¿à¦‚à¦• à¦ªà§‡à¦¸à§à¦Ÿ à¦•à¦°à§à¦¨ (à¦…à¦¬à¦¶à§à¦¯à¦‡ Public)",
            shareUrl_ph: "https://drive.google.com/... (Public)",
            uploadSizeWarn: "âš ï¸ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦†à¦ªà¦²à§‹à¦¡ à¦¸à§€à¦®à¦¾: à§¨ à¦à¦®à¦¬à¦¿à¥¤ à¦«à¦¾à¦‡à¦² à¦¬à¦¡à¦¼ à¦¹à¦²à§‡ à¦†à¦—à§‡ Google Drive à¦¬à¦¾ YouTube-à¦ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à§à¦¨, à¦¶à§‡à¦¯à¦¼à¦¾à¦°à¦¿à¦‚ Public à¦•à¦°à§à¦¨, à¦¤à¦¾à¦°à¦ªà¦° à¦²à¦¿à¦‚à¦• à¦à¦–à¦¾à¦¨à§‡ à¦¦à¦¿à¦¨à¥¤",
            alertFileSizeAuto: "ðŸ”´ à¦«à¦¾à¦‡à¦² à§¨ à¦à¦®à¦¬à¦¿-à¦° à¦¬à§‡à¦¶à¦¿! à¦¸à§à¦¬à¦¯à¦¼à¦‚à¦•à§à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦²à¦¿à¦‚à¦• à¦®à§‹à¦¡à§‡ à¦¨à§‡à¦“à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ Drive/YouTube-à¦ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à§‡ Public à¦²à¦¿à¦‚à¦• à¦ªà§‡à¦¸à§à¦Ÿ à¦•à¦°à§à¦¨à¥¤",
            lockSemBefore: "ðŸ”’ à¦à¦‡ à¦«à¦¾à¦‡à¦²à¦Ÿà¦¿ à¦†à¦ªà¦¨à¦¾à¦° à¦°à¦¾à¦¨à¦¿à¦‚ à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°",
            lockSemAfter: " à¦ à¦¸à¦‚à¦°à¦•à§à¦·à¦¿à¦¤ à¦¹à¦¬à§‡à¥¤ à¦¸à¦¹à¦ªà¦¾à¦ à§€à¦°à¦¾ à¦à¦‡ à¦•à§‹à¦°à§à¦¸à§‡ à¦¦à§‡à¦–à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¥¤ à¦…à¦¨à§à¦¯ à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°à§‡ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡ à¦¨à¦¾à¥¤",
            typePdf: "à¦ªà¦¿à¦¡à¦¿à¦à¦« / à¦¹à§à¦¯à¦¾à¦¨à§à¦¡à¦¨à§‹à¦Ÿ", typeVideo: "à¦­à¦¿à¦¡à¦¿à¦“ / à¦‡à¦‰à¦Ÿà¦¿à¦‰à¦¬", typeAudio: "à¦…à¦¡à¦¿à¦“ / à¦­à¦¯à¦¼à§‡à¦¸", typeImage: "à¦›à¦¬à¦¿ / à¦¡à¦•à§à¦®à§‡à¦¨à§à¦Ÿ",
            alertLoginUpload: "à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦ªà§à¦°à¦¥à¦®à§‡ à¦²à¦—à¦‡à¦¨ à¦•à¦°à§à¦¨à¥¤",
            alertSemLock: "ðŸ”´ à¦²à¦•! à¦¶à§à¦§à§ à¦†à¦ªà¦¨à¦¾à¦° à¦¨à¦¿à¦œà§‡à¦° à¦°à¦¾à¦¨à¦¿à¦‚ à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°à§‡ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
            alertFileSize: "ðŸ”´ à¦«à¦¾à¦‡à¦² à§¨ à¦à¦®à¦¬à¦¿-à¦° à¦¬à§‡à¦¶à¦¿! à¦¡à§à¦°à¦¾à¦‡à¦­/à¦‡à¦‰à¦Ÿà¦¿à¦‰à¦¬à§‡ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à§‡ à¦ªà¦¾à¦¬à¦²à¦¿à¦• à¦²à¦¿à¦‚à¦• à¦¦à¦¿à¦¨à¥¤",
            alertPickFile: "à§¨ à¦à¦®à¦¬à¦¿-à¦° à¦¨à¦¿à¦šà§‡ à¦à¦•à¦Ÿà¦¿ à¦«à¦¾à¦‡à¦² à¦¸à¦¿à¦²à§‡à¦•à§à¦Ÿ à¦•à¦°à§à¦¨à¥¤", alertPasteLink: "à¦²à¦¿à¦‚à¦• à¦ªà§‡à¦¸à§à¦Ÿ à¦•à¦°à§à¦¨à¥¤",
            alertPublished: "à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦ªà§à¦°à¦•à¦¾à¦¶à¦¿à¦¤!",
            alertProfileSaved: "à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¸à§‡à¦­ à¦¹à¦¯à¦¼à§‡à¦›à§‡!", alertProfileRequired: "à¦œà¦°à§à¦°à¦¿ à¦¤à¦¥à§à¦¯ à¦“ à¦°à¦•à§à¦¤à§‡à¦° à¦—à§à¦°à§à¦ª à¦ªà§‚à¦°à¦£ à¦¬à¦¾à¦§à§à¦¯à¦¤à¦¾à¦®à§‚à¦²à¦•!",
            alertPassMin: "à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦•à¦®à¦ªà¦•à§à¦·à§‡ à§¬ à¦…à¦•à§à¦·à¦° à¦¹à¦¤à§‡ à¦¹à¦¬à§‡à¥¤",
            alertPageLoadError: "à¦ªà§‡à¦œ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦ªà§‡à¦œ à¦°à¦¿à¦«à§à¦°à§‡à¦¶ à¦•à¦°à§à¦¨ à¦¬à¦¾ à¦†à¦¬à¦¾à¦° à¦²à¦—à¦‡à¦¨ à¦•à¦°à§à¦¨à¥¤",
            alertThreadPostFailed: "à¦¥à§à¦°à§‡à¦¡ à¦ªà§‹à¦¸à§à¦Ÿ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤ à¦†à¦¬à¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à¦°à§à¦¨à¥¤",
            alertReplyPostFailed: "à¦‰à¦¤à§à¦¤à¦° à¦ªà§‹à¦¸à§à¦Ÿ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤ à¦†à¦¬à¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à¦°à§à¦¨à¥¤",
            alertThreadDeleteFailed: "à¦¥à§à¦°à§‡à¦¡ à¦®à§à¦›à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤",
            alertReplyDeleteFailed: "à¦‰à¦¤à§à¦¤à¦° à¦®à§à¦›à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤",
            genderMale: "à¦­à¦¾à¦‡à¦¦à§‡à¦° à¦¶à¦¾à¦–à¦¾", genderFemale: "à¦¬à§‹à¦¨à¦¦à§‡à¦° à¦¶à¦¾à¦–à¦¾", genderCombined: "à¦¸à¦®à§à¦®à¦¿à¦²à¦¿à¦¤ à¦¶à¦¾à¦–à¦¾", m_gender: "à¦œà§‡à¦¨à§à¦¡à¦¾à¦°",
            noClasses: "à¦•à§à¦²à¦¾à¦¸ à¦¨à§‡à¦‡à¥¤", loadFail: "à¦•à§‹à¦°à§à¦¸ à¦²à§‹à¦¡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤ à¦ªà§‡à¦œ à¦°à¦¿à¦«à§à¦°à§‡à¦¶ à¦•à¦°à§à¦¨à¥¤",
            displaySemSync: "à¦¸à¦¿à¦™à§à¦• à¦¹à¦šà§à¦›à§‡...", byAuthor: "à¦ªà§à¦°à¦•à¦¾à¦¶à¦•:", profileIncomplete: "à¦ªà§à¦°à§‹à¦«à¦¾à¦‡à¦² à¦…à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£!",
            loadingCourses: "à¦•à§‹à¦°à§à¦¸ à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...",
            btnView: "à¦¦à§‡à¦–à§à¦¨", btnEdit: "à¦à¦¡à¦¿à¦Ÿ", btnDelete: "à¦®à§à¦›à§à¦¨", btnViewFile: "à¦«à¦¾à¦‡à¦² à¦–à§à¦²à§à¦¨",
            confirmDeleteResource: "à¦à¦‡ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦¸à§à¦¥à¦¾à¦¯à¦¼à§€à¦­à¦¾à¦¬à§‡ à¦®à§à¦›à¦¬à§‡à¦¨?",
            alertResourceDeleted: "à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            sm_edit_title: "à¦¸à§à¦Ÿà¦¾à¦¡à¦¿ à¦®à§‡à¦Ÿà§‡à¦°à¦¿à¦¯à¦¼à¦¾à¦² à¦à¦¡à¦¿à¦Ÿ", sm_save: "à¦¸à¦‚à¦°à¦•à§à¦·à¦£ à¦•à¦°à§à¦¨",
            alertResourceUpdated: "à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¹à¦¯à¦¼à§‡à¦›à§‡!", alertUploading: "à¦«à¦¾à¦‡à¦² à¦†à¦ªà¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡, à¦…à¦ªà§‡à¦•à§à¦·à¦¾ à¦•à¦°à§à¦¨...",
            alertNotOwner: "à¦¶à§à¦§à§ à¦¨à¦¿à¦œà§‡à¦° à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦à¦¡à¦¿à¦Ÿ à¦¬à¦¾ à¦¡à¦¿à¦²à¦¿à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤",
            fileLinkMissing: "à¦«à¦¾à¦‡à¦² à¦²à¦¿à¦‚à¦• à¦¨à§‡à¦‡ â€” à¦†à¦¬à¦¾à¦° à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à§à¦¨à¥¤",
            alertInvalidFileUrl: "à¦†à¦ªà¦²à§‹à¦¡ à¦¸à¦«à§à¦¯ à¦¹à¦¯à¦¼à¦¨à¦¿: à¦¸à¦ à¦¿à¦• URL à¦¤à§ˆà¦°à¦¿ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤ Supabase-à¦ anon key à¦“ Public à¦¬à¦¾à¦•à§‡à¦Ÿ à¦šà§‡à¦• à¦•à¦°à§à¦¨à¥¤",
            alertOpenFileFailed: "à¦«à¦¾à¦‡à¦² à¦–à§‹à¦²à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤ à¦®à§à¦›à§‡ à¦†à¦¬à¦¾à¦° à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à§à¦¨ à¦…à¦¥à¦¬à¦¾ Supabase Storage à¦šà§‡à¦• à¦•à¦°à§à¦¨à¥¤",
            myAttendance: "à¦†à¦®à¦¾à¦° à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤à¦¿", noAttendanceYet: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤à¦¿à¦° à¦°à§‡à¦•à¦°à§à¦¡ à¦¨à§‡à¦‡à¥¤", overall: "à¦¸à¦¾à¦°à§à¦¬à¦¿à¦•",
            presentOf: "à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤ - à¦®à§‹à¦Ÿ", totalClasses: "à¦•à§à¦²à¦¾à¦¸", perCourse: "à¦ªà§à¦°à¦¤à¦¿ à¦•à§‹à¦°à§à¦¸",
            date: "à¦¤à¦¾à¦°à¦¿à¦–", course: "à¦•à§‹à¦°à§à¦¸", title: "à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦®", status: "à¦…à¦¬à¦¸à§à¦¥à¦¾",
            statusPresent: "à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤", statusAbsent: "à¦…à¦¨à§à¦ªà¦¸à§à¦¥à¦¿à¦¤",
            valProfileNameRequired: "à¦ªà§‚à¦°à§à¦£ à¦¨à¦¾à¦® à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨", valProfileUIDRequired: "à¦‡à¦‰à¦¨à¦¿à¦­à¦¾à¦°à§à¦¸à¦¿à¦Ÿà¦¿ à¦†à¦‡à¦¡à¦¿ à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨",
            valProfileBatchRequired: "à¦¬à§à¦¯à¦¾à¦š à¦¨à¦®à§à¦¬à¦° à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨", valProfilePhoneRequired: "à¦«à§‹à¦¨ à¦¨à¦®à§à¦¬à¦° à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨",
            valProfileBloodRequired: "à¦°à¦•à§à¦¤à§‡à¦° à¦—à§à¦°à§à¦ª à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨", valProfileEmgNameRequired: "à¦œà¦°à§à¦°à¦¿ à¦¯à§‹à¦—à¦¾à¦¯à§‹à¦—à§‡à¦° à¦¨à¦¾à¦® à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨",
            valProfileEmgPhoneRequired: "à¦œà¦°à§à¦°à¦¿ à¦«à§‹à¦¨ à¦¨à¦®à§à¦¬à¦° à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨",
            // Forum
            forumTab: "à¦†à¦²à§‹à¦šà¦¨à¦¾", forumNoThreads: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦¨à§‡à¦‡à¥¤ à¦ªà§à¦°à¦¥à¦®à¦Ÿà¦¿ à¦¶à§à¦°à§ à¦•à¦°à§à¦¨!",
            forumNewThread: "à¦¨à¦¤à§à¦¨ à¦¥à§à¦°à§‡à¦¡", forumThreadTitle: "à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦®", forumThreadTitlePH: "à¦à¦•à¦Ÿà¦¿ à¦ªà§à¦°à¦¶à§à¦¨ à¦œà¦¿à¦œà§à¦žà¦¾à¦¸à¦¾ à¦•à¦°à§à¦¨ à¦¬à¦¾ à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦¶à§à¦°à§ à¦•à¦°à§à¦¨...",
            forumThreadContent: "à¦¬à¦¿à¦¸à§à¦¤à¦¾à¦°à¦¿à¦¤", forumThreadContentPH: "à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦°à¦¶à§à¦¨ à¦¬à¦¾ à¦¬à¦¿à¦·à¦¯à¦¼ à¦¬à¦°à§à¦£à¦¨à¦¾ à¦•à¦°à§à¦¨...",
            forumSubmitThread: "à¦ªà§‹à¦¸à§à¦Ÿ à¦•à¦°à§à¦¨", forumReply: "à¦‰à¦¤à§à¦¤à¦° à¦¦à¦¿à¦¨", forumReplyPH: "à¦à¦•à¦Ÿà¦¿ à¦‰à¦¤à§à¦¤à¦° à¦²à¦¿à¦–à§à¦¨...",
            forumSubmitReply: "à¦ªà¦¾à¦ à¦¾à¦¨", forumCancelReply: "à¦¬à¦¾à¦¤à¦¿à¦²", forumReplies: "à¦Ÿà¦¿ à¦‰à¦¤à§à¦¤à¦°",
            forumPinned: "à¦ªà¦¿à¦¨ à¦•à¦°à¦¾", forumLocked: "à¦²à¦• à¦•à¦°à¦¾", forumBy: "à¦²à§‡à¦–à¦•:",
            forumJustNow: "à¦à¦‡à¦®à¦¾à¦¤à§à¦°", forumMinutesAgo: "à¦®à¦¿. à¦†à¦—à§‡", forumHoursAgo: "à¦˜. à¦†à¦—à§‡", forumDaysAgo: "à¦¦à¦¿. à¦†à¦—à§‡",
            forumAlertTitleRequired: "à¦…à¦¨à§à¦—à§à¦°à¦¹ à¦•à¦°à§‡ à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦® à¦²à¦¿à¦–à§à¦¨à¥¤", forumAlertContentRequired: "à¦…à¦¨à§à¦—à§à¦°à¦¹ à¦•à¦°à§‡ à¦®à§‡à¦¸à§‡à¦œ à¦²à¦¿à¦–à§à¦¨à¥¤",
            forumAlertThreadPosted: "à¦¥à§à¦°à§‡à¦¡ à¦ªà§‹à¦¸à§à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡!", forumAlertReplyPosted: "à¦‰à¦¤à§à¦¤à¦° à¦ªà§‹à¦¸à§à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡!",
            forumAlertThreadDeleted: "à¦¥à§à¦°à§‡à¦¡ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤", forumAlertReplyDeleted: "à¦‰à¦¤à§à¦¤à¦° à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            forumConfirmDeleteThread: "à¦à¦‡ à¦¥à§à¦°à§‡à¦¡ à¦à¦¬à¦‚ à¦¸à¦¬ à¦‰à¦¤à§à¦¤à¦° à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¬à§‡à¦¨?", forumConfirmDeleteReply: "à¦à¦‡ à¦‰à¦¤à§à¦¤à¦°à¦Ÿà¦¿ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¬à§‡à¦¨?",
            forumLockedNotice: "à¦à¦‡ à¦¥à§à¦°à§‡à¦¡ à¦²à¦• à¦•à¦°à¦¾ à¦†à¦›à§‡à¥¤ à¦¨à¦¤à§à¦¨ à¦‰à¦¤à§à¦¤à¦° à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡ à¦¨à¦¾à¥¤",
            valForumTitleRequired: "à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦® à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨", valForumContentRequired: "à¦®à§‡à¦¸à§‡à¦œ à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨",
            valForumReplyRequired: "à¦‰à¦¤à§à¦¤à¦° à¦–à¦¾à¦²à¦¿ à¦°à¦¾à¦–à¦¾ à¦¯à¦¾à¦¬à§‡ à¦¨à¦¾",
            loadingCourses: "à¦•à§‹à¦°à§à¦¸ à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...", noResults: "à¦•à¦¿à¦›à§ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤", loadError: "à¦¡à§‡à¦Ÿà¦¾ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤", retryBtn: "à¦†à¦¬à¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾",
            loadingForums: "à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...", noForums: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦¨à§‡à¦‡à¥¤", errorForums: "à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤",
            noAttendanceData: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤à¦¿ à¦°à§‡à¦•à¦°à§à¦¡ à¦¨à§‡à¦‡à¥¤",
            // Daily Class Resources
            dailyResourcesTitle: "à¦¦à§ˆà¦¨à¦¿à¦• à¦•à§à¦²à¦¾à¦¸ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸", dailyResourcesBack: "à¦¹à§‹à¦®à§‡ à¦«à¦¿à¦°à§à¦¨",
            dailyResourcesPrevDay: "à¦†à¦—à§‡à¦° à¦¦à¦¿à¦¨", dailyResourcesNextDay: "à¦ªà¦°à§‡à¦° à¦¦à¦¿à¦¨",
            dailyResourcesJumpDate: "à¦¤à¦¾à¦°à¦¿à¦–à§‡ à¦¯à¦¾à¦¨", dailyResourcesClassDate: "à¦•à§à¦²à¦¾à¦¸à§‡à¦° à¦¤à¦¾à¦°à¦¿à¦–",
            dailyResourcesUploaded: "à¦†à¦ªà¦²à§‹à¦¡", dailyResourcesNoResources: "à¦à¦‡ à¦•à§à¦²à¦¾à¦¸à§‡à¦° à¦œà¦¨à§à¦¯ à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦¨à§‡à¦‡à¥¤",
            dailyResourcesLoading: "à¦¦à§ˆà¦¨à¦¿à¦• à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...", dailyResourcesError: "à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤",
            dailyResourcesBtnUpload: "à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦¯à§‹à¦— à¦•à¦°à§à¦¨", dailyResourcesSlot: "à¦¸à§à¦²à¦Ÿ",
            dailyResourcesBy: "à¦ªà§à¦°à¦•à¦¾à¦¶à¦•", dailyResourcesCount: "à¦Ÿà¦¿ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸",
            dailyResourcesBadge: "à¦°à¦¿à¦¸à§‹à¦°à§à¦¸",
            resourcesDateFilter: "à¦•à§à¦²à¦¾à¦¸à§‡à¦° à¦¤à¦¾à¦°à¦¿à¦– à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦°",
            resourcesAllDates: "à¦¸à¦¬à¦—à§à¦²à§‹ à¦¤à¦¾à¦°à¦¿à¦–",
            forumDateFilter: "à¦¤à¦¾à¦°à¦¿à¦– à¦…à¦¨à§à¦¯à¦¾à¦¯à¦¼à§€ à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦°",
            forumAllDates: "à¦¸à¦¬à¦—à§à¦²à§‹ à¦¤à¦¾à¦°à¦¿à¦–",
            forumTagDate: "à¦•à§à¦²à¦¾à¦¸à§‡à¦° à¦¤à¦¾à¦°à¦¿à¦–à§‡ à¦Ÿà§à¦¯à¦¾à¦— à¦•à¦°à§à¦¨",
            forumNoDate: "à¦•à§‹à¦¨à§‹ à¦¤à¦¾à¦°à¦¿à¦– à¦¨à§‡à¦‡ (à¦¸à¦¾à¦§à¦¾à¦°à¦£)",
            attExpandHint: "বিস্তারিত দেখতে ক্লিক করুন", attendanceCol: "উপস্থিতি", percentCol: "%",
        }
    },

    /* ---------- auth (login.html) ---------- */
    auth: {
        en: {
            portalTitle: "DIS Student Portal", portalSubtitle: "Department of Islamic Studies",
            loginTab: "Login", registerTab: "Register",
            lblEmail: "Email Address", lblPassword: "Password", btnLogin: "Sign In",
            lblRegName: "Full Name", lblRegUID: "University ID (UID)",
            lblRegBatchNum: "Batch No", lblRegSemester: "Trimester", lblRegGender: "Gender", lblProfileGender: "Gender", btnRegister: "Complete Registration",
            valEmailRequired: "Email is required", valEmailInvalid: "Please enter a valid email",
            valPasswordRequired: "Password is required", valPasswordMin: "Minimum 6 characters",
            valNameRequired: "Name is required", valUIDRequired: "UID is required",
            valBatchRequired: "Batch number is required", valSemesterRequired: "Trimester is required",
            alertRegSuccess: "Registration Successful!",
            alertRegError: "Registration Error: ",
            alertLoginError: "Login Error: "
        },
        bn: {
            portalTitle: "à¦¡à¦¿à¦†à¦‡à¦à¦¸ à¦¸à§à¦Ÿà§à¦¡à§‡à¦¨à§à¦Ÿ à¦ªà§‹à¦°à§à¦Ÿà¦¾à¦²", portalSubtitle: "à¦‡à¦¸à¦²à¦¾à¦®à¦¿à¦• à¦¸à§à¦Ÿà¦¾à¦¡à¦¿à¦œ à¦¬à¦¿à¦­à¦¾à¦—",
            loginTab: "à¦²à¦—à¦‡à¦¨", registerTab: "à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨",
            lblEmail: "à¦‡à¦®à§‡à¦‡à¦² à¦ à¦¿à¦•à¦¾à¦¨à¦¾", lblPassword: "à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡", btnLogin: "à¦ªà§à¦°à¦¬à§‡à¦¶ à¦•à¦°à§à¦¨",
            lblRegName: "à¦ªà§‚à¦°à§à¦£ à¦¨à¦¾à¦®", lblRegUID: "à¦‡à¦‰à¦¨à¦¿à¦­à¦¾à¦°à§à¦¸à¦¿à¦Ÿà¦¿ à¦†à¦‡à¦¡à¦¿ (UID)",
            lblRegBatchNum: "à¦¬à§à¦¯à¦¾à¦š à¦¨à¦‚", lblRegSemester: "à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°", lblRegGender: "à¦œà§‡à¦¨à§à¦¡à¦¾à¦°", lblProfileGender: "à¦œà§‡à¦¨à§à¦¡à¦¾à¦°", btnRegister: "à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨ à¦¸à¦®à§à¦ªà¦¨à§à¦¨ à¦•à¦°à§à¦¨",
            valEmailRequired: "à¦‡à¦®à§‡à¦‡à¦² à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨", valEmailInvalid: "à¦¸à¦ à¦¿à¦• à¦‡à¦®à§‡à¦‡à¦² à¦¦à¦¿à¦¨",
            valPasswordRequired: "à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨", valPasswordMin: "à¦¸à¦°à§à¦¬à¦¨à¦¿à¦®à§à¦¨ à§¬ à¦…à¦•à§à¦·à¦°",
            valNameRequired: "à¦¨à¦¾à¦® à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨", valUIDRequired: "UID à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨",
            valBatchRequired: "à¦¬à§à¦¯à¦¾à¦š à¦¨à¦®à§à¦¬à¦° à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨", valSemesterRequired: "à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦° à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨",
            alertRegSuccess: "à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨ à¦¸à¦«à¦² à¦¹à¦¯à¦¼à§‡à¦›à§‡!",
            alertRegError: "à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¨ à¦¤à§à¦°à§à¦Ÿà¦¿: ",
            alertLoginError: "à¦²à¦—à¦‡à¦¨ à¦¤à§à¦°à§à¦Ÿà¦¿: "
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
            title: "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ø§Ù„Ù…Ø±ÙƒØ²ÙŠØ©", subtitle: "Ù„Ù„Ù…ÙˆØ¸ÙÙŠÙ† Ø§Ù„Ù…ØµØ±Ø­ Ù„Ù‡Ù… ÙÙ‚Ø·",
            lblEmail: "Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø§Ù„Ø³Ø±ÙŠ", lblPassword: "ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©", btn: "Ø§Ù„ØªØ­Ù‚Ù‚ ÙˆØ§Ù„Ø¯Ø®ÙˆÙ„",
            accessDenied: "ØªÙ… Ø±ÙØ¶ Ø§Ù„Ø¯Ø®ÙˆÙ„! Ù„ÙŠØ³ Ù„Ø¯ÙŠÙƒ ØµÙ„Ø§Ø­ÙŠØ§Øª Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„.",
            success: "ØªÙ… Ù…Ù†Ø­ Ø§Ù„Ø¯Ø®ÙˆÙ„! Ù…Ø±Ø­Ø¨Ù‹Ø§ Ø¨Ùƒ ÙÙŠ Ø§Ù„Ù„ÙˆØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©.",
            error: "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯ ØºÙŠØ± ØµØ§Ù„Ø­Ø©!"
        },
        bn: {
            title: "à¦¸à§‡à¦¨à§à¦Ÿà§à¦°à¦¾à¦² à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦—à§‡à¦Ÿà¦“à¦¯à¦¼à§‡", subtitle: "à¦¶à§à¦§à§à¦®à¦¾à¦¤à§à¦° à¦…à¦¨à§à¦®à§‹à¦¦à¦¿à¦¤ à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦¦à§‡à¦° à¦œà¦¨à§à¦¯",
            lblEmail: "à¦—à§‹à¦ªà¦¨ à¦‡à¦®à§‡à¦‡à¦² à¦†à¦‡à¦¡à¦¿", lblPassword: "à¦®à¦¾à¦¸à§à¦Ÿà¦¾à¦° à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡", btn: "à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§à¦¨ à¦à¦¬à¦‚ à¦ªà§à¦°à¦¬à§‡à¦¶ à¦•à¦°à§à¦¨",
            accessDenied: "à¦…à§à¦¯à¦¾à¦•à§à¦¸à§‡à¦¸ à¦°à¦¿à¦«à¦¿à¦‰à¦œà¦¡! à¦†à¦ªà¦¨à¦¾à¦° à¦…à§à¦¯à¦¾à¦¡à¦®à¦¿à¦¨ à¦ªà¦¾à¦°à¦®à¦¿à¦¶à¦¨ à¦¨à§‡à¦‡à¥¤",
            success: "à¦…à§à¦¯à¦¾à¦•à§à¦¸à§‡à¦¸ à¦—à§à¦°à¦¾à¦¨à§à¦Ÿà§‡à¦¡! à¦®à¦¾à¦¸à§à¦Ÿà¦¾à¦° à¦ªà§à¦¯à¦¾à¦¨à§‡à¦²à§‡ à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®à¥¤",
            error: "à¦­à§à¦² à¦‡à¦®à§‡à¦‡à¦² à¦¬à¦¾ à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡!"
        }
    },

    /* ---------- admin (admin-dashboard.html) ---------- */
    admin: {
        en: {
            logoutConfirm: "Logout?", unsavedChanges: "You have unsaved changes. Discard?",
            editModalTitle: "Update Management Entry", btnClose: "Cancel", btnSave: "Save Changes",
            errorEmbedded: "ðŸ”¥ This file could not be loaded!",
            errorRoutine: "Failed to load routines.", errorNotice: "Failed to load notices.",
            errorCourseMapping: "Failed to load course mappings.", errorResources: "Failed to load resources.",
            errorStudents: "Failed to load student directory.",
            alertDeleteConfirm: "Are you sure you want to permanently delete this?",
            alertDeleteStudentConfirm: "Are you sure you want to permanently DELETE this student account? This cannot be undone!",
            alertPasswordReset: "Are you sure you want to reset this student's password?",
            alertMappingDeleted: "Course mapping removed.",
            // Attendance (routine-based)
            attendanceTitle: "Attendance Management",
            classesToday: "classes today",
            noClassesToday: "No daily routines scheduled for today.",
            markAttendanceBtn: "Mark Attendance",
            batchLabel: "Batch",
            markedCount: "marked",
            statusPresent: "Present",
            statusAbsent: "Absent",
            allPresent: "All Present",
            allAbsent: "All Absent",
            saveAttendance: "Save Attendance",
            cancelAttendance: "Cancel",
            attendanceSaved: "Attendance saved successfully!",
            noStudentsInBatch: "No students registered in this batch.",
            noStudentsForCourse: "No students found for this course. Students may not have registered with matching trimester info.",
            noCourseMappingForAttendance: "This course is not mapped to any semester yet. Please create a course mapping first (Course Mapping Wizard).",
            noCourseCodeInRoutine: "This routine has no course code assigned. Please edit the routine to add a course code.",
            todayClassesLabel: "Today's Classes",
            loadingRoutines: "Loading routines...",
            loadingReport: "Loading report...",
            attendanceDesc: "Today's daily routines — click a class to mark attendance. Students are matched to courses via semester mapping.",
            genderMale: "Male Section", genderFemale: "Female Section", genderCombined: "Combined Section",
            studentIdCol: "Student ID",
            nameCol: "Name",
            statusCol: "Status",
            attendanceReport: "Attendance Report",
            noAttendanceRecords: "No attendance records yet.",
            attendanceSummaryLabel: "Summary:",
            presentCount: "present",
            absentCount: "absent",
            noAttendanceData: "No attendance data available.",
            attendanceCol: "Attendance",
            percentCol: "%",
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
            routinePermDayError: "Permanent schedule requires a class day (Satâ€“Fri). Please select the day.",
            routinePublished: "Routine schedule published!",
            routinePublishFailed: "Failed to publish routine: ",
            mapFieldsRequired: "Please fill in course code, title & teacher name.",
            mapSuccess: "Course mapped successfully",
            mapFailed: "Mapping failed: ",
            noticeContentRequired: "Notice content cannot be empty.",
            noticePublished: "Notice broadcasted!",
            noticePublishFailed: "Failed to broadcast notice: ",
            // Routine Date Ledger
            ledgerTitle: "Routine Date Ledger",
            ledgerDesc: "Confirm which dates classes were actually held â€” only confirmed dates appear in student resource filters.",
            ledgerColDate: "Date",
            ledgerColCourse: "Code",
            ledgerColSubject: "Subject",
            ledgerColBatch: "Batch",
            ledgerColGender: "Gen",
            ledgerColHeld: "Held?",
            ledgerColConfirmed: "Confirmed By",
            ledgerConfirmAll: "Confirm All Visible",
            ledgerNoEntries: "No routine dates synced yet. Create daily routines to auto-populate this ledger.",
            ledgerToggled: "Ledger updated.",
            ledgerAllConfirmed: "All entries already confirmed.",
            ledgerConfirmedCount: "entries confirmed.",
            ledgerUnconfirmedCount: "entries pending confirmation.",
            ledgerSyncBtn: "Sync Existing Routines",
            ledgerSyncing: "Syncing...",
            ledgerSyncDone: "daily routines synced to ledger.",
            ledgerSyncNone: "No existing daily routines found to sync.",
            ledgerSyncFailed: "Sync failed",
            // Attendance report drill-down
            attExpandHint: "Click to expand/collapse course details",
            attEdit: "Edit",
            attDelete: "Delete",
            attDeleteRecordConfirm: "Delete this attendance record? This will sync to the student's page.",
            attRecordDeleted: "Attendance record deleted.",
            // Ledger action column
            ledgerColAction: "Act",
            ledgerDeleteConfirm: "Delete this ledger entry? This cannot be undone.",
            ledgerDeleted: "Ledger entry deleted.",
        },
        bn: {
            logoutConfirm: "à¦²à¦—à¦†à¦‰à¦Ÿ à¦•à¦°à¦¬à§‡à¦¨?", unsavedChanges: "à¦†à¦ªà¦¨à¦¾à¦° à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦¸à§‡à¦­ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤ à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à¦¬à§‡à¦¨?",
            editModalTitle: "à¦®à§à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§à¦Ÿ à¦à¦¨à§à¦Ÿà§à¦°à¦¿ à¦†à¦ªà¦¡à§‡à¦Ÿ", btnClose: "à¦¬à¦¾à¦¤à¦¿à¦²", btnSave: "à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦¸à¦‚à¦°à¦•à§à¦·à¦£",
            errorEmbedded: "ðŸ”¥ à¦à¦‡ à¦«à¦¾à¦‡à¦²à¦Ÿà¦¿ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿!",
            errorRoutine: "à¦°à§à¦Ÿà¦¿à¦¨ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤", errorNotice: "à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤",
            errorCourseMapping: "à¦•à§‹à¦°à§à¦¸ à¦®à§à¦¯à¦¾à¦ªà¦¿à¦‚ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤", errorResources: "à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤",
            errorStudents: "à¦¸à§à¦Ÿà§à¦¡à§‡à¦¨à§à¦Ÿ à¦¡à¦¿à¦°à§‡à¦•à§à¦Ÿà¦°à¦¿ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥à¥¤",
            alertDeleteConfirm: "à¦†à¦ªà¦¨à¦¿ à¦•à¦¿ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦¯à§‡ à¦à¦Ÿà¦¿ à¦¸à§à¦¥à¦¾à¦¯à¦¼à§€à¦­à¦¾à¦¬à§‡ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¬à§‡à¦¨?",
            alertDeleteStudentConfirm: "à¦†à¦ªà¦¨à¦¿ à¦•à¦¿ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦¯à§‡ à¦à¦‡ à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€à¦° à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦¸à§à¦¥à¦¾à¦¯à¦¼à§€à¦­à¦¾à¦¬à§‡ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¬à§‡à¦¨? à¦à¦Ÿà¦¿ à¦ªà§‚à¦°à§à¦¬à¦¾à¦¬à¦¸à§à¦¥à¦¾à¦¯à¦¼ à¦«à§‡à¦°à¦¾à¦¨à§‹ à¦¯à¦¾à¦¬à§‡ à¦¨à¦¾!",
            alertPasswordReset: "à¦†à¦ªà¦¨à¦¿ à¦•à¦¿ à¦à¦‡ à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€à¦° à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦°à¦¿à¦¸à§‡à¦Ÿ à¦•à¦°à¦¤à§‡ à¦šà¦¾à¦¨?",
            alertMappingDeleted: "à¦•à§‹à¦°à§à¦¸ à¦®à§à¦¯à¦¾à¦ªà¦¿à¦‚ à¦¸à¦°à¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            // Attendance (routine-based)
            attendanceTitle: "à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤à¦¿ à¦¬à§à¦¯à¦¬à¦¸à§à¦¥à¦¾à¦ªà¦¨à¦¾",
            classesToday: "à¦Ÿà¦¿ à¦•à§à¦²à¦¾à¦¸ à¦†à¦œ",
            noClassesToday: "à¦†à¦œà¦•à§‡à¦° à¦•à§‹à¦¨à§‹ à¦¡à§‡à¦‡à¦²à¦¿ à¦°à§à¦Ÿà¦¿à¦¨ à¦¨à¦¿à¦°à§à¦§à¦¾à¦°à¦¿à¦¤ à¦¨à§‡à¦‡à¥¤",
            markAttendanceBtn: "à¦¹à¦¾à¦œà¦¿à¦°à¦¾ à¦¦à¦¿à¦¨",
            batchLabel: "à¦¬à§à¦¯à¦¾à¦š",
            markedCount: "à¦œà¦¨à§‡à¦° à¦¹à¦¾à¦œà¦¿à¦°à¦¾",
            statusPresent: "à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤",
            statusAbsent: "à¦…à¦¨à§à¦ªà¦¸à§à¦¥à¦¿à¦¤",
            allPresent: "à¦¸à¦¬à¦¾à¦‡ à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤",
            allAbsent: "à¦¸à¦¬à¦¾à¦‡ à¦…à¦¨à§à¦ªà¦¸à§à¦¥à¦¿à¦¤",
            saveAttendance: "à¦¹à¦¾à¦œà¦¿à¦°à¦¾ à¦¸à¦‚à¦°à¦•à§à¦·à¦£",
            cancelAttendance: "বাতিল",
            attendanceSaved: "à¦¹à¦¾à¦œà¦¿à¦°à¦¾ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦¸à¦‚à¦°à¦•à§à¦·à¦¿à¦¤ à¦¹à¦¯à¦¼à§‡à¦›à§‡!",
            noStudentsInBatch: "à¦à¦‡ à¦¬à§à¦¯à¦¾à¦šà§‡ à¦•à§‹à¦¨à§‹ à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€ à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¿à¦¤ à¦¨à§‡à¦‡à¥¤",
            noStudentsForCourse: "à¦à¦‡ à¦•à§‹à¦°à§à¦¸à§‡à¦° à¦œà¦¨à§à¦¯ à¦•à§‹à¦¨à§‹ à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤ à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€à¦°à¦¾ à¦¸à¦®à§à¦­à¦¬à¦¤ à¦®à¦¿à¦²à¦¿à¦¤ à¦Ÿà§à¦°à¦¾à¦‡à¦®à§‡à¦¸à§à¦Ÿà¦¾à¦° à¦¤à¦¥à§à¦¯ à¦¦à¦¿à¦¯à¦¼à§‡ à¦¨à¦¿à¦¬à¦¨à§à¦§à¦¿à¦¤ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤",
            noCourseMappingForAttendance: "à¦à¦‡ à¦•à§‹à¦°à§à¦¸à¦Ÿà¦¿ à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦¸à§‡à¦®à¦¿à¦¸à§à¦Ÿà¦¾à¦°à§‡ à¦®à§à¦¯à¦¾à¦ª à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤ à¦…à¦¨à§à¦—à§à¦°à¦¹ à¦•à¦°à§‡ à¦ªà§à¦°à¦¥à¦®à§‡ à¦à¦•à¦Ÿà¦¿ à¦•à§‹à¦°à§à¦¸ à¦®à§à¦¯à¦¾à¦ªà¦¿à¦‚ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§à¦¨ (Course Mapping Wizard)à¥¤",
            noCourseCodeInRoutine: "à¦à¦‡ à¦°à§à¦Ÿà¦¿à¦¨à§‡ à¦•à§‹à¦¨à§‹ à¦•à§‹à¦°à§à¦¸ à¦•à§‹à¦¡ à¦¨à§‡à¦‡à¥¤ à¦…à¦¨à§à¦—à§à¦°à¦¹ à¦•à¦°à§‡ à¦°à§à¦Ÿà¦¿à¦¨à¦Ÿà¦¿ à¦¸à¦®à§à¦ªà¦¾à¦¦à¦¨à¦¾ à¦•à¦°à§‡ à¦à¦•à¦Ÿà¦¿ à¦•à§‹à¦°à§à¦¸ à¦•à§‹à¦¡ à¦¯à§‹à¦— à¦•à¦°à§à¦¨à¥¤",
            todayClassesLabel: "à¦†à¦œà¦•à§‡à¦° à¦•à§à¦²à¦¾à¦¸à¦¸à¦®à§‚à¦¹",
            loadingRoutines: "à¦°à§à¦Ÿà¦¿à¦¨ à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...",
            loadingReport: "à¦°à¦¿à¦ªà§‹à¦°à§à¦Ÿ à¦²à§‹à¦¡ à¦¹à¦šà§à¦›à§‡...",
            attendanceDesc: "আজকের ডেইলি রুটিন — সেমিস্টার ম্যাপিং এর মাধ্যমে শিক্ষার্থীদের সাথে কোর্স মিলিয়ে হাজিরা দিতে একটি ক্লাসে ক্লিক করুন।",
            genderMale: "ভাইদের শাখা", genderFemale: "বোনদের শাখা", genderCombined: "সম্মিলিত শাখা",
            studentIdCol: "à¦¸à§à¦Ÿà§à¦¡à§‡à¦¨à§à¦Ÿ à¦†à¦‡à¦¡à¦¿",
            nameCol: "à¦¨à¦¾à¦®",
            statusCol: "à¦…à¦¬à¦¸à§à¦¥à¦¾",
            attendanceReport: "à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤à¦¿ à¦°à¦¿à¦ªà§‹à¦°à§à¦Ÿ",
            noAttendanceRecords: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤à¦¿ à¦°à§‡à¦•à¦°à§à¦¡ à¦¨à§‡à¦‡à¥¤",
            attendanceSummaryLabel: "à¦¸à¦¾à¦°à¦¾à¦‚à¦¶:",
            presentCount: "à¦‰à¦ªà¦¸à§à¦¥à¦¿à¦¤",
            absentCount: "à¦…à¦¨à§à¦ªà¦¸à§à¦¥à¦¿à¦¤",
            noAttendanceData: "à¦•à§‹à¦¨à§‹ à¦¹à¦¾à¦œà¦¿à¦°à¦¾à¦° à¦¡à§‡à¦Ÿà¦¾ à¦¨à§‡à¦‡à¥¤",
            attendanceCol: "à¦¹à¦¾à¦œà¦¿à¦°à¦¾",
            percentCol: "%",
            refreshBtn: "à¦°à¦¿à¦«à§à¦°à§‡à¦¶",
            noRoutines: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦°à§à¦Ÿà¦¿à¦¨ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤",
            noNotices: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà§‹à¦¸à§à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤",
            noMappings: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦•à§‹à¦°à§à¦¸ à¦®à§à¦¯à¦¾à¦ªà¦¿à¦‚ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤",
            noStudents: "à¦•à§‹à¦¨à§‹ à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€ à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤",
            noResources: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤",
            alertSaveFailed: "à¦¸à¦‚à¦°à¦•à§à¦·à¦£ à¦¬à§à¦¯à¦°à§à¦¥: ",
            alertNoEmail: "à¦à¦‡ à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€à¦° à¦•à§‹à¦¨à§‹ à¦‡à¦®à§‡à¦‡à¦² à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤",
            alertResetSent: "à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦°à¦¿à¦¸à§‡à¦Ÿ à¦‡à¦®à§‡à¦‡à¦² à¦ªà¦¾à¦ à¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡ ",
            alertResetFailed: "à¦°à¦¿à¦¸à§‡à¦Ÿ à¦¬à§à¦¯à¦°à§à¦¥: ",
            alertDeleteSuccess: "à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡!",
            alertDeleteFailed: "à¦®à§à¦›à¦¤à§‡ à¦¬à§à¦¯à¦°à§à¦¥: ",
            alertAccountDeleted: "à¦…à§à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§à¦Ÿ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            alertActionFailed: "à¦•à¦¾à¦œà¦Ÿà¦¿ à¦¬à§à¦¯à¦°à§à¦¥ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦†à¦¬à¦¾à¦° à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à¦°à§à¦¨à¥¤",
            // Form submission toasts
            routinePermDayError: "à¦¸à§à¦¥à¦¾à¦¯à¦¼à§€ à¦¸à§‚à¦šà¦¿à¦° à¦œà¦¨à§à¦¯ à¦•à§à¦²à¦¾à¦¸ à¦¡à§‡ (à¦¶à¦¨à¦¿â€“à¦¶à§à¦•à§à¦°) à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨ à¦•à¦°à§à¦¨à¥¤",
            routinePublished: "à¦°à§à¦Ÿà¦¿à¦¨ à¦¸à§‚à¦šà¦¿ à¦ªà§à¦°à¦•à¦¾à¦¶à¦¿à¦¤ à¦¹à¦¯à¦¼à§‡à¦›à§‡!",
            routinePublishFailed: "à¦°à§à¦Ÿà¦¿à¦¨ à¦ªà§à¦°à¦•à¦¾à¦¶ à¦¬à§à¦¯à¦°à§à¦¥: ",
            mapFieldsRequired: "à¦•à§‹à¦°à§à¦¸ à¦•à§‹à¦¡, à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦® à¦“ à¦¶à¦¿à¦•à§à¦·à¦•à§‡à¦° à¦¨à¦¾à¦® à¦ªà§‚à¦°à¦£ à¦•à¦°à§à¦¨à¥¤",
            mapSuccess: "à¦•à§‹à¦°à§à¦¸ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦®à§à¦¯à¦¾à¦ª à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡",
            mapFailed: "à¦®à§à¦¯à¦¾à¦ªà¦¿à¦‚ à¦¬à§à¦¯à¦°à§à¦¥: ",
            noticeContentRequired: "à¦¨à§‹à¦Ÿà¦¿à¦¶à§‡à¦° à¦¬à¦¿à¦·à¦¯à¦¼à¦¬à¦¸à§à¦¤à§ à¦–à¦¾à¦²à¦¿ à¦°à¦¾à¦–à¦¾ à¦¯à¦¾à¦¬à§‡ à¦¨à¦¾à¥¤",
            noticePublished: "à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà§à¦°à¦•à¦¾à¦¶à¦¿à¦¤ à¦¹à¦¯à¦¼à§‡à¦›à§‡!",
            noticePublishFailed: "à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà§à¦°à¦•à¦¾à¦¶ à¦¬à§à¦¯à¦°à§à¦¥: ",
            // Routine Date Ledger
            ledgerTitle: "à¦°à§à¦Ÿà¦¿à¦¨ à¦¡à§‡à¦Ÿ à¦²à§‡à¦œà¦¾à¦°",
            ledgerDesc: "à¦•à§‹à¦¨ à¦¤à¦¾à¦°à¦¿à¦–à§‡ à¦•à§à¦²à¦¾à¦¸ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¤à¦¾ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à§à¦¨ â€” à¦¶à§à¦§à§ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤à¦•à§ƒà¦¤ à¦¤à¦¾à¦°à¦¿à¦–à¦‡ à¦¸à§à¦Ÿà§à¦¡à§‡à¦¨à§à¦Ÿ à¦°à¦¿à¦¸à§‹à¦°à§à¦¸ à¦«à¦¿à¦²à§à¦Ÿà¦¾à¦°à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤",
            ledgerColDate: "à¦¤à¦¾à¦°à¦¿à¦–",
            ledgerColCourse: "à¦•à§‹à¦¡",
            ledgerColSubject: "à¦¬à¦¿à¦·à¦¯à¦¼",
            ledgerColBatch: "à¦¬à§à¦¯à¦¾à¦š",
            ledgerColGender: "à¦œà§‡à¦¨à§à¦¡à¦¾à¦°",
            ledgerColHeld: "à¦•à§à¦²à¦¾à¦¸?",
            ledgerColConfirmed: "à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤à¦•à¦¾à¦°à§€",
            ledgerConfirmAll: "à¦¸à¦•à¦² à¦¦à§ƒà¦¶à§à¦¯à¦®à¦¾à¦¨ à¦•à¦¨à¦«à¦¾à¦°à§à¦® à¦•à¦°à§à¦¨",
            ledgerNoEntries: "à¦à¦–à¦¨à§‹ à¦•à§‹à¦¨à§‹ à¦°à§à¦Ÿà¦¿à¦¨ à¦¡à§‡à¦Ÿ à¦¸à¦¿à¦™à§à¦• à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤ à¦¡à§‡à¦‡à¦²à¦¿ à¦°à§à¦Ÿà¦¿à¦¨ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦²à§‡ à¦¸à§à¦¬à¦¯à¦¼à¦‚à¦•à§à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦à¦–à¦¾à¦¨à§‡ à¦¯à§‹à¦— à¦¹à¦¬à§‡à¥¤",
            ledgerToggled: "à¦²à§‡à¦œà¦¾à¦° à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            ledgerAllConfirmed: "à¦¸à¦•à¦² à¦à¦¨à§à¦Ÿà§à¦°à¦¿ à¦‡à¦¤à¦¿à¦®à¦§à§à¦¯à§‡ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤à¥¤",
            ledgerConfirmedCount: "à¦Ÿà¦¿ à¦à¦¨à§à¦Ÿà§à¦°à¦¿ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            ledgerUnconfirmedCount: "à¦Ÿà¦¿ à¦à¦¨à§à¦Ÿà§à¦°à¦¿ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤à¦•à¦°à¦£ à¦¬à¦¾à¦•à¦¿à¥¤",
            ledgerSyncBtn: "à¦ªà§‚à¦°à§à¦¬à§‡à¦° à¦°à§à¦Ÿà¦¿à¦¨ à¦¸à¦¿à¦™à§à¦• à¦•à¦°à§à¦¨",
            ledgerSyncing: "à¦¸à¦¿à¦™à§à¦• à¦¹à¦šà§à¦›à§‡...",
            ledgerSyncDone: "à¦Ÿà¦¿ à¦¡à§‡à¦‡à¦²à¦¿ à¦°à§à¦Ÿà¦¿à¦¨ à¦²à§‡à¦œà¦¾à¦°à§‡ à¦¸à¦¿à¦™à§à¦• à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            ledgerSyncNone: "à¦•à§‹à¦¨à§‹ à¦ªà§‚à¦°à§à¦¬à§‡à¦° à¦¡à§‡à¦‡à¦²à¦¿ à¦°à§à¦Ÿà¦¿à¦¨ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤",
            ledgerSyncFailed: "à¦¸à¦¿à¦™à§à¦• à¦¬à§à¦¯à¦°à§à¦¥",
            // Attendance report drill-down
            attExpandHint: "কোর্সের বিস্তারিত দেখতে/লুকাতে ক্লিক করুন",
            attEdit: "এডিট",
            attDelete: "ডিলিট",
            attDeleteRecordConfirm: "এই হাজিরা রেকর্ড ডিলিট করবেন? এটি স্টুডেন্টের পেইজে সিঙ্ক হবে।",
            attRecordDeleted: "হাজিরা রেকর্ড ডিলিট হয়েছে।",
            // Ledger action column
            ledgerColAction: "অ্যাকশন",
            ledgerDeleteConfirm: "এই লেজার এন্ট্রি ডিলিট করবেন? এটি পুনরায় ফেরত আনা যাবে না।",
            ledgerDeleted: "লেজার এন্ট্রি ডিলিট হয়েছে।",
            // Forum moderation
            forumTitle: "à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦«à§‹à¦°à¦¾à¦® à¦®à¦¡à¦¾à¦°à§‡à¦¶à¦¨",
            noForumThreads: "à¦•à§‹à¦¨à§‹ à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦¥à§à¦°à§‡à¦¡ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤",
            pinThread: "à¦ªà¦¿à¦¨", unpinThread: "à¦†à¦¨à¦ªà¦¿à¦¨",
            lockThread: "à¦²à¦•", unlockThread: "à¦†à¦¨à¦²à¦•",
            deleteThread: "à¦®à§à¦›à§à¦¨", deleteReply: "à¦‰à¦¤à§à¦¤à¦° à¦®à§à¦›à§à¦¨",
            forumAlertPinned: "à¦¥à§à¦°à§‡à¦¡ à¦ªà¦¿à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤", forumAlertUnpinned: "à¦¥à§à¦°à§‡à¦¡ à¦†à¦¨à¦ªà¦¿à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            forumAlertLocked: "à¦¥à§à¦°à§‡à¦¡ à¦²à¦• à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤", forumAlertUnlocked: "à¦¥à§à¦°à§‡à¦¡ à¦†à¦¨à¦²à¦• à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            forumAlertThreadDeleted: "à¦¥à§à¦°à§‡à¦¡ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤", forumAlertReplyDeleted: "à¦‰à¦¤à§à¦¤à¦° à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤",
            confirmDeleteThread: "à¦à¦‡ à¦¥à§à¦°à§‡à¦¡ à¦à¦¬à¦‚ à¦¸à¦¬ à¦‰à¦¤à§à¦¤à¦° à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¬à§‡à¦¨?",
            confirmDeleteReply: "à¦à¦‡ à¦‰à¦¤à§à¦¤à¦°à¦Ÿà¦¿ à¦®à§à¦›à§‡ à¦«à§‡à¦²à¦¬à§‡à¦¨?",
        }
    }
};

// â”€â”€ Language direction map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const LANG_DIR = { en: "ltr", bn: "ltr", ar: "rtl" };

// â”€â”€ Public API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
 *   t("portal", "navTitle")  â†’  "DIS Student Portal" (or Bengali equivalent)
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
    const labels = { en: "English", bn: "à¦¬à¦¾à¦‚à¦²à¦¾", ar: "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©" };
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

// â”€â”€ Legacy global bridge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// For backward compatibility with non-module inline <script> tags
// that rely on window.portalTranslations / window.portalT / window.getPortalLang

window.portalTranslations = TRANSLATIONS.portal;
window.getPortalLang = () => getLang();
window.portalT = (key) => t("portal", key);
