// ─── Daily Class Resources Module ───
// Provides openDailyResourcesView and closeDailyResourcesView for
// the #dailyResourcesView UI. Resources are filtered by routineDate
// and optionally by courseCode (when opened from a routine card badge).

import { escapeHtml } from "../sanitize.js";
import { getBangladeshToday } from "./routines.js";

// ─── Internal State ───
let _activeCourseCode = null;
let _activeCourseTitle = "";
let _activeCourseTeacher = "";
let _activeRoutineDate = "";
let _activeRoutineSlot = "";
let _activeRoutineId = "";
let _unsubResources = null;

// ─── Options (set during open) ───
let _opts = {};

/**
 * Format a YYYY-MM-DD date string for display.
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {{ displayDate: string, displayDay: string }}
 */
function formatDisplayDate(dateStr) {
    if (!dateStr) return { displayDate: "", displayDay: "" };
    const parts = dateStr.split("-");
    if (parts.length !== 3) return { displayDate: dateStr, displayDay: "" };
    const [y, m, d] = parts.map(Number);
    const date = new Date(y, m - 1, d);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[date.getDay()] || "";
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
        displayDate: `${d} ${monthNames[m - 1]} ${y}`,
        displayDay: dayName,
    };
}

/**
 * Shift a YYYY-MM-DD string by N days.
 * @param {string} dateStr
 * @param {number} days - positive or negative
 * @returns {string} YYYY-MM-DD
 */
function shiftDate(dateStr, days) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts.map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
}

/**
 * Render the date navigation bar.
 */
function _renderDateNav() {
    const display = formatDisplayDate(_activeRoutineDate);
    const dateDisplayEl = document.getElementById("dailyResourcesDateDisplay");
    const dayDisplayEl = document.getElementById("dailyResourcesDayDisplay");
    if (dateDisplayEl) dateDisplayEl.textContent = display.displayDate;
    if (dayDisplayEl) dayDisplayEl.textContent = display.displayDay;

    const jumpInput = document.getElementById("dailyResourcesJumpDate");
    if (jumpInput) jumpInput.value = _activeRoutineDate;
}

/**
 * Build the HTML for one class section (course header + resource list).
 * @param {Array} resources - resource docs for this course+date
 * @returns {string} HTML
 */
function _buildClassSectionHTML(resources) {
    const { t, esc, renderResourceItemHTML, canManageResource, loggedInUserUID, loggedInUserName } = _opts;

    const countLabel = `${resources.length} ${t("dailyResourcesCount")}`;

    let html = `<div class="bg-white rounded-xl shadow-md border-t-4 border-teal-600 overflow-hidden">`;
    // Class header
    html += `<div class="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100 flex flex-wrap items-center justify-between gap-2">`;
    html += `<div class="min-w-0">`;
    html += `<h3 class="text-sm font-extrabold text-emerald-800">${esc(_activeCourseCode)} — ${esc(_activeCourseTitle)}</h3>`;
    html += `<p class="text-xs text-gray-500 mt-0.5">`;
    html += `<span id="dailyResourcesSlotLbl">${t("dailyResourcesSlot")}</span>: ${esc(_activeRoutineSlot || "—")}`;
    html += ` • <span id="dailyResourcesClassDateLbl">${t("dailyResourcesClassDate")}</span>: ${esc(_activeRoutineDate)}`;
    html += ` • <span id="dailyResourcesCountLbl">${countLabel}</span>`;
    html += `</p>`;
    html += `</div>`;
    html += `<button type="button" id="dailyResourcesUploadBtn" class="portal-btn inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold">`;
    html += `<i class="fa-solid fa-plus-circle"></i> <span id="dailyResourcesBtnUploadLbl">${t("dailyResourcesBtnUpload")}</span>`;
    html += `</button>`;
    html += `</div>`;

    // Resource list
    html += `<div class="p-3 space-y-2">`;
    if (resources.length === 0) {
        html += `<p class="text-xs text-gray-400 text-center py-4"><span id="dailyResourcesNoResLbl">${t("dailyResourcesNoResources")}</span></p>`;
    } else {
        resources.forEach((rData) => {
            // Add uploadedAt display if available
            let uploadDateHTML = "";
            if (rData.uploadedAt) {
                const upDisplay = formatDisplayDate(rData.uploadedAt);
                uploadDateHTML = `<span class="text-[9px] text-gray-400 ml-2">${t("dailyResourcesUploaded")}: ${esc(upDisplay.displayDate || rData.uploadedAt)}</span>`;
            }
            const itemHTML = renderResourceItemHTML(rData, t, esc, {
                loggedInUserUID,
                loggedInUserName,
            });
            // Inject uploadedAt info after the author line
            html += itemHTML.replace(
                `(${t("byAuthor")} ${esc(rData.author)})</span>`,
                `(${t("byAuthor")} ${esc(rData.author)})${uploadDateHTML}</span>`
            );
        });
    }
    html += `</div>`;
    html += `</div>`;
    return html;
}

/**
 * Query and render daily resources for the current date + course.
 */
async function _loadAndRenderResources() {
    const { firestore, t } = _opts;
    const { db, collection, query, where, orderBy, onSnapshot, getDocs } = firestore;

    const loadingEl = document.getElementById("dailyResourcesLoading");
    const emptyEl = document.getElementById("dailyResourcesEmpty");
    const errorEl = document.getElementById("dailyResourcesError");
    const classListEl = document.getElementById("dailyResourcesClassList");

    // Unsubscribe previous listener
    if (_unsubResources) {
        _unsubResources();
        _unsubResources = null;
    }

    // Show loading
    if (loadingEl) loadingEl.classList.remove("hidden");
    if (emptyEl) emptyEl.classList.add("hidden");
    if (errorEl) errorEl.classList.add("hidden");
    if (classListEl) classListEl.innerHTML = "";

    try {
        // Build query: filter by routineDate + courseCode (if set)
        const constraints = [];
        constraints.push(where("routineDate", "==", _activeRoutineDate));
        if (_activeCourseCode) {
            constraints.push(where("courseCode", "==", _activeCourseCode));
        }
        constraints.push(orderBy("createdAt", "desc"));

        const q = query(collection(db, "resources"), ...constraints);

        _unsubResources = onSnapshot(q, (snapshot) => {
            if (loadingEl) loadingEl.classList.add("hidden");

            const resources = [];
            snapshot.forEach((docSnap) => {
                resources.push({ id: docSnap.id, ...docSnap.data() });
            });

            if (resources.length === 0) {
                if (emptyEl) emptyEl.classList.remove("hidden");
                if (classListEl) classListEl.innerHTML = "";
            } else {
                if (emptyEl) emptyEl.classList.add("hidden");
                if (classListEl) {
                    classListEl.innerHTML = _buildClassSectionHTML(resources);
                    _bindClassSectionEvents();
                }
            }
        }, (err) => {
            console.error("Daily resources onSnapshot error:", err);
            if (loadingEl) loadingEl.classList.add("hidden");
            if (errorEl) errorEl.classList.remove("hidden");
        });
    } catch (err) {
        console.error("Daily resources query error:", err);
        if (loadingEl) loadingEl.classList.add("hidden");
        if (errorEl) errorEl.classList.remove("hidden");
    }
}

/**
 * Bind upload and resource action events within the class section.
 */
function _bindClassSectionEvents() {
    const { firestore, loggedInUserUID, loggedInUserName, canManageResource, t, esc } = _opts;
    const { db, doc, getDoc, deleteDoc } = firestore;

    // Upload button
    const uploadBtn = document.getElementById("dailyResourcesUploadBtn");
    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => {
            // Set daily upload context before opening share modal
            window._dailyUploadContext = {
                routineDate: _activeRoutineDate,
                routineSlot: _activeRoutineSlot,
                routineId: _activeRoutineId,
                courseCode: _activeCourseCode,
                courseTitle: _activeCourseTitle,
                courseTeacher: _activeCourseTeacher,
            };
            if (typeof window.openShareModal === "function") {
                window.openShareModal();
            }
        });
    }

    // Resource click delegation (edit/delete/view) on the class list
    // NOTE: Only bound once (guarded by dataset.bound) to prevent duplicate
    // listeners accumulating from repeated _bindClassSectionEvents calls.
    const classListEl = document.getElementById("dailyResourcesClassList");
    if (classListEl && !classListEl.dataset.bound) {
        classListEl.dataset.bound = "1";
        classListEl.addEventListener("click", async (e) => {
            const viewBtn = e.target.closest("[data-view-resource]");
            const editBtn = e.target.closest("[data-edit-resource]");
            const deleteBtn = e.target.closest("[data-delete-resource]");

            if (viewBtn) {
                const resourceId = viewBtn.getAttribute("data-view-resource");
                if (typeof _opts.openResourceFile === "function") {
                    try {
                        const rSnap = await getDoc(doc(db, "resources", resourceId));
                        if (rSnap.exists()) {
                            await _opts.openResourceFile({ id: rSnap.id, ...rSnap.data() });
                        }
                    } catch (err) {
                        console.error("View resource error:", err);
                        if (typeof _opts.showToast === "function") {
                            _opts.showToast(t("alertErrView"), "error");
                        }
                    }
                }
                return;
            }

            if (editBtn) {
                const resourceId = editBtn.getAttribute("data-edit-resource");
                if (typeof _opts.openEditResourceModal === "function") {
                    try {
                        await _opts.openEditResourceModal(
                            resourceId,
                            { getDoc, doc, db },
                            [{ code: _activeCourseCode, title: _activeCourseTitle, teacher: _activeCourseTeacher }],
                            loggedInUserName,
                            loggedInUserUID,
                            "", // studentCurrentTrimesterKey not needed for daily
                            (rData) => canManageResource(rData, loggedInUserUID, loggedInUserName),
                            t,
                            typeof window.switchUploadMethod === "function" ? window.switchUploadMethod : null
                        );
                    } catch (err) {
                        console.error("Edit resource error:", err);
                    }
                }
                return;
            }

            if (deleteBtn) {
                const resourceId = deleteBtn.getAttribute("data-delete-resource");
                if (typeof _opts.deleteResourceById === "function") {
                    try {
                        await _opts.deleteResourceById(
                            resourceId,
                            { getDoc, doc, db, deleteDoc },
                            (rData) => canManageResource(rData, loggedInUserUID, loggedInUserName),
                            loggedInUserUID,
                            loggedInUserName,
                            t
                        );
                        // onSnapshot will auto-refresh
                    } catch (err) {
                        console.error("Delete resource error:", err);
                    }
                }
                return;
            }
        });
    }
}

/**
 * Navigate to a different date.
     * @param {string} newDate - YYYY-MM-DD
     */
function _navigateToDate(newDate) {
    if (!newDate || newDate === _activeRoutineDate) return;
    _activeRoutineDate = newDate;
    _renderDateNav();
    _loadAndRenderResources();
}

/**
 * Open the Daily Class Resources view.
 *
 * @param {string} routineDate - YYYY-MM-DD date of the class
 * @param {Object} routineData - routine entry data { courseCode, subject, teacherCode, timeSlot, routineDate, id, ... }
 * @param {Object} opts - dependencies
 * @param {Object} opts.firestore - { db, collection, query, where, orderBy, onSnapshot, getDocs, doc, getDoc }
 * @param {string} opts.loggedInUserUID
 * @param {string} opts.loggedInUserName
 * @param {Function} opts.t - translator function
 * @param {Function} opts.esc - HTML escape function
 * @param {Function} opts.renderResourceItemHTML - from courses.js
 * @param {Function} opts.canManageResource - from courses.js
 * @param {Function} opts.openEditResourceModal - from upload.js
 * @param {Function} opts.deleteResourceById - from upload.js
 * @param {Function} opts.openResourceFile - from fileStorage.js
 * @param {Function} opts.showToast - from toast.js
 */
export async function openDailyResourcesView(routineDate, routineData, opts) {
    // Store options
    _opts = opts;

    // Set active context
    _activeRoutineDate = routineDate || "";
    _activeCourseCode = routineData?.courseCode || "";
    _activeCourseTitle = routineData?.subject || routineData?.courseTitle || "";
    _activeCourseTeacher = routineData?.teacherCode || routineData?.courseTeacher || "";
    _activeRoutineSlot = routineData?.timeSlot || "";
    _activeRoutineId = routineData?.id || routineData?.routineId || "";

    // Update date navigator
    _renderDateNav();

    // Show the view, hide home
    const homeContent = document.getElementById("homeMainContent");
    const courseDetail = document.getElementById("courseDetailView");
    const dailyView = document.getElementById("dailyResourcesView");

    if (homeContent) homeContent.classList.add("hidden");
    if (courseDetail) courseDetail.classList.add("hidden");
    if (dailyView) dailyView.classList.remove("hidden");

    // Update hash
    window.location.hash = `daily=${encodeURIComponent(_activeRoutineDate)}&code=${encodeURIComponent(_activeCourseCode)}`;

    // Load resources
    await _loadAndRenderResources();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Close the Daily Class Resources view and return to home.
 */
export function closeDailyResourcesView() {
    // Unsubscribe Firestore listener
    if (_unsubResources) {
        _unsubResources();
        _unsubResources = null;
    }

    // Clear daily upload context
    window._dailyUploadContext = null;

    // Hide daily view, show home
    const dailyView = document.getElementById("dailyResourcesView");
    const homeContent = document.getElementById("homeMainContent");

    if (dailyView) dailyView.classList.add("hidden");
    if (homeContent) homeContent.classList.remove("hidden");

    // Clear hash if it's a daily hash
    if (window.location.hash && window.location.hash.startsWith("#daily=")) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    // Reset state
    _activeCourseCode = null;
    _activeCourseTitle = "";
    _activeCourseTeacher = "";
    _activeRoutineDate = "";
    _activeRoutineSlot = "";
    _activeRoutineId = "";
}

/**
 * Initialize date navigation event listeners.
 * Called once after DOM is ready.
 */
export function initDailyResourcesNav() {
    // Back button
    const backBtn = document.getElementById("dailyResourcesBack");
    if (backBtn && !backBtn.dataset.bound) {
        backBtn.dataset.bound = "1";
        backBtn.addEventListener("click", closeDailyResourcesView);
    }

    // Previous day
    const prevBtn = document.getElementById("dailyResourcesPrevDay");
    if (prevBtn && !prevBtn.dataset.bound) {
        prevBtn.dataset.bound = "1";
        prevBtn.addEventListener("click", () => {
            _navigateToDate(shiftDate(_activeRoutineDate, -1));
        });
    }

    // Next day
    const nextBtn = document.getElementById("dailyResourcesNextDay");
    if (nextBtn && !nextBtn.dataset.bound) {
        nextBtn.dataset.bound = "1";
        nextBtn.addEventListener("click", () => {
            _navigateToDate(shiftDate(_activeRoutineDate, 1));
        });
    }

    // Jump to date
    const jumpBtn = document.getElementById("dailyResourcesJumpBtn");
    if (jumpBtn && !jumpBtn.dataset.bound) {
        jumpBtn.dataset.bound = "1";
        jumpBtn.addEventListener("click", () => {
            const input = document.getElementById("dailyResourcesJumpDate");
            if (input && input.value) {
                _navigateToDate(input.value);
            }
        });
    }

    // Also allow Enter key on the date input
    const jumpInput = document.getElementById("dailyResourcesJumpDate");
    if (jumpInput && !jumpInput.dataset.bound) {
        jumpInput.dataset.bound = "1";
        jumpInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && jumpInput.value) {
                _navigateToDate(jumpInput.value);
            }
        });
    }
}