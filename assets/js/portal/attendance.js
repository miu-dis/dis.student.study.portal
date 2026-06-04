// assets/js/portal/attendance.js
// Student portal: view personal attendance records, summary, and per-course breakdown

import { escapeHtml } from "../sanitize.js";

/** @type {string[]} */
export const ATTENDANCE_STATUS = ["present", "absent"];

/** @type {Record<string, { icon: string, label: string, color: string }>} */
export const STATUS_META = {
    present: { icon: "\u2705", label: "Present", color: "bg-emerald-100 text-emerald-800" },
    absent: { icon: "\u274C", label: "Absent", color: "bg-red-100 text-red-800" },
};

/**
 * Get a translated status label.
 * @param {string} status - "present" or "absent"
 * @param {Function} [t] - translator function, defaults to identity
 * @returns {string}
 */
export function getStatusLabel(status, t) {
    const tr = t || ((k) => k);
    return status === "present" ? tr("statusPresent") || "Present" : tr("statusAbsent") || "Absent";
}

/**
 * Compute attendance statistics from a set of records.
 * @param {Array<{ status: string }>} records
 * @returns {{ present: number, total: number, percent: number }}
 */
export function computeAttendanceStats(records) {
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percent = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, total, percent };
}

/**
 * Render the "My Attendance" summary card for the student home page.
 * @param {Array<{ status: string, courseCode: string, courseTitle: string, routineId: string }>} records
 * @param {Function} [t] - translator function, defaults to identity
 * @returns {string} HTML
 */
export function renderMyAttendanceSummary(records, t) {
    const tr = t || ((k) => k);
    if (!records || records.length === 0) {
        return /* html */`
        <div class="portal-card bg-white rounded-xl shadow-md p-5 border-t-4 border-purple-600">
            <h3 class="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-clipboard-user text-purple-600"></i>
                ${tr("myAttendance") || "My Attendance"}
            </h3>
            <p class="text-xs text-gray-400 text-center py-4">${tr("noAttendanceYet") || "No attendance records yet."}</p>
        </div>`;
    }
    const stats = computeAttendanceStats(records);
    const pctClass = stats.percent >= 75 ? "text-emerald-700" : stats.percent >= 50 ? "text-amber-700" : "text-red-700";
    const pctBg = stats.percent >= 75 ? "bg-emerald-100" : stats.percent >= 50 ? "bg-amber-100" : "bg-red-100";

    // Per-course breakdown — group by courseCode only, not courseTitle
    const courseMap = new Map();
    records.forEach((r) => {
        const code = (r.courseCode || "").trim().toUpperCase();
        if (!code) return;
        if (!courseMap.has(code)) courseMap.set(code, { title: r.courseTitle || "", recs: [] });
        courseMap.get(code).recs.push(r);
        // Keep the most descriptive title
        if (r.courseTitle && r.courseTitle.length > (courseMap.get(code).title || "").length) {
            courseMap.get(code).title = r.courseTitle;
        }
    });
    const courseBreakdown = [];
    courseMap.forEach((entry, code) => {
        const cs = computeAttendanceStats(entry.recs);
        courseBreakdown.push({ code, title: entry.title, stats: cs });
    });
    courseBreakdown.sort((a, b) => a.code.localeCompare(b.code));

    const breakdownHTML = courseBreakdown.map((c) => {
        const cpctClass = c.stats.percent >= 75 ? "text-emerald-700" : c.stats.percent >= 50 ? "text-amber-700" : "text-red-700";
        const cpctBg = c.stats.percent >= 75 ? "bg-emerald-100" : c.stats.percent >= 50 ? "bg-amber-100" : "bg-red-100";
        return /* html */`
        <div class="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <span class="text-xs text-gray-700 font-medium truncate mr-2">${escapeHtml(c.code)} \u2014 ${escapeHtml(c.title)}</span>
            <span class="inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cpctBg} ${cpctClass}">
                ${c.stats.present}/${c.stats.total} (${c.stats.percent}%)
            </span>
        </div>`;
    }).join("");

    return /* html */`
    <div class="portal-card bg-white rounded-xl shadow-md p-5 border-t-4 border-purple-600">
        <h3 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <i class="fa-solid fa-clipboard-user text-purple-600"></i>
            ${tr("myAttendance") || "My Attendance"}
        </h3>
        <div class="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
            <div class="text-center">
                <span class="text-2xl font-extrabold ${pctClass}">${stats.percent}%</span>
                <p class="text-[10px] text-gray-400 uppercase font-bold">${tr("overall") || "Overall"}</p>
            </div>
            <div class="flex-1 text-xs text-gray-500">
                <span class="font-bold text-gray-700">${stats.present}</span> ${tr("presentOf") || "present of"} <span class="font-bold text-gray-700">${stats.total}</span> ${tr("totalClasses") || "total classes"}
            </div>
        </div>
        <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">${tr("perCourse") || "Per Course"}</p>
        <div class="space-y-0">${breakdownHTML}</div>
    </div>`;
}

/**
 * Render attendance history table for the student.
 * @param {Array<{ status: string, courseCode: string, courseTitle: string, routineDate: string, markedAt: string }>} records
 * @param {Function} [t] - translator function
 * @returns {string} HTML
 */
export function renderAttendanceHistory(records, t) {
    const tr = t || ((k) => k);
    if (!records || records.length === 0) {
        return '<p class="text-xs text-gray-400 text-center py-4">' + (tr("noAttendanceYet") || "No attendance records yet.") + '</p>';
    }
    // Sort by date descending (using routineDate field)
    const sorted = [...records].sort((a, b) => (b.routineDate || "").localeCompare(a.routineDate || ""));
    const rows = sorted.map((r) => {
        const meta = STATUS_META[r.status] || STATUS_META.absent;
        const dateLabel = r.routineDate ? new Date(r.routineDate + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short", year: "numeric", month: "short", day: "numeric",
        }) : "N/A";
        return /* html */`
        <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-2 px-2 text-xs text-gray-500">${dateLabel}</td>
            <td class="py-2 px-2 text-xs font-semibold text-gray-800">${escapeHtml(r.courseCode || "")}</td>
            <td class="py-2 px-2 text-xs text-gray-700 truncate max-w-[120px]">${escapeHtml(r.courseTitle || "")}</td>
            <td class="py-2 px-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${meta.color}">
                    ${meta.icon} ${getStatusLabel(r.status, tr)}
                </span>
            </td>
        </tr>`;
    }).join("");
    return /* html */`
    <div class="overflow-x-auto border rounded-lg">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b">
                <tr>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("date") || "Date"}</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("course") || "Course"}</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("title") || "Title"}</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("status") || "Status"}</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;
}

/**
 * Query attendance records for a specific student.
 * Records are already denormalized with course info — no session enrichment needed.
 * @param {object} firestore
 * @param {*} firestore.db
 * @param {*} firestore.collection
 * @param {*} firestore.getDocs
 * @param {*} firestore.query
 * @param {*} firestore.where
 * @param {string} studentUID
 * @returns {Promise<Array<{ status: string, courseCode: string, courseTitle: string, routineDate: string, routineId: string, markedAt: string }>>}
 */
export async function fetchMyAttendanceRecords(firestore, studentUID) {
    const { db, collection, getDocs, query, where } = firestore;
    try {
        const recordsSnap = await getDocs(
            query(collection(db, "attendance_records"), where("studentUID", "==", studentUID))
        );
        if (recordsSnap.empty) return [];

        // Records are denormalized — courseCode, courseTitle, routineDate are directly on the doc
        const records = [];
        recordsSnap.forEach((docSnap) => {
            const d = docSnap.data();
            records.push({
                status: d.status,
                courseCode: d.courseCode || "",
                courseTitle: d.courseTitle || "",
                routineDate: d.routineDate || "",
                routineId: d.routineId || "",
                markedAt: d.markedAt || "",
            });
        });
        return records;
    } catch (err) {
        console.error("fetchMyAttendanceRecords:", err);
        return [];
    }
}

/**
 * Render the "My Attendance" detail view with expandable per-course breakdown.
 * Modeled after the admin panel's attendance report drill-down, but read-only.
 * @param {Array<{ status: string, courseCode: string, courseTitle: string, routineDate: string, routineId: string }>} records
 * @param {Function} [t] - translator function, defaults to identity
 * @returns {string} HTML
 */
export function renderMyAttendanceDetail(records, t) {
    const tr = t || ((k) => k);
    if (!records || records.length === 0) {
        return /* html */`
        <div class="portal-card bg-white rounded-xl shadow-md p-5 border-t-4 border-purple-600">
            <h3 class="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-clipboard-user text-purple-600"></i>
                ${tr("myAttendance") || "My Attendance"}
            </h3>
            <p class="text-xs text-gray-400 text-center py-4">${tr("noAttendanceYet") || "No attendance records yet."}</p>
        </div>`;
    }

    // Overall stats
    const overallStats = computeAttendanceStats(records);
    const opctClass = overallStats.percent >= 75 ? "text-emerald-700" : overallStats.percent >= 50 ? "text-amber-700" : "text-red-700";
    const opctBg = overallStats.percent >= 75 ? "bg-emerald-100" : overallStats.percent >= 50 ? "bg-amber-100" : "bg-red-100";

    // Per-course breakdown — group by courseCode only
    const courseMap = new Map();
    records.forEach((r) => {
        const code = (r.courseCode || "").trim().toUpperCase();
        if (!code) return;
        if (!courseMap.has(code)) courseMap.set(code, { title: r.courseTitle || "", records: [] });
        courseMap.get(code).records.push(r);
        if (r.courseTitle && r.courseTitle.length > (courseMap.get(code).title || "").length) {
            courseMap.get(code).title = r.courseTitle;
        }
    });

    const courseBreakdown = [];
    courseMap.forEach((entry, code) => {
        const cs = computeAttendanceStats(entry.records);
        // Sort records by date descending for detail rows
        const sortedRecs = [...entry.records].sort((a, b) => (b.routineDate || "").localeCompare(a.routineDate || ""));
        courseBreakdown.push({ code, title: entry.title, stats: cs, records: sortedRecs });
    });
    courseBreakdown.sort((a, b) => a.code.localeCompare(b.code));

    // Build expandable rows
    const rows = courseBreakdown.map((c) => {
        const cpctClass = c.stats.percent >= 75 ? "text-emerald-700" : c.stats.percent >= 50 ? "text-amber-700" : "text-red-700";
        const cpctBg = c.stats.percent >= 75 ? "bg-emerald-100" : c.stats.percent >= 50 ? "bg-amber-100" : "bg-red-100";
        const safeCode = escapeHtml(c.code);

        // Build per-date detail rows
        const detailRows = c.records.map((r) => {
            const meta = STATUS_META[r.status] || STATUS_META.absent;
            const dateLabel = r.routineDate
                ? new Date(r.routineDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short", year: "numeric", month: "short", day: "numeric",
                })
                : "N/A";
            return /* html */`
            <tr class="border-b border-gray-100 text-[10px]">
                <td class="py-1.5 px-2 text-gray-500">${dateLabel}</td>
                <td class="py-1.5 px-2">
                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${meta.color}">
                        ${meta.icon} ${getStatusLabel(r.status, tr)}
                    </span>
                </td>
            </tr>`;
        }).join("");

        return /* html */`
        <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer att-detail-main-row" data-course-code="${safeCode}">
            <td class="py-2 px-1 text-center">
                <button type="button" class="att-detail-expand-btn text-gray-400 hover:text-gray-700 text-xs transition-transform duration-200" data-course-code="${safeCode}" title="${escapeHtml(tr("attExpandHint") || "Click to expand")}">&#9654;</button>
            </td>
            <td class="py-2 px-2 text-xs font-semibold text-gray-800">${escapeHtml(c.code)}</td>
            <td class="py-2 px-2 text-xs text-gray-700 truncate max-w-[160px]" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</td>
            <td class="py-2 px-2 text-xs text-gray-500">${c.stats.present}/${c.stats.total}</td>
            <td class="py-2 px-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cpctBg} ${cpctClass}">${c.stats.percent}%</span>
            </td>
        </tr>
        <tr class="att-detail-sub-row hidden" data-course-code="${safeCode}">
            <td colspan="5" class="p-0 bg-purple-50/50">
                <div class="px-3 py-2 border-t border-purple-100">
                    <table class="w-full text-left">
                        <thead class="text-[9px] text-gray-400 uppercase border-b border-gray-100">
                            <tr>
                                <th class="py-1 px-2">${tr("date") || "Date"}</th>
                                <th class="py-1 px-2">${tr("status") || "Status"}</th>
                            </tr>
                        </thead>
                        <tbody>${detailRows}</tbody>
                    </table>
                </div>
            </td>
        </tr>`;
    }).join("");

    return /* html */`
    <div class="portal-card bg-white rounded-xl shadow-md p-5 border-t-4 border-purple-600">
        <h3 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <i class="fa-solid fa-clipboard-user text-purple-600"></i>
            ${tr("myAttendance") || "My Attendance"}
        </h3>
        <div class="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
            <div class="text-center">
                <span class="text-2xl font-extrabold ${opctClass}">${overallStats.percent}%</span>
                <p class="text-[10px] text-gray-400 uppercase font-bold">${tr("overall") || "Overall"}</p>
            </div>
            <div class="flex-1 text-xs text-gray-500">
                <span class="font-bold text-gray-700">${overallStats.present}</span> ${tr("presentOf") || "present of"} <span class="font-bold text-gray-700">${overallStats.total}</span> ${tr("totalClasses") || "total classes"}
            </div>
        </div>
        <p class="text-[10px] font-bold text-gray-500 uppercase mb-2">${tr("perCourse") || "Per Course"} <span class="font-normal text-gray-400">${escapeHtml(tr("attExpandHint") || "(click to expand)")}</span></p>
        <div class="overflow-x-auto border rounded-lg">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="py-2 px-1 w-8"></th>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("course") || "Course"}</th>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("title") || "Title"}</th>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("attendanceCol") || "Attendance"}</th>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("percentCol") || "%"}</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    </div>`;
}

/**
 * Filter records for a specific course.
 * @param {Array<{ courseCode: string }>} records
 * @param {string} courseCode
 * @returns {Array}
 */
export function filterRecordsByCourse(records, courseCode) {
    const code = (courseCode || "").trim().toUpperCase();
    return records.filter((r) => (r.courseCode || "").trim().toUpperCase() === code);
}

/**
 * Build the inline attendance badge HTML for a course card (shown in course grid).
 * @param {Array<{ courseCode: string }>} records
 * @param {string} courseCode
 * @returns {string} HTML badge or empty string
 */
export function renderCourseAttendanceBadge(records, courseCode) {
    const courseRecords = filterRecordsByCourse(records, courseCode);
    if (courseRecords.length === 0) return "";
    const stats = computeAttendanceStats(courseRecords);
    const pctClass = stats.percent >= 75 ? "text-emerald-700 bg-emerald-100" : stats.percent >= 50 ? "text-amber-700 bg-amber-100" : "text-red-700 bg-red-100";
    return /* html */`
    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${pctClass}">
        <i class="fa-solid fa-clipboard-user text-[8px]"></i> ${stats.percent}%
    </span>`;
}