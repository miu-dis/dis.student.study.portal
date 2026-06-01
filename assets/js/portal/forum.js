// assets/js/portal/forum.js
// Discussion Forum module — integrated into Course Detail View as a "Discussion" tab
import { escapeHtml } from "../sanitize.js";

/**
 * Format a relative time string from a Firestore timestamp.
 * @param {Object|null} ts - Firestore Timestamp { seconds, nanoseconds }
 * @param {Function} t - translator
 * @returns {string}
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
 * Render the Discussion tab inside a course detail container.
 * Returns an object with { unsubscribe } for cleanup.
 *
 * @param {Object} course - { code, title, teacher }
 * @param {HTMLElement} containerEl - the target DOM element
 * @param {Function} t - translator
 * @param {Function} esc - HTML escape
 * @param {string} lang - current language code
 * @param {string|null} loggedInUserUID
 * @param {string} loggedInUserName
 * @param {Object} firestore - { db, collection, addDoc, onSnapshot, query, orderBy, where, serverTimestamp, deleteDoc, doc, updateDoc, getDocs, increment }
 * @param {Function} showToast - toast notification
 * @returns {{ unsubscribe: Function }}
 */
export function renderForumTab(
    course,
    containerEl,
    t,
    esc,
    lang,
    loggedInUserUID,
    loggedInUserName,
    firestore,
    showToast
) {
    const { db, collection, addDoc, onSnapshot, query, orderBy, where, serverTimestamp, deleteDoc, doc, updateDoc, getDocs, increment } = firestore;

    // ── Build the HTML skeleton ───────────────────────────────────────
    containerEl.innerHTML =
        `<div class="space-y-4">` +
        // New thread form
        (loggedInUserUID
            ? `<div class="bg-white rounded-xl shadow-md p-4 border border-indigo-100" id="forumNewThreadForm">` +
            `<h4 class="font-bold text-indigo-800 text-sm mb-3 flex items-center gap-2">` +
            `<i class="fa-solid fa-plus-circle"></i> ${t("forumNewThread")}` +
            `</h4>` +
            `<form id="forumThreadForm" class="space-y-2.5">` +
            `<div>` +
            `<input type="text" id="forumThreadTitle" required ` +
            `class="w-full p-2 border border-gray-300 rounded-lg text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" ` +
            `placeholder="${esc(t("forumThreadTitlePH"))}" maxlength="200">` +
            `<div class="text-[9px] text-red-500 hidden mt-0.5" id="forumThreadTitleErr"></div>` +
            `</div>` +
            `<div>` +
            `<textarea id="forumThreadContent" rows="3" required ` +
            `class="w-full p-2 border border-gray-300 rounded-lg text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none" ` +
            `placeholder="${esc(t("forumThreadContentPH"))}" maxlength="5000"></textarea>` +
            `<div class="text-[9px] text-red-500 hidden mt-0.5" id="forumThreadContentErr"></div>` +
            `</div>` +
            `<div class="flex justify-end">` +
            `<button type="submit" id="forumThreadSubmitBtn" ` +
            `class="portal-btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg">` +
            `${t("forumSubmitThread")}</button>` +
            `</div>` +
            `</form>` +
            `</div>`
            : `<div class="bg-white rounded-xl shadow-md p-4 border border-gray-100 text-center text-xs text-gray-400">` +
            `<i class="fa-solid fa-lock mr-1"></i> ${t("loginToUpload")}` +
            `</div>`) +
        // Thread list container
        `<div id="forumThreadList" class="space-y-3"></div>` +
        `</div>`;

    const threadListEl = document.getElementById("forumThreadList");
    const titleErrEl = document.getElementById("forumThreadTitleErr");
    const contentErrEl = document.getElementById("forumThreadContentErr");
    const threadForm = document.getElementById("forumThreadForm");

    // ── Error helpers ─────────────────────────────────────────────────
    function hideError(el) { if (el) { el.classList.add("hidden"); el.innerText = ""; } }
    function showError(el, msg) { if (el) { el.classList.remove("hidden"); el.innerText = msg; } }

    // Track active reply listeners for cleanup
    const replyUnsubscribers = {};

    // ── Render a single thread card ───────────────────────────────────
    function renderThreadCard(threadData) {
        const isPinned = threadData.isPinned || false;
        const isLocked = threadData.isLocked || false;
        const replyCount = threadData.replyCount || 0;
        const timeStr = formatRelativeTime(threadData.createdAt, t);
        const authorName = esc(threadData.authorName || "Unknown");
        const title = esc(threadData.title || "");
        const content = esc(threadData.content || "");
        const isOwner = loggedInUserUID && threadData.authorUID === loggedInUserUID;

        const badgeHtml = [];
        if (isPinned) badgeHtml.push(`<span class="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-thumbtack mr-0.5"></i>${t("forumPinned")}</span>`);
        if (isLocked) badgeHtml.push(`<span class="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold"><i class="fa-solid fa-lock mr-0.5"></i>${t("forumLocked")}</span>`);

        const deleteBtn = (isOwner)
            ? `<button type="button" data-delete-thread="${threadData.id}" class="text-[9px] text-red-500 hover:text-red-700 underline">${t("btnDelete")}</button>`
            : "";

        return (
            `<div class="bg-white rounded-xl shadow-md p-4 border ${isPinned ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100'} thread-card" data-thread-id="${threadData.id}">` +
            `<div class="flex items-start justify-between gap-2">` +
            `<div class="flex-1 min-w-0">` +
            `<div class="flex items-center gap-2 flex-wrap mb-1">` +
            badgeHtml.join("") +
            `</div>` +
            `<h4 class="font-bold text-gray-800 text-sm">${title}</h4>` +
            `<p class="text-xs text-gray-500 mt-1 line-clamp-3 whitespace-pre-wrap">${content}</p>` +
            `<div class="flex items-center gap-3 mt-2 text-[10px] text-gray-400">` +
            `<span><i class="fa-solid fa-user mr-1"></i>${t("forumBy")} ${authorName}</span>` +
            `<span><i class="fa-solid fa-clock mr-1"></i>${timeStr}</span>` +
            `<span class="font-medium text-indigo-600"><i class="fa-solid fa-comments mr-1"></i>${replyCount} ${t("forumReplies")}</span>` +
            deleteBtn +
            `</div>` +
            `</div>` +
            `</div>` +
            // Replies section
            `<div class="mt-2 pt-2 border-t border-gray-100" id="threadReplies_${threadData.id}">` +
            `<div class="text-[10px] text-gray-400 text-center py-1">${t("loadingCourses")}</div>` +
            `</div>` +
            // Reply form (only if logged in and not locked)
            (!loggedInUserUID
                ? `<div class="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400 italic">${t("loginToUpload")}</div>`
                : isLocked
                    ? `<div class="mt-2 pt-2 border-t border-gray-100 text-[10px] text-red-500 italic">${t("forumLockedNotice")}</div>`
                    : `<div class="mt-2 pt-2 border-t border-gray-100">` +
                    `<form class="replyForm flex gap-2" data-thread-id="${threadData.id}">` +
                    `<input type="text" class="replyInput flex-1 p-1.5 border border-gray-200 rounded-lg text-[10px] focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300" ` +
                    `placeholder="${esc(t("forumReplyPH"))}" maxlength="2000" required>` +
                    `<button type="submit" class="shrink-0 bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">${t("forumSubmitReply")}</button>` +
                    `</form>` +
                    `</div>`) +
            `</div>`
        );
    }

    // ── Render a single reply ─────────────────────────────────────────
    function renderReplyHTML(replyData) {
        const timeStr = formatRelativeTime(replyData.createdAt, t);
        const authorName = esc(replyData.authorName || "Unknown");
        const content = esc(replyData.content || "");
        const isOwner = loggedInUserUID && replyData.authorUID === loggedInUserUID;

        const deleteBtn = isOwner
            ? `<button type="button" data-delete-reply="${replyData.id}" data-thread-id="${replyData.threadId}" class="text-[9px] text-red-400 hover:text-red-600 shrink-0" title="${t("btnDelete")}" aria-label="${t("btnDelete")}">` +
            `<i class="fa-solid fa-trash-can"></i></button>`
            : "";

        return (
            `<div class="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">` +
            `<div class="flex-1 min-w-0">` +
            `<div class="flex items-center gap-2">` +
            `<span class="text-[10px] font-bold text-gray-700">${authorName}</span>` +
            `<span class="text-[9px] text-gray-400">${timeStr}</span>` +
            `</div>` +
            `<p class="text-[10px] text-gray-600 mt-0.5 whitespace-pre-wrap">${content}</p>` +
            `</div>` +
            deleteBtn +
            `</div>`
        );
    }

    // ── Load replies for a specific thread ────────────────────────────
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
                repliesEl.innerHTML = "";
                return;
            }
            const htmlParts = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                htmlParts.push(renderReplyHTML(data));
            });
            repliesEl.innerHTML = htmlParts.join("");
        });
    }

    // ── Real-time thread listener ─────────────────────────────────────
    const threadsQuery = query(
        collection(db, "forum_threads"),
        where("courseCode", "==", course.code),
        orderBy("isPinned", "desc"),
        orderBy("createdAt", "desc")
    );

    const unsubscribeThreads = onSnapshot(threadsQuery, (snapshot) => {
        // Clean up all reply listeners
        Object.keys(replyUnsubscribers).forEach((tid) => {
            if (replyUnsubscribers[tid]) replyUnsubscribers[tid]();
        });
        for (const k in replyUnsubscribers) delete replyUnsubscribers[k];

        if (snapshot.empty) {
            threadListEl.innerHTML =
                `<div class="text-center py-8 border border-dashed border-gray-300 rounded-xl bg-white">` +
                `<i class="fa-solid fa-comments text-3xl text-gray-300 mb-2 block"></i>` +
                `<p class="text-xs text-gray-400">${t("forumNoThreads")}</p>` +
                `</div>`;
            return;
        }
        const htmlParts = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            htmlParts.push(renderThreadCard(data));
        });
        threadListEl.innerHTML = htmlParts.join("");

        // Load replies for each thread
        snapshot.forEach((doc) => {
            loadReplies(doc.id);
        });
    });

    // ── Thread form submit handler ────────────────────────────────────
    if (threadForm) {
        threadForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            hideError(titleErrEl);
            hideError(contentErrEl);

            const title = document.getElementById("forumThreadTitle").value.trim();
            const content = document.getElementById("forumThreadContent").value.trim();

            if (!title) { showError(titleErrEl, t("valForumTitleRequired")); return; }
            if (!content) { showError(contentErrEl, t("valForumContentRequired")); return; }

            const submitBtn = document.getElementById("forumThreadSubmitBtn");
            submitBtn.disabled = true;
            submitBtn.innerText = "...";

            try {
                await addDoc(collection(db, "forum_threads"), {
                    courseCode: course.code,
                    courseTitle: course.title,
                    title: title,
                    content: content,
                    authorUID: loggedInUserUID,
                    authorName: loggedInUserName,
                    authorRole: "student",
                    createdAt: serverTimestamp(),
                    lastReplyAt: null,
                    replyCount: 0,
                    isPinned: false,
                    isLocked: false,
                });
                document.getElementById("forumThreadTitle").value = "";
                document.getElementById("forumThreadContent").value = "";
                showToast(t("forumAlertThreadPosted"), "success");
            } catch (err) {
                console.error("Forum thread create error:", err);
                showToast(t("alertThreadPostFailed"), "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = t("forumSubmitThread");
            }
        });
    }

    // ── Click delegation for reply forms, delete buttons ──────────────
    containerEl.addEventListener("submit", async (e) => {
        const form = e.target.closest(".replyForm");
        if (!form) return;
        e.preventDefault();

        const threadId = form.getAttribute("data-thread-id");
        const input = form.querySelector(".replyInput");
        const replyContent = input.value.trim();

        if (!replyContent) {
            showToast(t("valForumReplyRequired"), "error");
            return;
        }

        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "..."; }

        try {
            await addDoc(collection(db, "forum_replies"), {
                threadId: threadId,
                content: replyContent,
                authorUID: loggedInUserUID,
                authorName: loggedInUserName,
                authorRole: "student",
                createdAt: serverTimestamp(),
            });
            // Update thread replyCount + lastReplyAt
            const threadRef = doc(db, "forum_threads", threadId);
            await updateDoc(threadRef, {
                lastReplyAt: serverTimestamp(),
                replyCount: increment(1),
            });
            input.value = "";
            showToast(t("forumAlertReplyPosted"), "success");
        } catch (err) {
            console.error("Forum reply create error:", err);
            showToast(t("alertReplyPostFailed"), "error");
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = t("forumSubmitReply"); }
        }
    });

    containerEl.addEventListener("click", async (e) => {
        // Delete thread
        const deleteThreadBtn = e.target.closest("[data-delete-thread]");
        if (deleteThreadBtn) {
            const threadId = deleteThreadBtn.getAttribute("data-delete-thread");
            if (!confirm(t("forumConfirmDeleteThread"))) return;
            try {
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
                // Delete thread
                await deleteDoc(doc(db, "forum_threads", threadId));
                showToast(t("forumAlertThreadDeleted"), "success");
            } catch (err) {
                console.error("Forum thread delete error:", err);
                showToast(t("alertThreadDeleteFailed"), "error");
            }
            return;
        }

        // Delete reply
        const deleteReplyBtn = e.target.closest("[data-delete-reply]");
        if (deleteReplyBtn) {
            const replyId = deleteReplyBtn.getAttribute("data-delete-reply");
            const threadId = deleteReplyBtn.getAttribute("data-thread-id");
            if (!confirm(t("forumConfirmDeleteReply"))) return;
            try {
                await deleteDoc(doc(db, "forum_replies", replyId));
                // Update thread reply count
                const threadRef = doc(db, "forum_threads", threadId);
                await updateDoc(threadRef, { replyCount: increment(-1) });
                showToast(t("forumAlertReplyDeleted"), "success");
            } catch (err) {
                console.error("Forum reply delete error:", err);
                showToast(t("alertReplyDeleteFailed"), "error");
            }
            return;
        }
    });

    // ── Return cleanup function ───────────────────────────────────────
    return {
        unsubscribe: () => {
            unsubscribeThreads();
            Object.keys(replyUnsubscribers).forEach((tid) => {
                if (replyUnsubscribers[tid]) replyUnsubscribers[tid]();
            });
        }
    };
}