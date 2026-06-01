// assets/js/portal/courses.js
// Course grid, detail view, filter management, and resource upload for student portal
import { buildCourseIdentityKey, resourceMatchesCourse, categorizeResource, RESOURCE_CATEGORY_ORDER, RESOURCE_CATEGORY_LABELS } from "../courseUtils.js";

/**
 * Check whether a resource has a viewable file/URL.
 * @param {Object} rData - resource document data
 * @returns {boolean}
 */
function hasViewableResource(rData) {
    if (rData.urlType === "external") {
        const u = (rData.url || "").trim();
        return u.startsWith("http") || u.startsWith("data:");
    }
    if (rData.storagePath) return true;
    const u = (rData.url || "").trim();
    return u.startsWith("http") || u.startsWith("data:");
}

/**
 * Normalize a person's name for case-insensitive comparison.
 * @param {string} name
 * @returns {string}
 */
function normalizePersonName(name) {
    return String(name || "").trim().toLowerCase();
}

/**
 * Check if the currently logged-in user can manage (edit/delete) a resource.
 * @param {Object} rData - resource doc data (must include id)
 * @param {string|null} loggedInUserUID
 * @param {string} loggedInUserName
 * @returns {boolean}
 */
export function canManageResource(rData, loggedInUserUID, loggedInUserName) {
    if (!loggedInUserUID) return false;
    if (rData.uploadedBy && rData.uploadedBy === loggedInUserUID) return true;
    // Legacy: no uploadedBy field — match by author name
    if (
        !rData.uploadedBy &&
        loggedInUserName &&
        normalizePersonName(rData.author) === normalizePersonName(loggedInUserName)
    ) {
        return true;
    }
    return false;
}

/**
 * Render HTML for a single resource item (used in course detail and admin list).
 * @param {Object} rData - resource data
 * @param {Function} t - translator function
 * @param {Function} esc - HTML escape
 * @param {Object} opts - optional { loggedInUserUID, loggedInUserName }
 * @returns {string} HTML
 */
export function renderResourceItemHTML(rData, t, esc, opts = {}) {
    const canView = hasViewableResource(rData);
    let icon = "fa-file-pdf text-red-500";
    if (rData.type && rData.type.includes("Video")) icon = "fa-video text-blue-500";
    if (rData.type && rData.type.includes("Audio")) icon = "fa-microphone text-purple-500";
    if (rData.type && rData.type.includes("Image")) icon = "fa-image text-amber-500";

    const canManage = opts.loggedInUserUID
        ? canManageResource(rData, opts.loggedInUserUID, opts.loggedInUserName)
        : false;

    const manageBtns = canManage
        ? `<div class="flex gap-1 shrink-0 ml-1">` +
        `<button type="button" data-edit-resource="${rData.id}" class="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white font-bold">${t("btnEdit")}</button>` +
        `<button type="button" data-delete-resource="${rData.id}" class="text-[9px] px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white font-bold">${t("btnDelete")}</button>` +
        `</div>`
        : "";

    const viewBtn = canView
        ? `<button type="button" data-view-resource="${rData.id}" class="inline-block mt-1 text-[9px] text-indigo-600 font-bold underline hover:text-indigo-900">${t("btnViewFile")}</button>`
        : `<span class="inline-block mt-1 text-[9px] text-red-500">${t("fileLinkMissing")}</span>`;

    return (
        `<div class="p-2 bg-indigo-50/50 border border-indigo-100 rounded-md text-[11px]">` +
        `<div class="flex justify-between items-start gap-1">` +
        `<div class="flex-1 min-w-0 font-medium text-gray-800">` +
        `<i class="fa-solid ${icon} mr-1"></i>` +
        `<span class="break-words">${esc(rData.title)}</span>` +
        `<span class="text-[9px] text-gray-400 block">(${t("byAuthor")} ${esc(rData.author)})</span>` +
        `</div>` +
        manageBtns +
        `</div>` +
        viewBtn +
        `</div>`
    );
}

/**
 * Extract current archive filter values from DOM elements.
 * @returns {{ season: string, program: string, sessionYear: string }}
 */
export function getArchiveFilterParts() {
    const seasonEl = document.getElementById("filterSeason");
    const programEl = document.getElementById("filterProgram");
    const yearEl = document.getElementById("filterSessionYear");
    return {
        season: seasonEl?.value || "Spring",
        program: programEl?.value || "regular",
        sessionYear: yearEl?.value || "2026",
    };
}

/**
 * Build the combined trimester key from all filter dropdowns.
 * @param {Function} getArchiveSessionFull - from academicTerms
 * @param {Function} normalizeTrimesterKey - from academicTerms
 * @returns {string}
 */
export function getCombinedTrimesterKey(getArchiveSessionFull, normalizeTrimesterKey) {
    const yr = document.getElementById("filterYear")?.value || "1st Year";
    const termNum = document.getElementById("filterTermNum")?.value || "1st Trimester";
    const { season, program, sessionYear } = getArchiveFilterParts();
    const sessionFull = getArchiveSessionFull(season, program, sessionYear);
    return normalizeTrimesterKey(`${yr} - ${termNum} (${sessionFull})`);
}

/**
 * Count resources matching a specific course from the current snapshot.
 * @param {Object} course - course object with code
 * @param {Array} resourcesSnapshot - Firestore snapshot docs array
 * @returns {number}
 */
export function countResourcesForCourse(course, resourcesSnapshot) {
    if (!resourcesSnapshot || !course) return 0;
    let count = 0;
    resourcesSnapshot.forEach((resDoc) => {
        const rData = { id: resDoc.id, ...resDoc.data() };
        if (resourceMatchesCourse(rData, course)) count++;
    });
    return count;
}

/**
 * Get all resource docs matching a specific course.
 * @param {Object} course
 * @param {Array} resourcesSnapshot
 * @returns {Array<Object>}
 */
export function getResourcesForCourse(course, resourcesSnapshot) {
    const list = [];
    if (!resourcesSnapshot || !course) return list;
    resourcesSnapshot.forEach((resDoc) => {
        const rData = { id: resDoc.id, ...resDoc.data() };
        if (resourceMatchesCourse(rData, course)) list.push(rData);
    });
    return list;
}

/**
 * Check whether the logged-in user can upload resources in the currently selected filter view.
 * @param {string|null} loggedInUserUID
 * @param {string} studentCurrentTrimesterKey
 * @param {Function} getTrimesterKey - returns current combined key
 * @param {Function} normalizeTrimesterKey
 * @returns {boolean}
 */
export function canUploadInCurrentView(
    loggedInUserUID,
    studentCurrentTrimesterKey,
    getTrimesterKey,
    normalizeTrimesterKey
) {
    const combinedTrimesterKey = getTrimesterKey();
    return (
        Boolean(loggedInUserUID) &&
        Boolean(studentCurrentTrimesterKey) &&
        normalizeTrimesterKey(combinedTrimesterKey) === normalizeTrimesterKey(studentCurrentTrimesterKey)
    );
}

/**
 * Render the course card grid.
 * @param {Array} latestMappedCourses - [{ code, title, teacher }]
 * @param {HTMLElement} courseGrid - target DOM element
 * @param {Function} t - translator
 * @param {Function} esc - HTML escape
 * @param {boolean} canUpload - can upload in current view
 * @param {Array} resourcesSnapshot
 */
export function renderCourseGrid(
    latestMappedCourses,
    courseGrid,
    t,
    esc,
    canUpload,
    resourcesSnapshot
) {
    if (latestMappedCourses.length === 0) {
        courseGrid.innerHTML = `<p class="text-xs text-gray-400 col-span-3 p-6 text-center border border-dashed rounded-xl w-full">${t("noCourses")}</p>`;
        return;
    }

    const cards = [];
    latestMappedCourses.forEach((course, courseIndex) => {
        const fileCount = countResourcesForCourse(course, resourcesSnapshot);
        const uploadClass = canUpload
            ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-600 hover:text-white"
            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";
        const lockHint = canUpload
            ? ""
            : ` disabled title="${t("uploadOwnSemOnly")}"`;

        cards.push(
            `<div class="portal-card border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col justify-between hover:border-indigo-600">` +
            `<div>` +
            `<div class="flex justify-between items-start gap-2">` +
            `<span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded">${esc(course.code)}</span>` +
            `<span class="text-[9px] bg-slate-200 font-bold px-1.5 py-0.5 rounded text-slate-700 shrink-0">${fileCount} ${t("resourceCount")}</span>` +
            `</div>` +
            `<h4 class="text-base font-extrabold text-gray-800 mt-2">${esc(course.title)}</h4>` +
            `<p class="text-xs text-gray-500 mt-1"><i class="fa-solid fa-user-tie mr-1 text-slate-400"></i>${t("faculty")}: ${esc(course.teacher)}</p>` +
            `</div>` +
            `<div class="mt-4 pt-2.5 grid grid-cols-2 gap-2">` +
            `<button type="button" data-view-course="${courseIndex}" class="portal-btn border bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-700 hover:text-white text-center text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1">` +
            `<i class="fa-solid fa-folder-open"></i> ${t("btnViewMaterials")}</button>` +
            `<button type="button" data-upload-course="${courseIndex}" ${canUpload ? "" : `disabled${lockHint}`} class="portal-btn border text-center text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1 ${uploadClass}">` +
            `<i class="fa-solid fa-plus-circle"></i> ${t("btnAddResource")}</button>` +
            `</div></div>`
        );
    });
    courseGrid.innerHTML = cards.join("");
}

/**
 * Render the full course detail view (sidebar + resource sections).
 * @param {Object} course - { code, title, teacher }
 * @param {HTMLElement} metaEl - courseDetailMeta
 * @param {HTMLElement} resourcesEl - courseDetailResources
 * @param {HTMLElement} uploadBtn - courseDetailUpload
 * @param {Function} t - translator
 * @param {Function} esc - HTML escape
 * @param {string} lang - current language
 * @param {string} viewKey - combined trimester key string
 * @param {boolean} canUpload - can upload
 * @param {Array} resourcesSnapshot
 * @param {Object} opts - { loggedInUserUID, loggedInUserName }
 */
export function renderCourseDetail(
    course,
    metaEl,
    resourcesEl,
    uploadBtn,
    t,
    esc,
    lang,
    viewKey,
    canUpload,
    resourcesSnapshot,
    opts = {}
) {
    const files = getResourcesForCourse(course, resourcesSnapshot);
    const catLabels =
        (RESOURCE_CATEGORY_LABELS && RESOURCE_CATEGORY_LABELS[lang]) ||
        (RESOURCE_CATEGORY_LABELS && RESOURCE_CATEGORY_LABELS.en) ||
        {};

    metaEl.innerHTML =
        `<span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded">${esc(course.code)}</span>` +
        `<h2 class="text-xl font-extrabold text-gray-900 mt-3">${esc(course.title)}</h2>` +
        `<p class="text-sm text-gray-600 mt-2"><i class="fa-solid fa-user-tie mr-1 text-slate-400"></i>${t("faculty")}: <b>${esc(course.teacher)}</b></p>` +
        `<p class="text-[11px] text-indigo-700 mt-2 font-medium">${esc(viewKey)}</p>` +
        `<p class="text-[10px] text-gray-500 mt-2 border-t pt-2">${files.length} ${t("resourceCount")}</p>` +
        `<p class="text-[10px] text-emerald-700 mt-1 leading-relaxed">${t("sharedAcrossSemesters")}</p>`;

    const grouped = {};
    RESOURCE_CATEGORY_ORDER.forEach((c) => {
        grouped[c] = [];
    });
    files.forEach((rData) => {
        const cat = categorizeResource(rData);
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(rData);
    });

    let sectionsHtml = "";
    RESOURCE_CATEGORY_ORDER.forEach((cat) => {
        if (!grouped[cat].length) return;
        sectionsHtml +=
            `<section class="bg-white rounded-xl shadow-md p-4 border border-gray-100">` +
            `<h4 class="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2">` +
            `<i class="fa-solid fa-folder-open text-indigo-500"></i> ${catLabels[cat] || cat}` +
            `<span class="text-[10px] font-normal text-gray-400">(${grouped[cat].length})</span>` +
            `</h4>` +
            `<div class="space-y-2">${grouped[cat].map((r) => renderResourceItemHTML(r, t, esc, opts)).join("")}</div>` +
            `</section>`;
    });
    resourcesEl.innerHTML =
        sectionsHtml ||
        `<p class="text-sm text-gray-400 p-6 text-center border border-dashed rounded-xl bg-white">${t("noSharedFiles")}</p>`;

    uploadBtn.disabled = !canUpload;
    uploadBtn.className = canUpload
        ? "w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg shadow flex items-center justify-center gap-2"
        : "w-full bg-gray-200 text-gray-400 text-xs font-bold py-2.5 rounded-lg cursor-not-allowed flex items-center justify-center gap-2";
    uploadBtn.title = canUpload
        ? ""
        : !opts.loggedInUserUID
            ? t("loginToUpload")
            : t("uploadOwnSemOnly");
}

/**
 * Parse course=CODE from URL hash and open the matching course detail if found.
 * @param {Array} latestMappedCourses
 * @param {Function} openCourseDetail - (index) => void
 * @returns {boolean} whether a match was found
 */
export function parseCourseHash(latestMappedCourses, openCourseDetail) {
    const m = window.location.hash.match(/course=([^&]+)/);
    if (!m || !latestMappedCourses.length) return false;
    const code = decodeURIComponent(m[1]);
    const idx = latestMappedCourses.findIndex((c) => c.code === code);
    if (idx >= 0) {
        openCourseDetail(idx);
        return true;
    }
    return false;
}