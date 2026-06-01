// ─── Resource Manager Module (admin) ───
// Extracted from admin-dashboard.html — admin resource list, edit modal, delete
// Dependency injection: Firestore + fileStorage functions passed as arguments

/**
 * Escape HTML entities.
 * @param {string} s
 * @returns {string}
 */
function esc(s) {
    return String(s || "")
        .replace(/&/g, "\x26amp;")
        .replace(/</g, "\x26lt;")
        .replace(/"/g, "\x26quot;");
}

/**
 * Check if a resource has a viewable file/link.
 * @param {object} d - resource data
 * @returns {boolean}
 */
function canView(d) {
    if (d.urlType === "external") {
        const u = (d.url || "").trim();
        return u.startsWith("http") || u.startsWith("data:");
    }
    return Boolean(d.storagePath) || (d.url || "").trim().startsWith("http");
}

/**
 * Render the admin resource list from a Firestore snapshot.
 * @param {object} snapshot - Firestore QuerySnapshot of "resources"
 * @param {HTMLElement} containerEl - e.g. document.getElementById("adminResourceList")
 * @param {HTMLElement} countEl - e.g. document.getElementById("resourceAdminCount")
 */
export function renderAdminResourceList(snapshot, containerEl, countEl) {
    countEl.innerText = snapshot.size;
    if (snapshot.empty) {
        containerEl.innerHTML =
            '<p class="text-gray-400 text-center py-4">No student resources uploaded yet.</p>';
        return;
    }
    containerEl.innerHTML = snapshot.docs
        .map((res) => {
            const d = res.data();
            const payload = encodeURIComponent(JSON.stringify({ ...d, id: res.id }));
            return `
                <div class="p-2.5 bg-purple-50/40 border border-purple-100 rounded-lg">
                    <div class="flex justify-between gap-2 items-start">
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-gray-800 break-words">${esc(d.title || "Untitled")}</p>
                            <p class="text-[9px] text-gray-500 mt-0.5">${esc(d.courseCode || "N/A")} | ${esc(d.semester || "N/A")}</p>
                            <p class="text-[9px] text-gray-400">By: ${esc(d.author || "Unknown")} | ${esc(d.type || "File")}</p>
                        </div>
                        <div class="flex flex-col gap-1 shrink-0">
                            ${canView(d)
                    ? `<button type="button" data-admin-view-resource="${res.id}" data-resource-payload="${payload}" class="text-[9px] px-2 py-0.5 rounded bg-white border text-indigo-700 text-center font-bold">View</button>`
                    : `<span class="text-[9px] px-2 py-0.5 rounded bg-gray-100 border text-red-600 text-center">No file</span>`
                }
                            <button type="button" data-admin-edit-resource="${res.id}" data-resource-payload="${payload}" class="text-[9px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">Edit</button>
                            <button type="button" data-admin-delete-resource="${res.id}" class="text-[9px] px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">Delete</button>
                        </div>
                    </div>
                </div>`;
        })
        .join("");
}

/**
 * Handle clicks on the admin resource list (view / edit / delete buttons).
 * @param {Event} e
 * @param {object} firestore - { db, doc, getDoc, deleteDoc }
 * @param {object} fileStorage - { openResourceFile, deletePortalFile }
 * @param {function} onEdit - callback(id, data) to open edit modal
 */
export async function handleAdminResourceClick(e, firestore, fileStorage, onEdit) {
    const { db, doc, getDoc, deleteDoc } = firestore;
    const { openResourceFile, deletePortalFile } = fileStorage;

    const viewBtn = e.target.closest("[data-admin-view-resource]");
    if (viewBtn) {
        e.preventDefault();
        try {
            const data = JSON.parse(decodeURIComponent(viewBtn.dataset.resourcePayload));
            const ok = await openResourceFile(data);
            if (!ok)
                alert(
                    "ফাইল খোলা যায়নি। Supabase Storage বা পুরনো ভাঙা আপলোড — মুছে আবার আপলোড করুন।"
                );
        } catch (err) {
            alert(err.message);
        }
        return;
    }

    const editBtn = e.target.closest("[data-admin-edit-resource]");
    if (editBtn) {
        try {
            const data = JSON.parse(decodeURIComponent(editBtn.dataset.resourcePayload));
            if (onEdit) onEdit(editBtn.dataset.adminEditResource, data);
        } catch (err) {
            alert("Could not open editor: " + err.message);
        }
        return;
    }

    const delBtn = e.target.closest("[data-admin-delete-resource]");
    if (delBtn) {
        const id = delBtn.dataset.adminDeleteResource;
        if (!confirm("Delete this student resource permanently?")) return;
        try {
            const snap = await getDoc(doc(db, "resources", id));
            if (
                snap.exists() &&
                snap.data().storagePath &&
                snap.data().urlType !== "external"
            ) {
                await deletePortalFile(snap.data().storagePath);
            }
            await deleteDoc(doc(db, "resources", id));
            alert("Resource deleted!");
        } catch (err) {
            alert(err.message);
        }
    }
}

/**
 * Build the resource edit modal form HTML.
 * @param {string} id - resource document ID
 * @param {object} data - resource data
 * @returns {string} HTML for modalFormContainer
 */
export function buildResourceEditForm(id, data) {
    const safeUrl = (data.url || "").replace(/"/g, "\x26quot;");
    const safeTitle = (data.title || "").replace(/"/g, "\x26quot;");
    const safeAuthor = (data.author || "").replace(/"/g, "\x26quot;");
    return `
        <div class="space-y-3 text-xs">
            <p class="font-bold text-purple-800">Resource ID: ${String(id).replace(/</g, "\x26lt;")}</p>
            <div><label class="font-bold text-gray-600">Title</label><input type="text" id="m_res_title" value="${safeTitle}" class="w-full p-2 border rounded"></div>
            <div><label class="font-bold text-gray-600">Contributor</label><input type="text" id="m_res_author" value="${safeAuthor}" class="w-full p-2 border rounded"></div>
            <div><label class="font-bold text-gray-600">Course Code</label><input type="text" id="m_res_code" value="${data.courseCode || ""}" class="w-full p-2 border rounded"></div>
            <div><label class="font-bold text-gray-600">Semester Key</label><input type="text" id="m_res_sem" value="${data.semester || ""}" class="w-full p-2 border rounded"></div>
            <div><label class="font-bold text-gray-600">Type</label>
                <select id="m_res_type" class="w-full p-2 border rounded bg-white">
                    <option value="PDF/Handnote" ${data.type === "PDF/Handnote" ? "selected" : ""}>PDF / Handnote</option>
                    <option value="Video Lecture" ${data.type === "Video Lecture" ? "selected" : ""}>Video</option>
                    <option value="Audio/Voice" ${data.type === "Audio/Voice" ? "selected" : ""}>Audio</option>
                    <option value="Image/Document" ${data.type === "Image/Document" ? "selected" : ""}>Image</option>
                </select>
            </div>
            <div><label class="font-bold text-gray-600">File / Link URL</label><input type="text" id="m_res_url" value="${safeUrl}" class="w-full p-2 border rounded text-[10px]"></div>
            ${(data.url && data.url.startsWith("http")) || data.storagePath
            ? `<button type="button" id="m_res_preview_btn" class="text-indigo-600 underline text-[10px] font-bold">Preview file in new tab</button>`
            : `<span class="text-red-500 text-[10px]">No valid file — re-upload needed</span>`
        }
        </div>`;
}

/**
 * Wire up the preview button inside the resource edit modal.
 * @param {object} data - resource data with id
 * @param {function} openResourceFile - from fileStorage.js
 */
export function initResourceEditPreview(data, openResourceFile) {
    const previewBtn = document.getElementById("m_res_preview_btn");
    if (previewBtn) {
        previewBtn.onclick = async () => {
            const ok = await openResourceFile(data);
            if (!ok) alert("ফাইল খোলা যায়নি।");
        };
    }
}

/**
 * Save edited resource to Firestore.
 * @param {string} activeEditId - resource document ID
 * @param {object} firestore - { db, doc, updateDoc }
 */
export async function saveResourceEdit(activeEditId, firestore) {
    const { db, doc, updateDoc } = firestore;
    await updateDoc(doc(db, "resources", activeEditId), {
        title: document.getElementById("m_res_title").value.trim(),
        author: document.getElementById("m_res_author").value.trim(),
        courseCode: document.getElementById("m_res_code").value.trim(),
        semester: document.getElementById("m_res_sem").value.trim(),
        type: document.getElementById("m_res_type").value,
        url: document.getElementById("m_res_url").value.trim(),
        updatedAt: new Date().toISOString(),
    });
    alert("Resource updated successfully!");
    return true;
}