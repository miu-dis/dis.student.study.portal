// assets/js/admin/courseMapper.js
// Course mapping CRUD and semester dropdown view for admin dashboard
import { buildTrimesterKey } from "../academicTerms.js";

/**
 * Build HTML for a single course mapping card.
 * @param {string} docKey - Firestore doc ID (semester key)
 * @param {number} index - course index in array
 * @param {Object} course - { code, title, teacher }
 * @returns {string} HTML
 */
export function buildMappingCard(docKey, index, course) {
    const courseJson = JSON.stringify(course).replace(/"/g, "\x26quot;");
    const escKey = docKey.replace(/'/g, "\\'");
    return (
        `<div class="p-2 bg-indigo-50/50 border border-indigo-100 rounded-lg flex justify-between items-center">` +
        `<div class="max-w-[70%]">` +
        `<p class="font-bold text-indigo-950">${course.code}: ${course.title}</p>` +
        `<p class="text-[9px] text-gray-400 truncate">Sem: ${docKey} | Tch: ${course.teacher}</p>` +
        `</div>` +
        `<div class="flex space-x-1 shrink-0 gap-1">` +
        `<button onclick="openCourseEditModal('${escKey}', ${index}, ${courseJson})" class="text-blue-600 bg-white border border-blue-200 hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded text-[10px] font-semibold" aria-label="Edit course"><i class="fa-solid fa-pen"></i></button>` +
        `<button onclick="deleteCourseMappingEntry('${escKey}', ${index})" class="text-red-600 bg-white border border-red-200 hover:bg-red-600 hover:text-white px-1.5 py-0.5 rounded text-[10px] font-semibold" aria-label="Delete course"><i class="fa-solid fa-trash"></i></button>` +
        `</div>` +
        `</div>`
    );
}

/**
 * Render the semester dropdown for course mapping filter.
 * @param {Object} groups - { [semesterKey]: [{ docKey, index, course }] }
 * @param {string} activeMappingTab - current selected key or "__all__"
 * @param {HTMLElement} mappingSelectEl - select element
 * @param {boolean} wired - whether change listener is already bound
 * @param {Function} onMappingTabChange - callback(newTab)
 * @returns {boolean} updated wired flag
 */
export function renderMappingDropdown(groups, activeMappingTab, mappingSelectEl, wired, onMappingTabChange) {
    const tabKeys = Object.keys(groups).filter((k) => groups[k].length > 0).sort();
    const allCount = tabKeys.reduce((sum, k) => sum + groups[k].length, 0);
    let html = `<option value="__all__">📋 All Courses (${allCount})</option>`;
    tabKeys.forEach((key) => {
        const count = groups[key].length;
        const sel = key === activeMappingTab ? " selected" : "";
        html += `<option value="${key.replace(/"/g, "\x26quot;")}"${sel}>📘 ${key} (${count})</option>`;
    });
    mappingSelectEl.innerHTML = html;

    if (!wired) {
        wired = true;
        mappingSelectEl.addEventListener("change", () => {
            onMappingTabChange(mappingSelectEl.value);
        });
    }
    return wired;
}

/**
 * Render the mapping list for the active tab.
 * @param {Object} groups
 * @param {string} activeMappingTab
 * @param {HTMLElement} listEl - target container
 */
export function renderMappingListForTab(groups, activeMappingTab, listEl) {
    if (activeMappingTab === "__all__") {
        const allCards = [];
        Object.keys(groups).sort().forEach((key) => {
            if (groups[key].length > 0) {
                allCards.push(
                    `<div class="text-[10px] font-bold text-indigo-600 bg-indigo-50/80 p-1.5 rounded mt-1 first:mt-0">${key}</div>`
                );
                groups[key].forEach((item) =>
                    allCards.push(buildMappingCard(item.docKey, item.index, item.course))
                );
            }
        });
        listEl.innerHTML =
            allCards.join("") || '<p class="text-gray-400 text-center py-2">No courses in mappings.</p>';
    } else {
        const items = groups[activeMappingTab] || [];
        listEl.innerHTML = items.length
            ? items.map((item) => buildMappingCard(item.docKey, item.index, item.course)).join("")
            : '<p class="text-gray-400 text-center py-2">No courses in this semester.</p>';
    }
}

/**
 * Handle course map form submission (create new mapping).
 * @param {Event} e
 * @param {Object} db - Firestore db
 * @param {Function} { doc, getDoc, setDoc, updateDoc, arrayUnion } - Firestore helpers
 * @param {Function} showToast - Toast notification function
 * @param {Function} t - i18n translator function
 * @returns {Promise<void>}
 */
export async function handleCourseMapSubmit(e, db, { doc, getDoc, setDoc, updateDoc, arrayUnion }, showToast, t) {
    e.preventDefault();
    const yr = document.getElementById("mapYear").value;
    const termNum = document.getElementById("mapTermNum").value;
    const term = document.getElementById("mapTerm").value;
    const sessYear = document.getElementById("mapSessYear").value;
    const key = buildTrimesterKey(yr, termNum, term, sessYear);

    const payload = {
        code: document.getElementById("mapCourseCode").value.trim().toUpperCase(),
        title: document.getElementById("mapCourseTitle").value.trim(),
        teacher: document.getElementById("mapCourseTeacher").value.trim(),
    };

    if (!payload.code || !payload.title || !payload.teacher) {
        showToast(t("mapFieldsRequired"), "warning");
        return;
    }

    const btn = e.target.querySelector("button[type='submit']");
    if (btn) btn.classList.add("portal-btn--loading");

    try {
        const docRef = doc(db, "course_mappings", key);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            await updateDoc(docRef, { courses: arrayUnion(payload) });
        } else {
            await setDoc(docRef, { courses: [payload] });
        }
        showToast(t("mapSuccess") + " (" + key + ")", "success");
        document.getElementById("courseMapForm").reset();
    } catch (err) {
        showToast(t("mapFailed") + err.message, "error");
    } finally {
        if (btn) btn.classList.remove("portal-btn--loading");
    }
}

/**
 * Build the course edit modal form.
 * @param {string} docKey - semester key
 * @param {number} index - course index
 * @param {Object} course - { code, title, teacher }
 * @returns {string} innerHTML
 */
export function buildCourseEditForm(docKey, index, course) {
    const esc = (s) => String(s || "").replace(/"/g, "\x26quot;");
    return (
        `<div class="space-y-3 text-xs">` +
        `<p class="font-bold text-indigo-800">Editing Course inside: ${docKey}</p>` +
        `<div><label class="font-bold text-gray-600">Course Code</label><input type="text" id="m_course_code" value="${esc(course.code)}" class="w-full p-2 border rounded"></div>` +
        `<div><label class="font-bold text-gray-600">Course Full Title</label><input type="text" id="m_course_title" value="${esc(course.title)}" class="w-full p-2 border rounded"></div>` +
        `<div><label class="font-bold text-gray-600">Assigned Faculty Teacher</label><input type="text" id="m_course_teacher" value="${esc(course.teacher)}" class="w-full p-2 border rounded"></div>` +
        `</div>`
    );
}

/**
 * Save course edit.
 * @param {string} activeMapDocKey
 * @param {number} activeMapIndex
 * @param {Object} db
 * @param {Function} { doc, getDoc, updateDoc }
 * @returns {Promise<void>}
 */
export async function saveCourseEdit(activeMapDocKey, activeMapIndex, db, { doc, getDoc, updateDoc }) {
    const docRef = doc(db, "course_mappings", activeMapDocKey);
    const mapDoc = await getDoc(docRef);
    if (mapDoc.exists()) {
        const courses = mapDoc.data().courses || [];
        courses[activeMapIndex] = {
            code: document.getElementById("m_course_code").value.trim().toUpperCase(),
            title: document.getElementById("m_course_title").value.trim(),
            teacher: document.getElementById("m_course_teacher").value.trim(),
        };
        await updateDoc(docRef, { courses });
        alert("Course Matrix updated successfully!");
    }
}

/**
 * Delete a specific course from a mapping.
 * @param {string} docKey
 * @param {number} index
 * @param {Object} db
 * @param {Function} { doc, getDoc, updateDoc }
 * @returns {Promise<void>}
 */
export async function deleteCourseMappingEntry(docKey, index, db, { doc, getDoc, updateDoc }) {
    if (!confirm("Are you sure you want to delete this course mapping entry?")) return;
    try {
        const mapDoc = await getDoc(doc(db, "course_mappings", docKey));
        if (mapDoc.exists()) {
            let courses = mapDoc.data().courses || [];
            courses.splice(index, 1);
            await updateDoc(doc(db, "course_mappings", docKey), { courses });
            alert("Mapping element deleted successfully!");
        }
    } catch (err) {
        alert(err.message);
    }
}