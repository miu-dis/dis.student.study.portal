// assets/js/admin/attendanceManager.js
// Routine-based attendance: today's daily routines → batch-filtered students → Yes/No toggle

import { escapeHtml } from "../sanitize.js";
import { ATTENDANCE_STATUS, STATUS_META } from "../portal/attendance.js";

export { ATTENDANCE_STATUS, STATUS_META };

/**
 * Get today's date in Bangladesh timezone (YYYY-MM-DD).
 * @returns {string}
 */
export function getBangladeshToday() {
    const now = new Date();
    const bd = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    const yyyy = bd.getUTCFullYear();
    const mm = String(bd.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(bd.getUTCDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
}

/**
 * Format a time string (HH:MM) to 12-hour display.
 * @param {string} timeString
 * @returns {string}
 */
function formatTime12h(timeString) {
    if (!timeString) return "";
    const parts = timeString.split(":");
    const h = parseInt(parts[0], 10);
    const m = parts[1] || "00";
    if (isNaN(h)) return timeString;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return h12 + ":" + m + " " + ampm;
}

/**
 * Render today's daily routines as clickable attendance targets.
 * Each routine card shows course info + batch + time, with a "Mark Attendance" button.
 * @param {Array<{ id: string, data: object }>} todayRoutines
 * @param {Map<string, number>} recordCounts - routineId → existing record count
 * @param {string} [today] - ISO date string for display
 * @returns {string} HTML
 */
export function buildTodayRoutineAttendanceList(todayRoutines, recordCounts, today, t) {
    const tr = t || ((k) => k);
    if (!todayRoutines || todayRoutines.length === 0) {
        return '<p class="text-gray-400 text-xs text-center py-4">' + tr("noClassesToday") + '</p>';
    }
    const dateLabel = today
        ? new Date(today + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : today;

    return todayRoutines
        .map((r) => {
            const d = r.data;
            const id = r.id;
            const count = recordCounts.get(id) || 0;
            const timeStr = [d.startTime, d.endTime]
                .filter(Boolean)
                .map(formatTime12h)
                .join("\u2013") || (d.timeSlot || "");
            return /* html */ `
        <div class="border border-gray-200 rounded-lg bg-white overflow-hidden routine-attendance-card" data-routine-id="${escapeHtml(id)}">
            <div class="flex items-center justify-between p-3 bg-gray-50 gap-2 flex-wrap">
                <div class="flex items-center gap-2 min-w-0 flex-wrap">
                    <span class="text-xs font-bold text-gray-700 truncate">${escapeHtml(d.courseCode || "")} \u2014 ${escapeHtml(d.subject || d.courseTitle || "")}</span>
                    ${timeStr ? `<span class="text-[10px] text-gray-400 shrink-0">${escapeHtml(timeStr)}</span>` : ""}
                    ${d.batchNumber ? `<span class="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold shrink-0">${tr("batchLabel")} ${escapeHtml(d.batchNumber)}</span>` : ""}
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold routine-card__record-count">${count} ${tr("markedCount")}</span>
                    <button type="button" data-action="mark-routine" data-routine-id="${escapeHtml(id)}"
                        class="portal-btn text-[10px] font-bold px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700">
                        <i class="fa-solid fa-user-check mr-1"></i> ${tr("markAttendanceBtn")}
                    </button>
                </div>
            </div>
        </div>`;
        })
        .join("");
}

/**
 * Build the attendance marking UI for a given daily routine.
 * Batch-filtered students with Present/Absent radio toggle, default all present.
 * @param {string} routineId
 * @param {object} routineData - { courseCode, subject, routineDate, batchNumber }
 * @param {Array<{ studentId: string, name: string }>} students
 * @param {Map<string, string>} existingRecords - studentUID → status
 * @returns {string} HTML
 */
export function buildBatchAttendanceUI(routineId, routineData, students, existingRecords, t) {
    const tr = t || ((k) => k);
    if (!students || students.length === 0) {
        return '<p class="text-gray-400 text-xs text-center py-4">' + tr("noStudentsForCourse") + '</p>';
    }
    const rows = students
        .map((s) => {
            const uid = s.studentUID || s.studentId;
            const currentStatus = existingRecords.get(uid) || "present";
            const presentChecked = currentStatus === "present" ? "checked" : "";
            const absentChecked = currentStatus === "absent" ? "checked" : "";
            return /* html */ `
        <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-2 px-2 text-xs font-semibold text-gray-800">${escapeHtml(s.studentId)}</td>
            <td class="py-2 px-2 text-xs text-gray-700">${escapeHtml(s.name)}</td>
            <td class="py-2 px-2">
                <div class="flex items-center gap-3">
                    <label class="inline-flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${presentChecked ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500" : "bg-gray-100 text-gray-500 hover:bg-emerald-50"}">
                        <input type="radio" name="att_${escapeHtml(uid)}" value="present" ${presentChecked}
                            class="sr-only" data-student="${escapeHtml(uid)}" data-student-name="${escapeHtml(s.name)}" data-student-display-id="${escapeHtml(s.studentId)}" data-status="present">
                        <i class="fa-solid fa-check text-[9px]"></i> ${tr("statusPresent")}
                    </label>
                    <label class="inline-flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${absentChecked ? "bg-red-100 text-red-800 ring-2 ring-red-500" : "bg-gray-100 text-gray-500 hover:bg-red-50"}">
                        <input type="radio" name="att_${escapeHtml(uid)}" value="absent" ${absentChecked}
                            class="sr-only" data-student="${escapeHtml(uid)}" data-student-name="${escapeHtml(s.name)}" data-student-display-id="${escapeHtml(s.studentId)}" data-status="absent">
                        <i class="fa-solid fa-xmark text-[9px]"></i> ${tr("statusAbsent")}
                    </label>
                </div>
            </td>
        </tr>`;
        })
        .join("");

    return /* html */ `
    <div class="attendance-marking" data-routine-id="${escapeHtml(routineId)}">
        <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
                <p class="text-xs font-bold text-gray-800">${escapeHtml(routineData.courseCode || "")} \u2014 ${escapeHtml(routineData.subject || routineData.courseTitle || "")}</p>
                <p class="text-[10px] text-gray-400">${escapeHtml(routineData.routineDate || "")}${routineData.batchNumber ? " \u2022 Batch " + escapeHtml(routineData.batchNumber) : ""}</p>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" id="attMarkAllPresent"
                    class="portal-btn text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
                    <i class="fa-solid fa-check-double mr-1"></i> ${tr("allPresent")}
                </button>
                <button type="button" id="attMarkAllAbsent"
                    class="portal-btn text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
                    <i class="fa-solid fa-xmark mr-1"></i> ${tr("allAbsent")}
                </button>
                <button type="button" id="attSaveAttendance"
                    class="portal-btn text-[10px] font-bold px-3 py-1.5 rounded-lg bg-rose-700 text-white hover:bg-rose-800">
                    <i class="fa-solid fa-floppy-disk mr-1"></i> ${tr("saveAttendance")}
                </button>
                <button type="button" id="attCancelAttendance"
                    class="portal-btn text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200">
                    <i class="fa-solid fa-xmark mr-1"></i> ${tr("cancelAttendance") || "Cancel"}
                </button>
            </div>
        </div>
        <div class="overflow-x-auto border rounded-lg">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("studentIdCol")}</th>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("nameCol")}</th>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("statusCol")}</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    </div>`;
}

/**
 * Collect attendance records from the marking UI (checked radio buttons).
 * @param {HTMLElement} containerEl - the attendance-marking container
 * @returns {Array<{ studentUID: string, status: string }>}
 */
export function collectAttendanceRecords(containerEl) {
    const radios = containerEl.querySelectorAll("input[type='radio']:checked");
    const records = [];
    radios.forEach((radio) => {
        records.push({
            studentUID: radio.dataset.student,
            studentName: radio.dataset.studentName || radio.dataset.student,
            studentDisplayId: radio.dataset.studentDisplayId || radio.dataset.student,
            status: radio.dataset.status,
        });
    });
    return records;
}

/**
 * Render attendance records for a routine (read-only summary view).
 * @param {Array<{ studentUID: string, studentName: string, status: string }>} records
 * @returns {string} HTML
 */
export function renderAttendanceRecords(records, t) {
    const tr = t || ((k) => k);
    if (!records || records.length === 0) {
        return '<p class="text-gray-400 text-xs text-center py-2">' + tr("noAttendanceRecords") + '</p>';
    }
    const presentCount = records.filter((r) => r.status === "present").length;
    const absentCount = records.length - presentCount;
    const pct = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;
    const summary = /* html */ `
    <div class="flex items-center gap-3 mb-3 text-xs flex-wrap">
        <span class="font-bold text-gray-700">${tr("attendanceSummaryLabel")}</span>
        <span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">${presentCount} ${tr("presentCount")}</span>
        <span class="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">${absentCount} ${tr("absentCount")}</span>
        <span class="text-gray-400">(${pct}%)</span>
    </div>`;

    const rows = records
        .map((r) => {
            const meta = STATUS_META[r.status] || STATUS_META.absent;
            const statusLabel = r.status === "present" ? tr("statusPresent") : tr("statusAbsent");
            return /* html */ `
        <tr class="border-b border-gray-100">
            <td class="py-1.5 px-2 text-xs font-semibold text-gray-800">${escapeHtml(r.studentDisplayId || r.studentUID)}</td>
            <td class="py-1.5 px-2 text-xs text-gray-700">${escapeHtml(r.studentName)}</td>
            <td class="py-1.5 px-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${meta.color}">
                    ${meta.icon} ${statusLabel}
                </span>
            </td>
        </tr>`;
        })
        .join("");

    return (
        summary +
        /* html */ `
    <div class="overflow-x-auto border rounded-lg">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b">
                <tr>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("studentIdCol")}</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("nameCol")}</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("statusCol")}</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`
    );
}


/**
 * Compute attendance percentage for a set of records.
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
 * Render attendance report summary across all students — with expandable per-course drill-down.
 * Each record should include: status, studentName, studentDisplayId, courseCode, courseTitle,
 * recordId (Firestore doc id), routineId, routineDate.
 * @param {Map<string, Array<{ status: string, studentName: string, studentDisplayId: string,
 *   courseCode: string, courseTitle: string, recordId: string, routineId: string, routineDate: string }>>} perStudentRecords
 * @param {Function} t - i18n translator
 * @returns {string} HTML
 */
export function renderAttendanceReport(perStudentRecords, t) {
    const tr = t || ((k) => k);
    if (perStudentRecords.size === 0) {
        return '<p class="text-gray-400 text-xs text-center py-4">' + tr("noAttendanceData") + '</p>';
    }
    const rows = [];
    perStudentRecords.forEach((records, studentUID) => {
        const stats = computeAttendanceStats(records);
        const colorClass =
            stats.percent >= 75 ? "text-emerald-700" : stats.percent >= 50 ? "text-amber-700" : "text-red-700";
        const bgClass =
            stats.percent >= 75 ? "bg-emerald-100" : stats.percent >= 50 ? "bg-amber-100" : "bg-red-100";
        const studentName = records[0]?.studentName || studentUID;
        const displayId = records[0]?.studentDisplayId || studentUID;

        // Build per-course sub-rows for the detail section
        const detailRows = records.map((r) => {
            const statusLabel = r.status === "present" ? (tr("statusPresent") || "Present") : (tr("statusAbsent") || "Absent");
            const statusBadgeClass = r.status === "present"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700";
            const dateDisplay = r.routineDate || "";
            const courseCode = escapeHtml(r.courseCode || "");
            const courseTitle = escapeHtml(r.courseTitle || "");
            const recordId = escapeHtml(r.recordId || "");
            const routineId = escapeHtml(r.routineId || "");
            return /* html */ `
            <tr class="border-b border-gray-100 text-[10px]">
                <td class="py-1 px-2 font-mono text-teal-700 font-bold">${courseCode}</td>
                <td class="py-1 px-2 text-gray-600 max-w-[140px] truncate" title="${courseTitle}">${courseTitle}</td>
                <td class="py-1 px-2 text-gray-500 font-mono">${dateDisplay}</td>
                <td class="py-1 px-2"><span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${statusBadgeClass}">${statusLabel}</span></td>
                <td class="py-1 px-1 text-center">
                    <button type="button" data-action="edit-att-record" data-routine-id="${routineId}" data-record-id="${recordId}"
                        class="text-blue-600 hover:text-blue-800 text-[10px] font-semibold px-1.5 py-0.5 rounded hover:bg-blue-50" title="Edit">&#9998;</button>
                </td>
                <td class="py-1 px-1 text-center">
                    <button type="button" data-action="delete-att-record" data-record-id="${recordId}"
                        class="text-red-500 hover:text-red-700 text-[10px] font-semibold px-1.5 py-0.5 rounded hover:bg-red-50" title="Delete">&#128465;</button>
                </td>
            </tr>`;
        }).join("");

        rows.push(/* html */ `
        <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer att-report-main-row" data-student-uid="${escapeHtml(studentUID)}">
            <td class="py-2 px-1 text-center">
                <button type="button" class="att-expand-btn text-gray-400 hover:text-gray-700 text-xs transition-transform duration-200" data-student-uid="${escapeHtml(studentUID)}" title="${escapeHtml(tr("attExpandHint") || "Click to expand")}">&#9654;</button>
            </td>
            <td class="py-2 px-2 text-xs font-semibold text-gray-800">${escapeHtml(displayId)}</td>
            <td class="py-2 px-2 text-xs text-gray-700">${escapeHtml(studentName)}</td>
            <td class="py-2 px-2 text-xs text-gray-500">${stats.present}/${stats.total}</td>
            <td class="py-2 px-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${bgClass} ${colorClass}">
                    ${stats.percent}%
                </span>
            </td>
        </tr>
        <tr class="att-detail-row hidden" data-student-uid="${escapeHtml(studentUID)}">
            <td colspan="5" class="p-0 bg-gray-50/80">
                <div class="px-3 py-2 border-t border-gray-100">
                    <table class="w-full text-left">
                        <thead class="text-[9px] text-gray-400 uppercase border-b border-gray-100">
                            <tr>
                                <th class="py-1 px-2">${tr("ledgerColCourse") || "Code"}</th>
                                <th class="py-1 px-2">${tr("ledgerColSubject") || "Subject"}</th>
                                <th class="py-1 px-2">${tr("ledgerColDate") || "Date"}</th>
                                <th class="py-1 px-2">${tr("statusCol") || "Status"}</th>
                                <th class="py-1 px-1 text-center">${escapeHtml(tr("attEdit") || "Edit")}</th>
                                <th class="py-1 px-1 text-center">${escapeHtml(tr("attDelete") || "Del")}</th>
                            </tr>
                        </thead>
                        <tbody>${detailRows}</tbody>
                    </table>
                </div>
            </td>
        </tr>`);
    });
    return /* html */ `
    <div class="overflow-x-auto border rounded-lg">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b">
                <tr>
                    <th class="py-2 px-1 w-8"></th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("studentIdCol")}</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("nameCol")}</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("attendanceCol")}</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">${tr("percentCol")}</th>
                </tr>
            </thead>
            <tbody>${rows.join("")}</tbody>
        </table>
    </div>`;
}

/**
 * Save attendance records for a routine.
 * Denormalized: stores routineId, routineDate, courseCode, courseTitle, batchNumber directly.
 * Deletes previous records for the same routine before saving (allows re-marking).
 * @param {string} routineId
 * @param {object} routineData - { courseCode, subject, routineDate, batchNumber, startTime, endTime }
 * @param {Array<{ studentUID: string, status: string }>} records
 * @param {object} firestore - { db, doc, setDoc, deleteDoc, collection, getDocs, query, where }
 * @param {string} adminUID
 * @returns {Promise<void>}
 */
export async function saveAttendanceRecords(routineId, routineData, records, firestore, adminUID) {
    if (!records || records.length === 0) {
        alert("No attendance records to save.");
        return;
    }
    try {
        const { db, doc, setDoc, deleteDoc, collection, getDocs, query, where } = firestore;

        // Delete existing records for this routine (to allow re-marking)
        const existingSnap = await getDocs(
            query(collection(db, "attendance_records"), where("routineId", "==", routineId))
        );
        const deletePromises = existingSnap.docs.map((d) => deleteDoc(doc(db, "attendance_records", d.id)));
        await Promise.all(deletePromises);

        // Save new denormalized records — studentName and studentDisplayId come from dataset
        const batch = [];
        const now = new Date().toISOString();
        for (const record of records) {
            const ref = doc(collection(db, "attendance_records"));
            batch.push(
                setDoc(ref, {
                    routineId,
                    routineDate: routineData.routineDate || "",
                    courseCode: routineData.courseCode || "",
                    courseTitle: routineData.subject || routineData.courseTitle || "",
                    batchNumber: routineData.batchNumber || "",
                    studentUID: record.studentUID,
                    studentName: record.studentName || record.studentUID,
                    studentDisplayId: record.studentDisplayId || record.studentUID,
                    status: record.status,
                    markedAt: now,
                    markedBy: adminUID,
                })
            );
        }
        await Promise.all(batch);
    } catch (err) {
        throw err; // Let caller handle toast
    }
}

/**
 * Delete all attendance records for a routine.
 * @param {string} routineId
 * @param {object} firestore - { db, doc, deleteDoc, collection, getDocs, query, where }
 * @returns {Promise<void>}
 */
export async function deleteRoutineAttendanceRecords(routineId, firestore) {
    try {
        const { db, doc, deleteDoc, collection, getDocs, query, where } = firestore;
        const recordsSnap = await getDocs(
            query(collection(db, "attendance_records"), where("routineId", "==", routineId))
        );
        const deletePromises = recordsSnap.docs.map((d) => deleteDoc(doc(db, "attendance_records", d.id)));
        await Promise.all(deletePromises);
    } catch (err) {
        console.error("deleteRoutineAttendanceRecords:", err);
    }
}