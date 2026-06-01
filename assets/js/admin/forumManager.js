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
 * Render the admin forum moderation panel.
 * @param {HTMLElement} containerEl - target DOM element
 * @param {Object} firestore - { db, collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, getDocs }
 * @param {Function} t - translator
 * @param {Function} showToast - toast notification
 * @returns {Function} unsubscribe
 */
export function renderAdminForumPanel(containerEl, firestore, t, showToast, countEl = null) {
    const { db, collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, getDocs } = firestore;
    const esc = escapeHtml;

    containerEl.innerHTML =
        `<div id="adminForumThreadList" class="space-y-3">` +
        `<div class="text-xs text-gray-400 text-center py-4">Loading...</div>` +
        `</div>`;

    const listEl = document.getElementById("adminForumThreadList");

    // ── Render a single thread card (admin view) ──────────────────────
    function renderThreadCard(threadData) {
        const isPinned = threadData.isPinned || false;
        const isLocked = threadData.isLocked || false;
        const replyCount = threadData.replyCount || 0;
        const timeStr = formatRelativeTime(threadData.createdAt, t);
        const authorName = esc(threadData.authorName || "Unknown");
        const title = esc(threadData.title || "");
        const courseCode = esc(threadData.courseCode || "");

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
            (isPinned ? `<span class="text-[9px] text-amber-600 font-bold"><i class="fa-solid fa-thumbtack"></i></span>` : "") +
            (isLocked ? `<span class="text-[9px] text-red-500 font-bold"><i class="fa-solid fa-lock"></i></span>` : "") +
            `</div>` +
            `<h4 class="font-bold text-gray-800 text-xs">${title}</h4>` +
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
            `</div>`
        );
    }

    // ── Real-time listener ────────────────────────────────────────────
    const threadsQuery = query(
        collection(db, "forum_threads"),
        orderBy("isPinned", "desc"),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(threadsQuery, (snapshot) => {
        if (countEl) {
            countEl.innerText = snapshot.size + " thread" + (snapshot.size !== 1 ? "s" : "");
        }
        if (snapshot.empty) {
            listEl.innerHTML =
                `<div class="text-center py-6 border border-dashed border-gray-300 rounded-xl bg-white">` +
                `<i class="fa-solid fa-comments text-2xl text-gray-300 mb-1 block"></i>` +
                `<p class="text-xs text-gray-400">${t("noForumThreads")}</p>` +
                `</div>`;
            return;
        }
        const htmlParts = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            htmlParts.push(renderThreadCard(data));
        });
        listEl.innerHTML = htmlParts.join("");
    });

    // ── Click delegation for admin actions ────────────────────────────
    containerEl.addEventListener("click", async (e) => {
        const threadId = (e.target.closest("[data-pin],[data-unpin],[data-lock],[data-unlock],[data-delete-thread]") || {}).dataset?.pin ||
            (e.target.closest("[data-unpin]") || {}).dataset?.unpin ||
            (e.target.closest("[data-lock]") || {}).dataset?.lock ||
            (e.target.closest("[data-unlock]") || {}).dataset?.unlock ||
            (e.target.closest("[data-delete-thread]") || {}).dataset?.deleteThread;

        if (!threadId) return;

        const pinBtn = e.target.closest("[data-pin]");
        const unpinBtn = e.target.closest("[data-unpin]");
        const lockBtn = e.target.closest("[data-lock]");
        const unlockBtn = e.target.closest("[data-unlock]");
        const deleteBtn = e.target.closest("[data-delete-thread]");

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
            } else if (deleteBtn) {
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
                await deleteDoc(doc(db, "forum_threads", threadId));
                showToast(t("forumAlertThreadDeleted"), "success");
            }
        } catch (err) {
            console.error("Forum admin action error:", err);
            showToast(t("alertActionFailed"), "error");
        }
    });

    return unsubscribe;
}