// assets/js/admin/attendanceManager.js
// Attendance session CRUD, student marking, and reports for admin dashboard

import { escapeHtml } from "../sanitize.js";
import { ATTENDANCE_STATUS, STATUS_META } from "../portal/attendance.js";

export { ATTENDANCE_STATUS, STATUS_META };

/**
 * Build an attendance session creation form.
 * @param {object} opts
 * @param {Array<{ code: string, title: string }>} opts.courses - available courses from mappings
 * @param {string} [opts.today] - ISO date string for default date
 * @returns {string} HTML
 */
export function buildAttendanceForm(opts = {}) {
    const courses = opts.courses || [];
    const today = opts.today || new Date().toISOString().slice(0, 10);
    const courseOptions = courses.map((c) =>
        `<option value="${escapeHtml(c.code)}|${escapeHtml(c.title)}">${escapeHtml(c.code)} \u2014 ${escapeHtml(c.title)}</option>`
    ).join("") || '<option value="">\u2014 No courses mapped \u2014</option>';

    return /* html */`
    <form id="attendanceSessionForm" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs" autocomplete="off">
        <div class="sm:col-span-2">
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Course</label>
            <select id="attCourse" required class="w-full p-2 border rounded bg-white font-bold text-gray-800">
                <option value="">\u2014 Select course \u2014</option>
                ${courseOptions}
            </select>
        </div>
        <div>
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date</label>
            <input type="date" id="attDate" value="${today}" required
                class="w-full p-2 border rounded text-gray-800">
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Start</label>
                <input type="time" id="attStartTime" required class="w-full p-2 border rounded text-gray-800">
            </div>
            <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">End</label>
                <input type="time" id="attEndTime" required class="w-full p-2 border rounded text-gray-800">
            </div>
        </div>
        <button type="submit"
            class="portal-btn sm:col-span-2 bg-emerald-700 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-800 text-xs">
            <i class="fa-solid fa-plus mr-1"></i> Create Attendance Session
        </button>
    </form>`;
}

/**
 * Render the list of attendance sessions with expand/collapse.
 * @param {import("firebase/firestore").QuerySnapshot} snapshot
 * @param {HTMLElement} containerEl
 * @param {object} [opts]
 * @param {function} [opts.onMarkAttendance] - called with (sessionId, sessionData)
 * @param {function} [opts.onDeleteSession] - called with (sessionId)
 */
export function renderAttendanceSessionList(snapshot, containerEl, opts = {}) {
    if (!snapshot || snapshot.empty) {
        containerEl.innerHTML = '<p class="text-gray-400 text-xs text-center py-4">No attendance sessions created yet.</p>';
        return;
    }
    const sorted = [...snapshot.docs].sort((a, b) => {
        const da = a.data().date || "";
        const db = b.data().date || "";
        return db.localeCompare(da); // newest first
    });
    containerEl.innerHTML = sorted.map((docSnap) => {
        const d = docSnap.data();
        const id = docSnap.id;
        const dateLabel = d.date ? new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short", year: "numeric", month: "short", day: "numeric",
        }) : "N/A";
        return /* html */`
        <div class="border border-gray-200 rounded-lg bg-white overflow-hidden session-card" data-session-id="${escapeHtml(id)}">
            <div class="flex items-center justify-between p-3 bg-gray-50 cursor-pointer session-card__header"
                role="button" tabindex="0" aria-expanded="false"
                onclick="this.parentElement.classList.toggle('session-card--open'); this.setAttribute('aria-expanded', this.parentElement.classList.contains('session-card--open') ? 'true' : 'false')"
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="text-xs font-bold text-gray-700 truncate">${escapeHtml(d.courseCode || "")} \u2014 ${escapeHtml(d.courseTitle || "")}</span>
                    <span class="text-[10px] text-gray-400 shrink-0">${dateLabel}</span>
                    <span class="text-[10px] text-gray-400 shrink-0">${escapeHtml(d.startTime || "")}\u2013${escapeHtml(d.endTime || "")}</span>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <span class="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold session-card__record-count"></span>
                    <i class="fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform duration-200 session-card__chevron"></i>
                </div>
            </div>
            <div class="session-card__body hidden p-3 border-t border-gray-100 bg-white">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                    <button type="button" data-action="mark" data-session-id="${escapeHtml(id)}"
                        class="portal-btn text-[10px] font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                        <i class="fa-solid fa-user-check mr-1"></i> Mark Attendance
                    </button>
                    <button type="button" data-action="delete" data-session-id="${escapeHtml(id)}"
                        class="portal-btn text-[10px] font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200">
                        <i class="fa-solid fa-trash mr-1"></i> Delete
                    </button>
                </div>
                <div class="session-card__records text-xs text-gray-500">Loading records...</div>
            </div>
        </div>`;
    }).join("");

    // Attach event listeners for mark/delete buttons
    containerEl.querySelectorAll("[data-action='mark']").forEach((btn) => {
        btn.addEventListener("click", () => {
            const sessionId = btn.dataset.sessionId;
            const docSnap = snapshot.docs.find((d) => d.id === sessionId);
            if (docSnap && opts.onMarkAttendance) {
                opts.onMarkAttendance(sessionId, docSnap.data());
            }
        });
    });
    containerEl.querySelectorAll("[data-action='delete']").forEach((btn) => {
        btn.addEventListener("click", () => {
            const sessionId = btn.dataset.sessionId;
            if (opts.onDeleteSession && confirm("Delete this attendance session and all its records?")) {
                opts.onDeleteSession(sessionId);
            }
        });
    });
}

/**
 * Build the attendance marking UI for a given session.
 * @param {string} sessionId
 * @param {object} sessionData
 * @param {Array<{ uid: string, name: string, studentId: string }>} students
 * @param {Map<string, string>} existingRecords - studentUID -> status
 * @returns {string} HTML
 */
export function buildAttendanceMarkingUI(sessionId, sessionData, students, existingRecords) {
    if (!students || students.length === 0) {
        return '<p class="text-gray-400 text-xs text-center py-4">No students registered yet.</p>';
    }
    const rows = students.map((s) => {
        const currentStatus = existingRecords.get(s.studentId) || "present";
        const statusRadios = ATTENDANCE_STATUS.map((status) => `
            <label class="inline-flex items-center gap-1 cursor-pointer px-1.5 py-0.5 rounded-full text-[9px] font-bold transition-colors ${STATUS_META[status].color} ${currentStatus === status ? "ring-2 ring-offset-1 ring-emerald-500" : "opacity-60 hover:opacity-100"}">
                <input type="radio" name="att_${escapeHtml(s.studentId)}" value="${status}" ${currentStatus === status ? "checked" : ""}
                    class="sr-only" data-student="${escapeHtml(s.studentId)}" data-status="${status}">
                ${STATUS_META[status].icon} ${STATUS_META[status].label}
            </label>
        `).join("");
        return /* html */`
        <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-2 px-2 text-xs font-semibold text-gray-800">${escapeHtml(s.studentId)}</td>
            <td class="py-2 px-2 text-xs text-gray-700">${escapeHtml(s.name)}</td>
            <td class="py-2 px-2">
                <div class="flex flex-wrap gap-1">${statusRadios}</div>
            </td>
        </tr>`;
    }).join("");

    return /* html */`
    <div class="attendance-marking" data-session-id="${escapeHtml(sessionId)}">
        <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
                <p class="text-xs font-bold text-gray-800">${escapeHtml(sessionData.courseCode)} \u2014 ${escapeHtml(sessionData.courseTitle)}</p>
                <p class="text-[10px] text-gray-400">${escapeHtml(sessionData.date || "")} \u2022 ${escapeHtml(sessionData.startTime || "")}\u2013${escapeHtml(sessionData.endTime || "")}</p>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" id="attMarkAllPresent"
                    class="portal-btn text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
                    <i class="fa-solid fa-check-double mr-1"></i> All Present
                </button>
                <button type="button" id="attSaveAttendance"
                    class="portal-btn text-[10px] font-bold px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800">
                    <i class="fa-solid fa-floppy-disk mr-1"></i> Save Attendance
                </button>
            </div>
        </div>
        <div class="overflow-x-auto border rounded-lg">
            <table class="w-full text-left">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Student ID</th>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Name</th>
                        <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    </div>`;
}

/**
 * Collect attendance records from the marking UI.
 * @param {HTMLElement} containerEl - the attendance-marking container
 * @returns {Array<{ studentUID: string, status: string }>}
 */
export function collectAttendanceRecords(containerEl) {
    const radios = containerEl.querySelectorAll("input[type='radio']:checked");
    const records = [];
    radios.forEach((radio) => {
        records.push({
            studentUID: radio.dataset.student,
            status: radio.dataset.status,
        });
    });
    return records;
}

/**
 * Render attendance records for a session (read-only view).
 * @param {Array<{ studentUID: string, studentName: string, status: string }>} records
 * @returns {string} HTML
 */
export function renderAttendanceRecords(records) {
    if (!records || records.length === 0) {
        return '<p class="text-gray-400 text-xs text-center py-2">No attendance records yet.</p>';
    }
    const presentCount = records.filter((r) => r.status === "present").length;
    const total = records.length;
    const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    const summary = /* html */`
    <div class="flex items-center gap-3 mb-3 text-xs flex-wrap">
        <span class="font-bold text-gray-700">Summary:</span>
        <span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">${presentCount}/${total} present</span>
        <span class="text-gray-400">(${pct}%)</span>
    </div>`;

    const rows = records.map((r) => {
        const meta = STATUS_META[r.status] || STATUS_META.absent;
        return /* html */`
        <tr class="border-b border-gray-100">
            <td class="py-1.5 px-2 text-xs font-semibold text-gray-800">${escapeHtml(r.studentUID)}</td>
            <td class="py-1.5 px-2 text-xs text-gray-700">${escapeHtml(r.studentName)}</td>
            <td class="py-1.5 px-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${meta.color}">
                    ${meta.icon} ${meta.label}
                </span>
            </td>
        </tr>`;
    }).join("");

    return summary + /* html */`
    <div class="overflow-x-auto border rounded-lg">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b">
                <tr>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Student ID</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Name</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;
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
 * Render attendance report summary across all sessions.
 * @param {Map<string, Array<{ status: string, courseCode: string, courseTitle: string }>>} perStudentRecords
 * @returns {string} HTML
 */
export function renderAttendanceReport(perStudentRecords) {
    if (perStudentRecords.size === 0) {
        return '<p class="text-gray-400 text-xs text-center py-4">No attendance data available.</p>';
    }
    const rows = [];
    perStudentRecords.forEach((records, studentUID) => {
        const stats = computeAttendanceStats(records);
        const colorClass = stats.percent >= 75 ? "text-emerald-700" : stats.percent >= 50 ? "text-amber-700" : "text-red-700";
        const bgClass = stats.percent >= 75 ? "bg-emerald-100" : stats.percent >= 50 ? "bg-amber-100" : "bg-red-100";
        const studentName = records[0]?.studentName || studentUID;
        rows.push(/* html */`
        <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-2 px-2 text-xs font-semibold text-gray-800">${escapeHtml(studentUID)}</td>
            <td class="py-2 px-2 text-xs text-gray-700">${escapeHtml(studentName)}</td>
            <td class="py-2 px-2 text-xs text-gray-500">${stats.present}/${stats.total}</td>
            <td class="py-2 px-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${bgClass} ${colorClass}">
                    ${stats.percent}%
                </span>
            </td>
        </tr>`);
    });
    return /* html */`
    <div class="overflow-x-auto border rounded-lg">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b">
                <tr>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Student ID</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Name</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">Attendance</th>
                    <th class="py-2 px-2 text-[10px] font-bold text-gray-500 uppercase">%</th>
                </tr>
            </thead>
            <tbody>${rows.join("")}</tbody>
        </table>
    </div>`;
}

/**
 * Handle attendance session form submission.
 * @param {Event} e
 * @param {object} firestore
 * @param {*} firestore.db
 * @param {*} firestore.collection
 * @param {*} firestore.addDoc
 * @param {*} firestore.serverTimestamp
 * @param {string} adminUID
 * @param {string} adminName
 * @returns {Promise<void>}
 */
export async function handleAttendanceSessionSubmit(e, firestore, adminUID, adminName) {
    e.preventDefault();
    const form = e.target;
    const courseVal = form.querySelector("#attCourse").value;
    if (!courseVal) {
        alert("Please select a course.");
        return;
    }
    const [courseCode, courseTitle] = courseVal.split("|");
    const date = form.querySelector("#attDate").value;
    const startTime = form.querySelector("#attStartTime").value;
    const endTime = form.querySelector("#attEndTime").value;
    if (!date || !startTime || !endTime) {
        alert("Please fill all fields.");
        return;
    }
    try {
        await firestore.addDoc(firestore.collection(firestore.db, "attendance_sessions"), {
            courseCode,
            courseTitle,
            date,
            startTime,
            endTime,
            createdBy: adminUID,
            createdByName: adminName,
            createdAt: firestore.serverTimestamp ? firestore.serverTimestamp() : new Date().toISOString(),
        });
        form.reset();
        // Re-set date to today
        const dateEl = form.querySelector("#attDate");
        if (dateEl) dateEl.value = new Date().toISOString().slice(0, 10);
        alert("Attendance session created successfully!");
    } catch (err) {
        alert("Failed to create session: " + err.message);
    }
}

/**
 * Save attendance records for a session.
 * @param {string} sessionId
 * @param {Array<{ studentUID: string, status: string }>} records
 * @param {object} firestore
 * @param {*} firestore.db
 * @param {*} firestore.doc
 * @param {*} firestore.setDoc
 * @param {*} firestore.collection
 * @param {*} firestore.getDocs
 * @param {*} firestore.query
 * @param {*} firestore.where
 * @param {string} adminUID
 * @returns {Promise<void>}
 */
export async function saveAttendanceRecords(sessionId, records, firestore, adminUID) {
    if (!records || records.length === 0) {
        alert("No attendance records to save.");
        return;
    }
    try {
        const { db, doc, setDoc, collection, getDocs, query, where } = firestore;
        // Get student names from users collection
        const uids = records.map((r) => r.studentUID);
        const userSnap = await getDocs(query(collection(db, "users"), where("uid", "in", uids)));
        const nameMap = new Map();
        userSnap.forEach((d) => {
            const data = d.data();
            nameMap.set(data.uid || d.id, data.name || data.uid || d.id);
        });

        const batch = [];
        for (const record of records) {
            const ref = doc(collection(db, "attendance_records"));
            batch.push(setDoc(ref, {
                sessionId,
                studentUID: record.studentUID,
                studentName: nameMap.get(record.studentUID) || record.studentUID,
                status: record.status,
                markedAt: new Date().toISOString(),
                markedBy: adminUID,
            }));
        }
        await Promise.all(batch);
        alert("Attendance saved successfully!");
    } catch (err) {
        alert("Failed to save attendance: " + err.message);
    }
}

/**
 * Delete an attendance session and all its records.
 * @param {string} sessionId
 * @param {object} firestore
 * @param {*} firestore.db
 * @param {*} firestore.doc
 * @param {*} firestore.deleteDoc
 * @param {*} firestore.collection
 * @param {*} firestore.getDocs
 * @param {*} firestore.query
 * @param {*} firestore.where
 * @returns {Promise<void>}
 */
export async function deleteAttendanceSession(sessionId, firestore) {
    try {
        const { db, doc, deleteDoc, collection, getDocs, query, where } = firestore;
        // Delete all records for this session
        const recordsSnap = await getDocs(query(collection(db, "attendance_records"), where("sessionId", "==", sessionId)));
        const deletePromises = recordsSnap.docs.map((d) => deleteDoc(doc(db, "attendance_records", d.id)));
        deletePromises.push(deleteDoc(doc(db, "attendance_sessions", sessionId)));
        await Promise.all(deletePromises);
        alert("Session and all records deleted.");
    } catch (err) {
        alert("Failed to delete session: " + err.message);
    }
}