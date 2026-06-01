// ─── Notice Manager Module (admin) ───
// Extracted from admin-dashboard.html — handles notice CRUD, bold/italic toolbar
// Dependency injection: Firestore functions passed as arguments

/**
 * Wrap selected text in a textarea with prefix/suffix (e.g., **bold**, *italic*).
 * @param {HTMLTextAreaElement} textarea
 * @param {string} prefix
 * @param {string} suffix
 */
export function wrapSelectedText(textarea, prefix, suffix) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    if (selected.length === 0) return;
    textarea.value =
        textarea.value.substring(0, start) +
        prefix +
        selected +
        suffix +
        textarea.value.substring(end);
    textarea.selectionStart = start;
    textarea.selectionEnd = end + prefix.length + suffix.length;
    textarea.focus();
}

/**
 * Wire up the bold/italic toolbar for the main notice textarea.
 * @param {HTMLTextAreaElement} noticeTA
 * @param {string} boldBtnId
 * @param {string} italicBtnId
 */
export function initNoticeToolbar(noticeTA, boldBtnId, italicBtnId) {
    const boldBtn = document.getElementById(boldBtnId);
    const italicBtn = document.getElementById(italicBtnId);
    if (boldBtn) boldBtn.addEventListener("click", () => wrapSelectedText(noticeTA, "**", "**"));
    if (italicBtn) italicBtn.addEventListener("click", () => wrapSelectedText(noticeTA, "*", "*"));
}

/**
 * Handle notice form submission (create new notice).
 * @param {Event} e
 * @param {object} firestore - { db, collection, addDoc }
 * @param {Function} showToast - Toast notification function
 * @param {Function} t - i18n translator function
 */
export async function handleNoticeFormSubmit(e, firestore, showToast, t) {
    e.preventDefault();
    const { db, collection, addDoc } = firestore;
    const content = document.getElementById("noticeContent").value.trim();
    if (!content) {
        showToast(t("noticeContentRequired"), "warning");
        return;
    }
    const btn = e.target.querySelector("button[type='submit']");
    if (btn) btn.classList.add("portal-btn--loading");

    try {
        await addDoc(collection(db, "notices"), {
            content,
            createdAt: new Date().toISOString(),
        });
        showToast(t("noticePublished"), "success");
        document.getElementById("noticeForm").reset();
    } catch (err) {
        showToast(t("noticePublishFailed") + err.message, "error");
    } finally {
        if (btn) btn.classList.remove("portal-btn--loading");
    }
}

/**
 * Build the notice edit modal form HTML.
 * @param {string} id - notice document ID
 * @param {string} content - raw notice content
 * @returns {string} HTML for modalFormContainer
 */
export function buildNoticeEditForm(id, content) {
    const safeContent = String(content)
        .replace(/&/g, "\x26amp;")
        .replace(/</g, "\x26lt;")
        .replace(/>/g, "\x26gt;")
        .replace(/"/g, "\x26quot;");
    return `
        <div class="space-y-3 text-xs">
            <p class="font-bold text-amber-800">Editing Notice: ${id.replace(/</g, "\x26lt;")}</p>
            <div class="flex items-center gap-1 flex-wrap mb-1">
                <span class="text-[10px] text-gray-500 font-bold mr-1">Format:</span>
                <button type="button" id="m_boldBtn" class="px-2.5 py-1 text-[11px] font-bold bg-gray-100 hover:bg-gray-700 hover:text-white border rounded transition"><b>B</b></button>
                <button type="button" id="m_italicBtn" class="px-2.5 py-1 text-[11px] italic font-serif bg-gray-100 hover:bg-gray-700 hover:text-white border rounded transition"><i>I</i></button>
                <span class="text-[9px] text-gray-400 ml-1">Select text then click</span>
            </div>
            <textarea id="m_notice_content" rows="10" class="w-full p-2 border rounded-md text-sm font-mono leading-relaxed">${safeContent}</textarea>
        </div>`;
}

/**
 * Wire up bold/italic toolbar inside the notice edit modal.
 * @param {string} mBoldBtnId - e.g. "m_boldBtn"
 * @param {string} mItalicBtnId - e.g. "m_italicBtn"
 * @param {string} mTextareaId - e.g. "m_notice_content"
 */
export function initNoticeEditToolbar(mBoldBtnId, mItalicBtnId, mTextareaId) {
    const mTA = document.getElementById(mTextareaId);
    if (!mTA) return;
    const boldBtn = document.getElementById(mBoldBtnId);
    const italicBtn = document.getElementById(mItalicBtnId);
    if (boldBtn) {
        boldBtn.onclick = () => {
            const s = mTA.selectionStart;
            const e = mTA.selectionEnd;
            const sel = mTA.value.substring(s, e);
            if (!sel) return;
            mTA.value = mTA.value.substring(0, s) + "**" + sel + "**" + mTA.value.substring(e);
            mTA.selectionStart = s;
            mTA.selectionEnd = e + 4;
            mTA.focus();
        };
    }
    if (italicBtn) {
        italicBtn.onclick = () => {
            const s = mTA.selectionStart;
            const e = mTA.selectionEnd;
            const sel = mTA.value.substring(s, e);
            if (!sel) return;
            mTA.value = mTA.value.substring(0, s) + "*" + sel + "*" + mTA.value.substring(e);
            mTA.selectionStart = s;
            mTA.selectionEnd = e + 2;
            mTA.focus();
        };
    }
}

/**
 * Save edited notice to Firestore.
 * @param {string} activeEditId - notice document ID
 * @param {object} firestore - { db, doc, updateDoc }
 */
export async function saveNoticeEdit(activeEditId, firestore) {
    const { db, doc, updateDoc } = firestore;
    const newContent = document.getElementById("m_notice_content").value.trim();
    if (!newContent) {
        alert("Notice content cannot be empty.");
        return false;
    }
    await updateDoc(doc(db, "notices", activeEditId), {
        content: newContent,
        updatedAt: new Date().toISOString(),
    });
    alert("Notice updated successfully!");
    return true;
}

/**
 * Render the admin notices list from a Firestore snapshot.
 * @param {object} snapshot - Firestore QuerySnapshot
 * @param {HTMLElement} containerEl - e.g. document.getElementById("adminNoticeList")
 * @param {HTMLElement} countEl - e.g. document.getElementById("noticeCount")
 * @param {function} formatNoticeContent - imported from noticeFormat.js
 * @returns {Map<string, string>} noticeContents map (id → raw content) for edit lookup
 */
export function renderNoticeList(snapshot, containerEl, countEl, formatNoticeContent) {
    countEl.innerText = snapshot.size;
    const noticeContents = new Map();
    containerEl.innerHTML = snapshot.docs
        .map((res) => {
            const content = res.data().content || "";
            noticeContents.set(res.id, content);
            return `
                <div class="flex justify-between items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p class="max-w-[70%] text-[11px] leading-relaxed break-words line-clamp-4">${formatNoticeContent(content)}</p>
                    <div class="flex items-center gap-1 shrink-0">
                        <button onclick="openNoticeEditModal('${res.id}')" class="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-2 py-0.5 rounded transition text-[10px] font-semibold"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button onclick="deleteDataDocument('notices', '${res.id}')" class="text-red-600 h-6 w-6 hover:bg-red-600 hover:text-white rounded transition flex items-center justify-center" aria-label="Delete notice"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>`;
        })
        .join("");
    return noticeContents;
}