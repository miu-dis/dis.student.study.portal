// assets/js/admin/forumManager.js
// Discussion Forum Moderation Module (admin)
import { escapeHtml } from "../sanitize.js";

/**
 * Build a relative time string from a Firestore timestamp.
 */
function formatRelativeTime(ts, t) {
    if (!ts || !ts.seconds) return "";
    const now = Date.now();
    const then = ts.seconds * 1000;
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return t("forumJustNow");
    if (diffMin < 60) return diffMin + " " + t("forumMinutesAgo");
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return diffHr + " " + t("forumHoursAgo");
    const diffDay = Math.floor(diffHr / 24);
    return diffDay + " " + t("forumDaysAgo");
}

/**
 * Render the admin forum moderation panel with course/date filtering and reply display.
 * @param {HTMLElement} containerEl - target DOM element
 * @param {Object} firestore - { db, collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, getDocs }
 * @param {Function} t - translator
 * @param {Function} showToast - toast notification
 * @param {HTMLElement|null} countEl - optional element to show thread count
 * @returns {Function} cleanup function
 */
export function renderAdminForumPanel(containerEl, firestore, t, showToast, countEl = null) {
    const { db, collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, getDocs } = firestore;
    const esc = escapeHtml;

    // ── Build the HTML skeleton ───────────────────────────────────────
    containerEl.innerHTML =
        `<div class="flex items-center gap-2 flex-wrap bg-white rounded-xl shadow-sm p-2.5 border border-gray-100 mb-3">
            <label class="text-[11px] font-semibold text-gray-600">${t("forumFilterCourse")}:</label>
            <select id="adminForumCourseFilter" class="text-[11px] p-1.5 border border-gray-300 rounded bg-white font-medium text-indigo-700">
                <option value="all">${t("forumAllCourses")}</option>
            </select>
            <label class="text-[11px] font-semibold text-gray-600 ml-2">${t("forumFilterDate")}:</label>
            <select id="adminForumDateFilter" class="text-[11px] p-1.5 border border-gray-300 rounded bg-white font-medium text-indigo-700">
                <option value="all">${t("forumAllDates")}</option>
            </select>
        </div>
        <div id="adminForumThreadList" class="space-y-3">
            <div class="text-xs text-gray-400 text-center py-4">${t("loadingCourses")}</div>
        </div>`;

    const listEl = document.getElementById("adminForumThreadList");
    const courseFilterEl = document.getElementById("adminForumCourseFilter");
    const dateFilterEl = document.getElementById("adminForumDateFilter");

    // Track active reply listeners for cleanup
    const replyUnsubscribers = {};

    // ── Render a single thread card (admin view) ──────────────────────
    function renderThreadCard(threadData) {
        const isPinned = threadData.isPinned || false;
        const isLocked = threadData.isLocked || false;
        const replyCount = threadData.replyCount || 0;
        const timeStr = formatRelativeTime(threadData.createdAt, t);
        const authorName = esc(threadData.authorName || "Unknown");
        const title = esc(threadData.title || "");
        const content = esc(threadData.content || "");
        const courseCode = esc(threadData.courseCode || "");
        const courseTitle = esc(threadData.courseTitle || "");
        const threadDate = threadData.routineDate || "";

        const badgeHtml = [];
        if (isPinned) badgeHtml.push(`<span class="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-thumbtack mr-0.5"></i>${t("forumPinned")}</span>`);
        if (isLocked) badgeHtml.push(`<span class="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-lock mr-0.5"></i>${t("forumLocked")}</span>`);
        if (threadDate) badgeHtml.push(`<span class="text-[9px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-medium"><i class="fa-regular fa-calendar mr-0.5"></i>${esc(threadDate)}</span>`);

        const pinBtn = isPinned
            ? `<button type="button" data-unpin="${threadData.id}" class="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded hover:bg-amber-200 font-bold" title="${t("unpinThread")}"><i class="fa-solid fa-thumbtack"></i> ${t("unpinThread")}</button>`
            : `<button type="button" data-pin="${threadData.id}" class="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded hover:bg-amber-100 font-bold" title="${t("pinThread")}"><i class="fa-solid fa-thumbtack"></i> ${t("pinThread")}</button>`;

        const lockBtn = isLocked
            ? `<button type="button" data-unlock="${threadData.id}" class="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded hover:bg-red-200 font-bold" title="${t("unlockThread")}"><i class="fa-solid fa-lock-open"></i> ${t("unlockThread")}</button>`
            : `<button type="button" data-lock="${threadData.id}" class="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded hover:bg-red-100 font-bold" title="${t("lockThread")}"><i class="fa-solid fa-lock"></i> ${t("lockThread")}</button>`;

        const deleteBtn = `<button type="button" data-delete-thread="${threadData.id}" class="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded hover:bg-red-600 hover:text-white font-bold" title="${t("deleteThread")}"><i class="fa-solid fa-trash-can"></i> ${t("deleteThread")}</button>`;

        return (
            `<div class="bg-white rounded-lg border border-gray-200 p-3 ${isPinned ? 'border-amber-300 bg-amber-50/30' : ''}">` +
            `<div class="flex items-start justify-between gap-2">` +
            `<div class="flex-1 min-w-0">` +
            `<div class="flex items-center gap-1 flex-wrap mb-1">` +
            `<span class="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">${courseCode}</span>` +
            `<span class="text-[9px] text-gray-500">${courseTitle}</span>` +
            badgeHtml.join("") +
            `</div>` +
            `<h4 class="font-bold text-gray-800 text-xs">${title}</h4>` +
            `<p class="text-[11px] text-gray-500 mt-0.5 line-clamp-2 whitespace-pre-wrap">${content}</p>` +
            `<div class="flex items-center gap-3 mt-1 text-[9px] text-gray-400">` +
            `<span>${t("forumBy")} ${authorName}</span>` +
            `<span>${timeStr}</span>` +
            `<span class="text-indigo-600 font-medium">${replyCount} ${t("forumReplies")}</span>` +
            `</div>` +
            `</div>` +
            `</div>` +
            `<div class="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">` +
            pinBtn + lockBtn + deleteBtn +
            `</div>` +
            // Replies section
            `<div class="mt-2 pt-2 border-t border-gray-100" id="threadReplies_${threadData.id}">` +
            `<div class="text-[10px] text-gray-400 text-center py-1">${t("loadingCourses")}</div>` +
            `</div>` +
            `</div>`
        );
    }

    // ── Render a single reply ─────────────────────────────────────────
    function renderReplyHTML(replyData) {
        const timeStr = formatRelativeTime(replyData.createdAt, t);
        const authorName = esc(replyData.authorName || "Unknown");
        const content = esc(replyData.content || "");
        const authorRole = esc(replyData.authorRole || "");

        const roleBadge = authorRole === "admin"
            ? `<span class="text-[8px] bg-purple-100 text-purple-700 px-1 py-0.5 rounded font-bold ml-1">ADMIN</span>`
            : "";

        const deleteReplyBtn = `<button type="button" data-delete-reply="${replyData.id}" data-thread-id="${replyData.threadId}" class="text-[9px] text-red-400 hover:text-red-600 shrink-0" title="${t("deleteReply")}" aria-label="${t("deleteReply")}"><i class="fa-solid fa-trash-can"></i></button>`;

        return (
            `<div class="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">` +
            `<div class="flex-1 min-w-0">` +
            `<div class="flex items-center gap-2">` +
            `<span class="text-[10px] font-bold text-gray-700">${authorName}</span>` +
            roleBadge +
            `<span class="text-[9px] text-gray-400">${timeStr}</span>` +
            `</div>` +
            `<p class="text-[10px] text-gray-600 mt-0.5 whitespace-pre-wrap">${content}</p>` +
            `</div>` +
            deleteReplyBtn +
            `</div>`
        );
    }

    // ── Load replies for a specific thread (real-time) ────────────────
    function loadReplies(threadId) {
        // Unsubscribe previous listener if exists
        if (replyUnsubscribers[threadId]) {
            replyUnsubscribers[threadId]();
            delete replyUnsubscribers[threadId];
        }

        const repliesEl = document.getElementById("threadReplies_" + threadId);
        if (!repliesEl) return;

        const repliesQuery = query(
            collection(db, "forum_replies"),
            where("threadId", "==", threadId),
            orderBy("createdAt", "asc")
        );

        replyUnsubscribers[threadId] = onSnapshot(repliesQuery, (snapshot) => {
            if (snapshot.empty) {
                repliesEl.innerHTML = `<div class="text-[10px] text-gray-400 text-center py-1">${t("forumNoReplies")}</div>`;
                return;
            }
            const htmlParts = [];
            snapshot.forEach((rdoc) => {
                const data = rdoc.data();
                data.id = rdoc.id;
                htmlParts.push(renderReplyHTML(data));
            });
            repliesEl.innerHTML = htmlParts.join("");
        });
    }

    // ── Real-time thread listener ─────────────────────────────────────
    // NOTE: Single orderBy("createdAt") avoids requiring a composite
    // index on isPinned+createdAt. Pinned threads are sorted client-side
    // in refreshThreadList() so they still appear first.
    const threadsQuery = query(
        collection(db, "forum_threads"),
        orderBy("createdAt", "desc")
    );

    // Cache for client-side re-filtering without re-fetching
    let cachedAllThreads = [];

    const unsubscribeThreads = onSnapshot(threadsQuery, (snapshot) => {
        // Clean up all reply listeners on data change
        Object.keys(replyUnsubscribers).forEach((tid) => {
            if (replyUnsubscribers[tid]) replyUnsubscribers[tid]();
        });
        for (const k in replyUnsubscribers) delete replyUnsubscribers[k];

        if (snapshot.empty) {
            cachedAllThreads = [];
            if (countEl) countEl.innerText = "0 threads";
            listEl.innerHTML =
                `<div class="text-center py-6 border border-dashed border-gray-300 rounded-xl bg-white">` +
                `<i class="fa-solid fa-comments text-2xl text-gray-300 mb-1 block"></i>` +
                `<p class="text-xs text-gray-400">${t("noForumThreads")}</p>` +
                `</div>`;
            // Reset filter dropdowns
            courseFilterEl.innerHTML = `<option value="all">${t("forumAllCourses")}</option>`;
            dateFilterEl.innerHTML = `<option value="all">${t("forumAllDates")}</option>`;
            return;
        }

        const allThreads = [];
        const courseSet = new Set();
        const dateSet = new Set();

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            data.id = docSnap.id;
            allThreads.push(data);
            if (data.courseCode) courseSet.add(data.courseCode);
            if (data.routineDate) dateSet.add(data.routineDate);
        });

        cachedAllThreads = allThreads;

        // Update course filter dropdown
        const sortedCourses = [...courseSet].sort();
        const savedCourse = courseFilterEl.value || "all";
        courseFilterEl.innerHTML =
            `<option value="all">${t("forumAllCourses")}</option>` +
            sortedCourses.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
        if ([...courseFilterEl.options].some(o => o.value === savedCourse)) {
            courseFilterEl.value = savedCourse;
        }

        // Update date filter dropdown
        const sortedDates = [...dateSet].sort();
        const savedDate = dateFilterEl.value || "all";
        dateFilterEl.innerHTML =
            `<option value="all">${t("forumAllDates")}</option>` +
            sortedDates.map((d) => `<option value="${esc(d)}">📅 ${esc(d)}</option>`).join("");
        if ([...dateFilterEl.options].some(o => o.value === savedDate)) {
            dateFilterEl.value = savedDate;
        }

        // Render with current filters
        refreshThreadList();
    });

    // ── Client-side filter + re-render ────────────────────────────────
    function refreshThreadList() {
        const courseFilter = courseFilterEl.value || "all";
        const dateFilter = dateFilterEl.value || "all";

        if (!cachedAllThreads.length) {
            if (countEl) countEl.innerText = "0 threads";
            listEl.innerHTML =
                `<div class="text-center py-6 border border-dashed border-gray-300 rounded-xl bg-white">` +
                `<i class="fa-solid fa-comments text-2xl text-gray-300 mb-1 block"></i>` +
                `<p class="text-xs text-gray-400">${t("noForumThreads")}</p>` +
                `</div>`;
            return;
        }

        // Clean up all reply listeners before re-rendering
        Object.keys(replyUnsubscribers).forEach((tid) => {
            if (replyUnsubscribers[tid]) replyUnsubscribers[tid]();
        });
        for (const k in replyUnsubscribers) delete replyUnsubscribers[k];

        // Filter by course and date
        let filteredThreads = cachedAllThreads;
        if (courseFilter !== "all") {
            filteredThreads = filteredThreads.filter((td) => td.courseCode === courseFilter);
        }
        if (dateFilter !== "all") {
            filteredThreads = filteredThreads.filter((td) => td.routineDate === dateFilter);
        }

        // Sort: pinned first, then by createdAt desc (client-side,
        // no composite index required)
        filteredThreads = [...filteredThreads].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            // Both pinned or both unpinned — newer first
            const aTime = (a.createdAt && a.createdAt.seconds) ? a.createdAt.seconds : 0;
            const bTime = (b.createdAt && b.createdAt.seconds) ? b.createdAt.seconds : 0;
            return bTime - aTime;
        });

        // Update count
        if (countEl) {
            countEl.innerText = filteredThreads.length + " thread" + (filteredThreads.length !== 1 ? "s" : "");
        }

        if (!filteredThreads.length) {
            listEl.innerHTML =
                `<div class="text-center py-6 border border-dashed border-gray-300 rounded-xl bg-white">` +
                `<i class="fa-solid fa-filter text-2xl text-gray-300 mb-1 block"></i>` +
                `<p class="text-xs text-gray-400">${t("noForumThreads")}</p>` +
                `</div>`;
            return;
        }

        const htmlParts = [];
        filteredThreads.forEach((data) => {
            htmlParts.push(renderThreadCard(data));
        });
        listEl.innerHTML = htmlParts.join("");

        // Load replies for each visible thread
        filteredThreads.forEach((data) => {
            loadReplies(data.id);
        });
    }

    // ── Filter change handlers ────────────────────────────────────────
    courseFilterEl.addEventListener("change", () => refreshThreadList());
    dateFilterEl.addEventListener("change", () => refreshThreadList());

    // ── Click delegation for admin actions ────────────────────────────
    containerEl.addEventListener("click", async (e) => {
        // Pin / Unpin / Lock / Unlock / Delete thread
        const pinBtn = e.target.closest("[data-pin]");
        const unpinBtn = e.target.closest("[data-unpin]");
        const lockBtn = e.target.closest("[data-lock]");
        const unlockBtn = e.target.closest("[data-unlock]");
        const deleteThreadBtn = e.target.closest("[data-delete-thread]");

        if (pinBtn || unpinBtn || lockBtn || unlockBtn || deleteThreadBtn) {
            const threadId = (pinBtn && pinBtn.dataset.pin) ||
                (unpinBtn && unpinBtn.dataset.unpin) ||
                (lockBtn && lockBtn.dataset.lock) ||
                (unlockBtn && unlockBtn.dataset.unlock) ||
                (deleteThreadBtn && deleteThreadBtn.dataset.deleteThread);

            try {
                if (pinBtn) {
                    await updateDoc(doc(db, "forum_threads", threadId), { isPinned: true });
                    showToast(t("forumAlertPinned"), "success");
                } else if (unpinBtn) {
                    await updateDoc(doc(db, "forum_threads", threadId), { isPinned: false });
                    showToast(t("forumAlertUnpinned"), "success");
                } else if (lockBtn) {
                    await updateDoc(doc(db, "forum_threads", threadId), { isLocked: true });
                    showToast(t("forumAlertLocked"), "success");
                } else if (unlockBtn) {
                    await updateDoc(doc(db, "forum_threads", threadId), { isLocked: false });
                    showToast(t("forumAlertUnlocked"), "success");
                } else if (deleteThreadBtn) {
                    if (!confirm(t("confirmDeleteThread"))) return;
                    // Delete all replies first
                    const repliesSnap = await getDocs(query(
                        collection(db, "forum_replies"),
                        where("threadId", "==", threadId)
                    ));
                    const deletions = [];
                    repliesSnap.forEach((rdoc) => {
                        deletions.push(deleteDoc(doc(db, "forum_replies", rdoc.id)));
                    });
                    await Promise.all(deletions);
                    // Delete the thread
                    await deleteDoc(doc(db, "forum_threads", threadId));
                    showToast(t("forumAlertThreadDeleted"), "success");
                }
            } catch (err) {
                console.error("Forum admin action error:", err);
                showToast(t("alertActionFailed"), "error");
            }
            return;
        }

        // Delete individual reply
        const deleteReplyBtn = e.target.closest("[data-delete-reply]");
        if (deleteReplyBtn) {
            const replyId = deleteReplyBtn.dataset.deleteReply;
            const threadId = deleteReplyBtn.dataset.threadId;
            if (!confirm(t("confirmDeleteReply"))) return;
            try {
                await deleteDoc(doc(db, "forum_replies", replyId));
                // Update thread reply count by counting remaining replies
                const remainingSnap = await getDocs(query(
                    collection(db, "forum_replies"),
                    where("threadId", "==", threadId)
                ));
                await updateDoc(doc(db, "forum_threads", threadId), {
                    replyCount: remainingSnap.size
                });
                showToast(t("forumAlertReplyDeleted"), "success");
            } catch (err) {
                console.error("Forum reply delete error:", err);
                showToast(t("alertActionFailed"), "error");
            }
            return;
        }
    });

    // ── Return cleanup function ───────────────────────────────────────
    return () => {
        unsubscribeThreads();
        Object.keys(replyUnsubscribers).forEach((tid) => {
            if (replyUnsubscribers[tid]) replyUnsubscribers[tid]();
        });
    };
}