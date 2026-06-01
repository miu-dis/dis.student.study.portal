// assets/js/portal/attendance.js
// Student portal: view personal attendance records, summary, and per-course breakdown

import { escapeHtml } from "../sanitize.js";

/** @type {string[]} */
export const ATTENDANCE_STATUS = ["present", "absent", "late", "excused"];

/** @type {Record<string, { icon: string, label: string, color: string }>} */
export const STATUS_META = {
    present: { icon: "\u2705", label: "Present", color: "bg-emerald-100 text-emerald-800" },
    absent: { icon: "\u274C", label: "Absent", color: "bg-red-100 text-red-800" },
    late: { icon: "\u23F0", label: "Late", color: "bg-amber-100 text-amber-800" },
    excused: { icon: "\u2709\uFE0F", label: "Excused", color: "bg-blue-100 text-blue-800" },
};

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
 * @param {Array<{ status: string, courseCode: string, courseTitle: string, sessionId: string }>} records
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

    // Per-course breakdown
    const courseMap = new Map();
    records.forEach((r) => {
        const key = (r.courseCode || "") + "|" + (r.courseTitle || "");
        if (!courseMap.has(key)) courseMap.set(key, []);
        courseMap.get(key).push(r);
    });
    const courseBreakdown = [];
    courseMap.forEach((recs, key) => {
        const [code, title] = key.split("|");
        const cs = computeAttendanceStats(recs);
        courseBreakdown.push({ code, title, stats: cs });
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
 * @param {Array<{ status: string, courseCode: string, courseTitle: string, date: string, markedAt: string }>} records
 * @param {Function} [t] - translator function
 * @returns {string} HTML
 */
export function renderAttendanceHistory(records, t) {
    const tr = t || ((k) => k);
    if (!records || records.length === 0) {
        return '<p class="text-xs text-gray-400 text-center py-4">' + (tr("noAttendanceYet") || "No attendance records yet.") + '</p>';
    }
    // Sort by date descending
    const sorted = [...records].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const rows = sorted.map((r) => {
        const meta = STATUS_META[r.status] || STATUS_META.absent;
        const dateLabel = r.date ? new Date(r.date + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short", year: "numeric", month: "short", day: "numeric",
        }) : "N/A";
        return /* html */`
        <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-2 px-2 text-xs text-gray-500">${dateLabel}</td>
            <td class="py-2 px-2 text-xs font-semibold text-gray-800">${escapeHtml(r.courseCode || "")}</td>
            <td class="py-2 px-2 text-xs text-gray-700 truncate max-w-[120px]">${escapeHtml(r.courseTitle || "")}</td>
            <td class="py-2 px-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${meta.color}">
                    ${meta.icon} ${meta.label}
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
 * Query attendance records for a specific student, enriched with session data.
 * @param {object} firestore
 * @param {*} firestore.db
 * @param {*} firestore.collection
 * @param {*} firestore.getDocs
 * @param {*} firestore.query
 * @param {*} firestore.where
 * @param {string} studentUID
 * @returns {Promise<Array<{ status: string, courseCode: string, courseTitle: string, date: string, sessionId: string, markedAt: string }>>}
 */
export async function fetchMyAttendanceRecords(firestore, studentUID) {
    const { db, collection, getDocs, query, where } = firestore;
    try {
        // Get all records for this student
        const recordsSnap = await getDocs(
            query(collection(db, "attendance_records"), where("studentUID", "==", studentUID))
        );
        if (recordsSnap.empty) return [];

        // Collect session IDs
        const sessionIds = new Set();
        const records = [];
        recordsSnap.forEach((docSnap) => {
            const d = docSnap.data();
            records.push(d);
            if (d.sessionId) sessionIds.add(d.sessionId);
        });

        // Fetch session data for dates and course info
        const sessionMap = new Map();
        const sessionPromises = [...sessionIds].map(async (sid) => {
            const { doc: docFn, getDoc } = firestore;
            const snap = await getDoc(docFn(db, "attendance_sessions", sid));
            if (snap.exists()) {
                sessionMap.set(sid, snap.data());
            }
        });
        await Promise.all(sessionPromises);

        // Enrich records with session data
        return records.map((r) => {
            const session = sessionMap.get(r.sessionId) || {};
            return {
                status: r.status,
                courseCode: r.courseCode || session.courseCode || "",
                courseTitle: r.courseTitle || session.courseTitle || "",
                date: r.date || session.date || "",
                sessionId: r.sessionId || "",
                markedAt: r.markedAt || "",
                studentName: r.studentName || "",
            };
        });
    } catch (err) {
        console.error("fetchMyAttendanceRecords:", err);
        return [];
    }
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