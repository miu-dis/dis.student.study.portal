// assets/js/portal/routines.js
// Routine and notice board real-time rendering for student portal

/**
 * Get today's date in Bangladesh timezone (Asia/Dhaka, UTC+6).
 * @returns {string} ISO date string "YYYY-MM-DD"
 */
export function getBangladeshToday() {
    const now = new Date();
    const bd = new Date(now.getTime() + (6 * 60 * 60 * 1000)); // UTC+6
    const yyyy = bd.getFullYear();
    const mm = String(bd.getMonth() + 1).padStart(2, "0");
    const dd = String(bd.getDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
}

/**
 * Parse routine start time into minutes since midnight for sorting.
 * Supports both rawStartTime and legacy timeSlot strings.
 * @param {Object} data - routine document data
 * @returns {number} minutes since midnight (9999 = unparseable)
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
 * Sort comparator: by start time ascending, then by subject name.
 * @param {Object} a - first routine data
 * @param {Object} b - second routine data
 * @returns {number} comparison result
 */
export function compareRoutineByTime(a, b) {
    const diff = routineStartMinutes(a) - routineStartMinutes(b);
    return diff !== 0 ? diff : String(a.subject || "").localeCompare(String(b.subject || ""));
}

/**
 * Build HTML markup for a single routine card.
 * @param {Object} data - routine document data
 * @param {Function} t - translator function (portalT)
 * @param {Function} esc - HTML escape function
 * @returns {string} HTML string
 */
export function buildRoutineCardHTML(data, t, esc) {
    const genderBadge =
        data.gender === "Male"
            ? { label: t("genderMale"), cls: "bg-blue-100 text-blue-700" }
            : data.gender === "Female"
                ? { label: t("genderFemale"), cls: "bg-pink-100 text-pink-700" }
                : { label: t("genderCombined"), cls: "bg-purple-100 text-purple-700" };

    const dateLabel = data.routineDate
        ? `<div class="text-[10px] text-emerald-600 font-semibold mb-1">📅 ${esc(data.routineDate)}</div>`
        : "";

    return (
        `<div class="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-xs">` +
        `<div class="flex justify-between items-center mb-0.5">` +
        `<h5 class="font-extrabold text-emerald-800 text-sm">${esc(data.subject)}</h5>` +
        `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${genderBadge.cls}">${genderBadge.label}</span>` +
        `</div>` +
        `<div class="mb-1 text-[11px] text-amber-700 font-bold">Batch: ${esc(data.batchNumber)}</div>` +
        dateLabel +
        `<div class="grid grid-cols-2 text-[11px] text-gray-600 gap-y-0.5 border-t border-dashed pt-1 mt-1">` +
        `<p><b>Code:</b> ${esc(data.courseCode)}</p>` +
        `<p><b>Room:</b> ${esc(data.room)}</p>` +
        `<p class="text-emerald-700 font-bold col-span-2"><b>Teacher:</b> ${esc(data.teacherCode)}</p>` +
        `<p class="font-bold text-slate-700 col-span-2 mt-0.5"><i class="fa-regular fa-clock mr-1"></i>${esc(data.timeSlot)}</p>` +
        `</div></div>`
    );
}

/**
 * Initialize Firestore real-time listeners for routines and notices.
 * Returns a cleanup function to unsubscribe all listeners.
 *
 * @param {Object} firestore - { db, collection, onSnapshot, query, orderBy }
 * @param {Function} formatNoticeContent - notice content formatter
 * @param {HTMLElement} dailyContainer - daily routine list container
 * @param {HTMLElement} noticeContainer - notice list container
 * @param {Object} daysWithClasses - mutable tracker: { Saturday: bool, ... }
 * @param {Function} getPortalT - returns current translator function
 * @param {Function} esc - HTML escape function
 * @returns {Function} cleanup – call to unsubscribe both listeners
 */
export function initRoutineAndNoticeListeners(
    firestore,
    formatNoticeContent,
    dailyContainer,
    noticeContainer,
    daysWithClasses,
    getPortalT,
    esc
) {
    const { db, collection, onSnapshot, query, orderBy } = firestore;

    const unsubRoutine = onSnapshot(
        query(collection(db, "routines"), orderBy("createdAt", "desc")),
        (snapshot) => {
            const t = getPortalT();
            const todayBD = getBangladeshToday();
            const dailyRoutines = [];
            const permanentByDay = {};
            Object.keys(daysWithClasses).forEach((day) => {
                permanentByDay[day] = [];
            });

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.boardType === "daily") {
                    if (data.routineDate === todayBD) {
                        dailyRoutines.push(data);
                    }
                } else if (
                    data.boardType === "permanent" &&
                    data.classDay &&
                    data.classDay !== "N/A" &&
                    permanentByDay[data.classDay]
                ) {
                    permanentByDay[data.classDay].push(data);
                }
            });

            dailyRoutines.sort(compareRoutineByTime);
            dailyContainer.innerHTML = dailyRoutines.length
                ? dailyRoutines.map((d) => buildRoutineCardHTML(d, t, esc)).join("")
                : `<p class="text-xs text-gray-400 col-span-2 p-2">${t("noClasses")}</p>`;

            Object.keys(daysWithClasses).forEach((day) => {
                const el = document.getElementById(`day-${day}`);
                if (!el) return;
                const items = permanentByDay[day].sort(compareRoutineByTime);
                if (items.length) {
                    el.innerHTML = items
                        .map((d) => buildRoutineCardHTML(d, t, esc))
                        .join("");
                    daysWithClasses[day] = true;
                } else {
                    el.innerHTML = `<p class="text-xs text-gray-400 text-center py-2 bg-white/40 border border-dashed rounded-lg">${t("noClasses")}</p>`;
                    daysWithClasses[day] = false;
                }
            });
        }
    );

    const unsubNotice = onSnapshot(
        query(collection(db, "notices"), orderBy("createdAt", "desc")),
        (snapshot) => {
            noticeContainer.innerHTML = "";
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                noticeContainer.innerHTML +=
                    `<div class="p-2.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg shadow-sm text-xs">` +
                    `<p class="font-medium text-gray-800 leading-relaxed break-words">${formatNoticeContent(data.content)}</p>` +
                    `</div>`;
            });
        }
    );

    return () => {
        unsubRoutine();
        unsubNotice();
    };
}