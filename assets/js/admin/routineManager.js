// assets/js/admin/routineManager.js
// Routine CRUD, tabbed view, and edit modal for admin dashboard

/**
 * Format 24h time string to 12-hour AM/PM.
 * @param {string} timeString - "HH:MM"
 * @returns {string} eg "09:30 AM"
 */
export function formatTimeTo12Hour(timeString) {
    if (!timeString) return "";
    const [hourString, minute] = timeString.split(":");
    let hour = parseInt(hourString);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    const hourFormatted = hour < 10 ? "0" + hour : hour;
    return `${hourFormatted}:${minute} ${ampm}`;
}

/**
 * Parse routine start time to minutes for sorting.
 * @param {Object} data - routine document data
 * @returns {number}
 */
export function routineStartMinutes(data) {
    if (data.rawStartTime) {
        const parts = String(data.rawStartTime).split(":");
        return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
    }
    const m = String(data.timeSlot || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return 9999;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10) || 0;
    const ap = (m[3] || "").toUpperCase();
    if (ap === "PM" && h < 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return h * 60 + min;
}

/**
 * Sort comparator for routines.
 * @param {Object} a - routine data
 * @param {Object} b - routine data
 * @returns {number}
 */
export function compareRoutineByTime(a, b) {
    const diff = routineStartMinutes(a) - routineStartMinutes(b);
    return diff !== 0 ? diff : String(a.subject || "").localeCompare(String(b.subject || ""));
}

/** Ordered list of routine tab keys. */
export const ROUTINE_TAB_ORDER = [
    "Daily",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Friday",
    "Unassigned",
];

/**
 * Determine which tab a routine belongs to.
 * @param {Object} data - routine data
 * @returns {string} tab key
 */
export function routineTabKey(data) {
    if (data.boardType === "daily") return "Daily";
    if (data.classDay && data.classDay !== "N/A") return data.classDay;
    return "Unassigned";
}

/**
 * Render a single routine card HTML.
 * @param {Object} res - Firestore QueryDocumentSnapshot
 * @returns {string} HTML
 */
export function renderRoutineCard(res) {
    const data = res.data();
    const id = res.id;
    const isDaily = data.boardType === "daily";
    const tagColor = isDaily
        ? "bg-amber-100 text-amber-800 border-amber-300"
        : "bg-emerald-100 text-emerald-800 border-emerald-300";
    const tagLabel = isDaily
        ? (data.routineDate ? `📅 Daily (${data.routineDate})` : "Daily")
        : "Permanent";
    const genderTag = data.gender ? ` | ${data.gender}` : "";
    const timeInfo = data.timeSlot ? ` | ${data.timeSlot}` : "";
    const dataJson = JSON.stringify(data).replace(/"/g, "\x26quot;");
    return (
        `<div class="p-2.5 bg-slate-50 border rounded-lg flex flex-col gap-1.5 shadow-sm">` +
        `<div class="flex justify-between items-start gap-2">` +
        `<div class="min-w-0">` +
        `<p class="font-bold text-gray-800">${data.subject} (${data.courseCode})</p>` +
        `<p class="text-[10px] text-gray-400">Room: ${data.room} | Batch: ${data.batchNumber}${genderTag}${timeInfo}</p>` +
        `</div>` +
        `<span class="text-[9px] font-bold px-1.5 py-0.5 border rounded shrink-0 ${tagColor}">${tagLabel}</span>` +
        `</div>` +
        `<div class="flex justify-end space-x-1 gap-1">` +
        `<button onclick="openRoutineEditModal('${id}', ${dataJson})" class="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-2 py-0.5 rounded transition text-[10px] font-semibold"><i class="fa-solid fa-pen"></i> Edit</button>` +
        `<button onclick="deleteDataDocument('routines', '${id}')" class="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2 py-0.5 rounded transition text-[10px] font-semibold"><i class="fa-solid fa-trash"></i> Delete</button>` +
        `</div>` +
        `</div>`
    );
}

/**
 * Render the routine tab bar with counts.
 * @param {Object} groups - { [tabKey]: QueryDocumentSnapshot[] }
 * @param {string} activeRoutineTab - current active tab
 * @param {HTMLElement} tabsEl - container element
 * @param {Function} onTabChange - callback(activeRoutineTab)
 * @returns {string} updated activeRoutineTab
 */
export function renderRoutineTabBar(groups, activeRoutineTab, tabsEl, onTabChange) {
    const tabsWithItems = ROUTINE_TAB_ORDER.filter((key) => (groups[key] || []).length > 0);
    if (!tabsWithItems.includes(activeRoutineTab)) {
        activeRoutineTab = tabsWithItems[0] || "Saturday";
    }

    tabsEl.innerHTML = ROUTINE_TAB_ORDER.map((key) => {
        const count = (groups[key] || []).length;
        if (!count) return "";
        const active = key === activeRoutineTab;
        return (
            `<button type="button" data-routine-tab="${key}"` +
            ` class="routine-tab-btn px-2 py-1 rounded-md text-[10px] font-bold border transition ` +
            `${active ? "bg-emerald-700 text-white border-emerald-800" : "bg-white text-gray-600 border-gray-200 hover:bg-emerald-50"}">` +
            `${key} <span class="opacity-80">(${count})</span></button>`
        );
    }).join("");

    tabsEl.querySelectorAll(".routine-tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const newTab = btn.dataset.routineTab;
            onTabChange(newTab);
        });
    });

    return activeRoutineTab;
}

/**
 * Render routine list for the active tab.
 * @param {Object} groups - grouped routines
 * @param {string} activeRoutineTab
 * @param {HTMLElement} listEl - target container
 */
export function renderRoutineListForTab(groups, activeRoutineTab, listEl) {
    const items = groups[activeRoutineTab] || [];
    listEl.innerHTML = items.length
        ? items.map(renderRoutineCard).join("")
        : `<p class="text-gray-400 text-center py-4">No routines in "${activeRoutineTab}".</p>`;
}

/**
 * Build the edit modal form HTML for a routine.
 * @param {string} id - routine doc ID
 * @param {Object} data - routine data
 * @returns {string} innerHTML for modalFormContainer
 */
export function buildRoutineEditForm(id, data) {
    const esc = (s) => String(s || "").replace(/"/g, "\x26quot;");
    const isDaily = data.boardType === "daily";
    return (
        `<div class="grid grid-cols-2 gap-2 text-xs">` +
        `<div><label class="font-bold text-gray-600">Subject Name</label><input type="text" id="m_routine_sub" value="${esc(data.subject)}" class="w-full p-2 border rounded" list="routineSubjectDatalist" autocomplete="off"><select id="m_subjectVariant" class="hidden p-2 border rounded w-full mt-1 text-[11px] bg-amber-50 border-amber-300" aria-label="Select variant"><option value="">— Select Code / Teacher —</option></select></div>` +
        `<div><label class="font-bold text-gray-600">Course Code</label><input type="text" id="m_routine_code" value="${esc(data.courseCode)}" class="w-full p-2 border rounded"></div>` +
        `<div><label class="font-bold text-gray-600">Room No</label><input type="text" id="m_routine_room" value="${esc(data.room)}" class="w-full p-2 border rounded"></div>` +
        `<div><label class="font-bold text-gray-600">Batch Number</label><input type="text" id="m_routine_batch" value="${esc(data.batchNumber)}" class="w-full p-2 border rounded"></div>` +
        `<div><label class="font-bold text-gray-600">Teacher Code</label><input type="text" id="m_routine_teacher" value="${esc(data.teacherCode)}" class="w-full p-2 border rounded"></div>` +
        `<div>` +
        `<label class="font-bold text-gray-600">Section</label>` +
        `<select id="m_routine_gender" class="w-full p-2 border rounded bg-white">` +
        `<option value="Male" ${data.gender === "Male" ? "selected" : ""}>Male</option>` +
        `<option value="Female" ${data.gender === "Female" ? "selected" : ""}>Female</option>` +
        `<option value="Combined" ${data.gender === "Combined" ? "selected" : ""}>Combined</option>` +
        `</select></div>` +
        `<div>` +
        `<label class="font-bold text-gray-600">Routine Type</label>` +
        `<select id="m_routine_board" class="w-full p-2 border rounded bg-white">` +
        `<option value="daily" ${isDaily ? "selected" : ""}>Daily Adjustment</option>` +
        `<option value="permanent" ${!isDaily ? "selected" : ""}>Permanent Board</option>` +
        `</select></div>` +
        `<div>` +
        `<label class="font-bold text-gray-600">Class Day</label>` +
        `<select id="m_routine_day" class="w-full p-2 border rounded bg-white"${isDaily ? ' style="display:none"' : ""}>` +
        `<option value="N/A" ${data.classDay === "N/A" ? "selected" : ""}>Not Applicable</option>` +
        `<option value="Saturday" ${data.classDay === "Saturday" ? "selected" : ""}>Saturday</option>` +
        `<option value="Sunday" ${data.classDay === "Sunday" ? "selected" : ""}>Sunday</option>` +
        `<option value="Monday" ${data.classDay === "Monday" ? "selected" : ""}>Monday</option>` +
        `<option value="Tuesday" ${data.classDay === "Tuesday" ? "selected" : ""}>Tuesday</option>` +
        `<option value="Wednesday" ${data.classDay === "Wednesday" ? "selected" : ""}>Wednesday</option>` +
        `<option value="Friday" ${data.classDay === "Friday" ? "selected" : ""}>Friday</option>` +
        `</select></div>` +
        `<div${isDaily ? "" : ` style="display:none"`}><label class="font-bold text-gray-600">📅 Routine Date</label><input type="date" id="m_routine_date" value="${data.routineDate || ""}" class="w-full p-2 border rounded"></div>` +
        `<div><label class="font-bold text-gray-600">Starts</label><input type="time" id="m_routine_start" value="${data.rawStartTime || ""}" class="w-full p-2 border rounded"></div>` +
        `<div><label class="font-bold text-gray-600">Ends</label><input type="time" id="m_routine_end" value="${data.rawEndTime || ""}" class="w-full p-2 border rounded"></div>` +
        `</div>`
    );
}

/**
 * Save edited routine to Firestore.
 * @param {string} activeEditId
 * @param {Object} db - Firestore db
 * @param {Function} doc, updateDoc - Firestore helpers
 * @returns {Promise<void>}
 */
export async function saveRoutineEdit(activeEditId, db, doc, updateDoc) {
    const sTime = document.getElementById("m_routine_start").value;
    const eTime = document.getElementById("m_routine_end").value;
    const boardType = document.getElementById("m_routine_board").value;
    const classDay = document.getElementById("m_routine_day").value;

    if (boardType === "permanent" && classDay === "N/A") {
        alert("Permanent schedule requires a class day (Saturday–Friday).");
        return;
    }

    const routineDateEl = document.getElementById("m_routine_date");
    await updateDoc(doc(db, "routines", activeEditId), {
        subject: document.getElementById("m_routine_sub").value.trim(),
        courseCode: document.getElementById("m_routine_code").value.trim(),
        room: document.getElementById("m_routine_room").value.trim(),
        batchNumber: document.getElementById("m_routine_batch").value.trim(),
        teacherCode: document.getElementById("m_routine_teacher").value.trim(),
        gender: document.getElementById("m_routine_gender").value,
        boardType,
        classDay,
        routineDate: boardType === "daily" && routineDateEl ? routineDateEl.value : null,
        rawStartTime: sTime,
        rawEndTime: eTime,
        timeSlot: `${formatTimeTo12Hour(sTime)} - ${formatTimeTo12Hour(eTime)}`,
    });
    alert("Routine updated successfully!");
}

/**
 * Submit handler for the routine creation form.
 * @param {Event} e
 * @param {Object} db - Firestore db
 * @param {Function} collection, addDoc - Firestore helpers
 * @param {Function} showToast - Toast notification function
 * @param {Function} t - i18n translator function
 * @returns {Promise<void>}
 */
export async function handleRoutineFormSubmit(e, db, collection, addDoc, showToast, t) {
    e.preventDefault();
    const boardType = document.getElementById("boardType").value;
    const classDay = document.getElementById("classDay").value;

    if (boardType === "permanent" && classDay === "N/A") {
        showToast(t("routinePermDayError"), "warning");
        return;
    }

    const sTime = document.getElementById("startTime").value;
    const eTime = document.getElementById("endTime").value;
    const btn = e.target.querySelector("button[type='submit']");
    if (btn) btn.classList.add("portal-btn--loading");

    try {
        const routineDateEl = document.getElementById("routineDate");
        await addDoc(collection(db, "routines"), {
            subject: document.getElementById("subject").value.trim(),
            courseCode: document.getElementById("courseCode").value.trim(),
            room: document.getElementById("room").value.trim(),
            batchNumber: document.getElementById("batchNumber").value.trim(),
            teacherCode: document.getElementById("teacherCode").value.trim(),
            classDay: document.getElementById("classDay").value,
            rawStartTime: sTime,
            rawEndTime: eTime,
            timeSlot: `${formatTimeTo12Hour(sTime)} - ${formatTimeTo12Hour(eTime)}`,
            gender: document.getElementById("gender").value,
            boardType: document.getElementById("boardType").value,
            routineDate: boardType === "daily" && routineDateEl ? routineDateEl.value : null,
            createdAt: new Date().toISOString(),
        });
        showToast(t("routinePublished"), "success");
        document.getElementById("routineForm").reset();
    } catch (err) {
        showToast(t("routinePublishFailed") + err.message, "error");
    } finally {
        if (btn) btn.classList.remove("portal-btn--loading");
    }
}