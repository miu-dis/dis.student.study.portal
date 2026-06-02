// assets/js/portal/upload.js
// Resource upload/edit modal logic for student portal

let loadFileStorage = null;

/**
 * Set the fileStorage module loader function.
 * @param {Function} loader - async () => import("./fileStorage.js")
 */
export function setFileStorageLoader(loader) {
    loadFileStorage = loader;
}

/**
 * Upload a file to Supabase storage for the current user.
 * @param {File} file
 * @param {string} loggedInUserUID
 * @returns {Promise<{ downloadUrl: string, storagePath: string, urlType: string }>}
 */
export async function uploadFileToStorage(file, loggedInUserUID) {
    if (!loadFileStorage) throw new Error("fileStorage loader not set");
    const { uploadPortalFile } = await loadFileStorage();
    return uploadPortalFile(file, loggedInUserUID);
}

/**
 * Open the share/resource modal (for upload or edit).
 */
export function openShareModal() {
    const modal = document.getElementById("shareModal");
    if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }
}

/**
 * Close the share/resource modal.
 */
export function closeShareModal() {
    const modal = document.getElementById("shareModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
}

/**
 * Refresh translatable labels inside the share modal.
 * @param {Function} t - portalT translator
 */
export function refreshShareModalLabels(t) {
    const el = document.getElementById("uploadSizeNotice");
    if (el) el.innerText = t("uploadSizeWarn");
    const before = document.getElementById("lockSemNoticeBefore");
    if (before) before.innerText = t("lockSemBefore");
    const after = document.getElementById("lockSemNoticeAfter");
    if (after) after.innerText = t("lockSemAfter");
}

/**
 * Trigger the locked upload flow for a specific course.
 * Validates login + semester lock, then populates and opens the share modal.
 *
 * @param {number} courseIndex
 * @param {Object} auth - Firebase auth instance
 * @param {Array} latestMappedCourses
 * @param {string} loggedInUserName
 * @param {string} studentCurrentTrimesterKey
 * @param {boolean} canUploadInView
 * @param {Function} t - translator
 * @param {Function} switchUploadMethod - window.switchUploadMethod
 */
export function triggerLockedUploadFlow(
    courseIndex,
    auth,
    latestMappedCourses,
    loggedInUserName,
    studentCurrentTrimesterKey,
    canUploadInView,
    t,
    switchUploadMethod
) {
    if (!auth.currentUser) {
        alert(t("alertLoginUpload"));
        window.location.href = "./login.html";
        return;
    }
    if (!canUploadInView) {
        alert(t("alertSemLock"));
        return;
    }
    const course = latestMappedCourses[courseIndex];
    if (!course) return;

    const formEl = document.getElementById("resourceShareForm");
    document.getElementById("shareAuthor").value = loggedInUserName || auth.currentUser.displayName || "";
    document.getElementById("lockedCourseDisplay").value = `${course.code}: ${course.title}`;
    document.getElementById("shareTitle").value = "";
    document.getElementById("lockedSemLabel").innerText = studentCurrentTrimesterKey;
    formEl.dataset.lockedCode = course.code;
    formEl.dataset.lockedCourseTitle = course.title;
    formEl.dataset.lockedCourseTeacher = course.teacher || "";
    formEl.dataset.editId = "";

    // Reset upload fields
    window._pendingUploadFile = null;
    window._base64UploadedFileString = "";
    const fileField = document.getElementById("shareFileField");
    if (fileField) fileField.value = "";
    const urlField = document.getElementById("shareUrl");
    if (urlField) urlField.value = "";

    document.getElementById("sm_submit").innerText = t("sm_submit");
    document.getElementById("sm_title").innerHTML = `<i class="fa-solid fa-cloud-arrow-up mr-2"></i> ${t("sm_title")}`;

    if (typeof switchUploadMethod === "function") switchUploadMethod("file");
    refreshShareModalLabels(t);
    openShareModal();
}

/**
 * Open the edit resource modal, populating form fields from existing resource data.
 *
 * @param {string} resourceId
 * @param {Function} getDoc - Firestore getDoc
 * @param {Object} doc - Firestore doc helper
 * @param {Object} db - Firestore db
 * @param {Array} latestMappedCourses
 * @param {string} loggedInUserName
 * @param {string} loggedInUserUID
 * @param {string} studentCurrentTrimesterKey
 * @param {Function} canManageResourceFn
 * @param {Function} t - translator
 * @param {Function} switchUploadMethod
 * @returns {Promise<void>}
 */
export async function openEditResourceModal(
    resourceId,
    { getDoc, doc, db },
    latestMappedCourses,
    loggedInUserName,
    loggedInUserUID,
    studentCurrentTrimesterKey,
    canManageResourceFn,
    t,
    switchUploadMethod
) {
    const snap = await getDoc(doc(db, "resources", resourceId));
    if (!snap.exists()) return;
    const rData = snap.data();

    if (!canManageResourceFn({ ...rData, id: resourceId }, loggedInUserUID, loggedInUserName)) {
        alert(t("alertNotOwner"));
        return;
    }

    const course = latestMappedCourses.find((c) => c.code === rData.courseCode);
    const formEl = document.getElementById("resourceShareForm");

    document.getElementById("shareAuthor").value = rData.author || loggedInUserName;
    document.getElementById("lockedCourseDisplay").value =
        course ? `${course.code}: ${course.title}` : rData.courseCode;

    const titleParts = (rData.title || "").split(" — ");
    document.getElementById("shareTitle").value =
        titleParts.length > 1 ? titleParts.slice(1).join(" — ") : rData.title;

    document.getElementById("shareType").value = rData.type || "PDF/Handnote";
    document.getElementById("shareUrl").value =
        rData.urlType === "external" ? rData.url || "" : "";

    formEl.dataset.lockedCode = rData.courseCode;
    formEl.dataset.lockedCourseTitle = course?.title || rData.courseTitle || rData.courseCode;
    formEl.dataset.lockedCourseTeacher = course?.teacher || rData.courseTeacher || "";
    formEl.dataset.editId = resourceId;
    document.getElementById("lockedSemLabel").innerText = rData.semester || studentCurrentTrimesterKey;

    window._pendingUploadFile = null;
    window._base64UploadedFileString = "";
    const fileField = document.getElementById("shareFileField");
    if (fileField) fileField.value = "";

    if (typeof switchUploadMethod === "function") {
        switchUploadMethod(rData.urlType === "external" ? "link" : "file");
    }

    document.getElementById("sm_submit").innerText = t("sm_save");
    document.getElementById("sm_title").innerHTML = `<i class="fa-solid fa-pen-to-square mr-2"></i> ${t("sm_edit_title")}`;
    refreshShareModalLabels(t);
    openShareModal();
}

/**
 * Delete a resource by ID, including storage file cleanup.
 *
 * @param {string} resourceId
 * @param {Function} getDoc - Firestore getDoc
 * @param {Object} { doc, db, deleteDoc } - Firestore helpers
 * @param {Function} canManageResourceFn
 * @param {string} loggedInUserUID
 * @param {string} loggedInUserName
 * @param {Function} t - translator
 * @returns {Promise<void>}
 */
export async function deleteResourceById(
    resourceId,
    { getDoc, doc, db, deleteDoc },
    canManageResourceFn,
    loggedInUserUID,
    loggedInUserName,
    t
) {
    const snap = await getDoc(doc(db, "resources", resourceId));
    if (!snap.exists()) return;
    const rData = snap.data();

    if (!canManageResourceFn({ ...rData, id: resourceId }, loggedInUserUID, loggedInUserName)) {
        alert(t("alertNotOwner"));
        return;
    }
    if (!confirm(t("confirmDeleteResource"))) return;

    try {
        if (rData.storagePath && rData.urlType !== "external") {
            if (!loadFileStorage) throw new Error("fileStorage loader not set");
            const { deletePortalFile } = await loadFileStorage();
            await deletePortalFile(rData.storagePath);
        }
        await deleteDoc(doc(db, "resources", resourceId));
        alert(t("alertResourceDeleted"));
    } catch (err) {
        alert(err.message);
    }
}

/**
 * Handle click events on the resource grid (view course, upload, view/edit/delete resource).
 *
 * @param {Event} e
 * @param {Object} opts - {
 *   openCourseDetail, triggerLockedUploadFlow, getDoc, doc, db,
 *   loadFileStorage, openEditResourceModal, deleteResourceById,
 *   canManageResourceFn, loggedInUserUID, loggedInUserName, t
 * }
 * @returns {Promise<void>}
 */
export async function handleResourceGridClick(e, opts) {
    const {
        openCourseDetail,
        triggerLockedUploadFlow,
        getDoc,
        doc,
        db,
        openEditResourceModalFn,
        deleteResourceByIdFn,
        t,
    } = opts;

    const viewCourseBtn = e.target.closest("[data-view-course]");
    if (viewCourseBtn) {
        openCourseDetail(parseInt(viewCourseBtn.dataset.viewCourse, 10));
        return;
    }

    const uploadBtn = e.target.closest("[data-upload-course]");
    if (uploadBtn && !uploadBtn.disabled) {
        triggerLockedUploadFlow(parseInt(uploadBtn.dataset.uploadCourse, 10));
        return;
    }

    const viewBtn = e.target.closest("[data-view-resource]");
    if (viewBtn) {
        e.preventDefault();
        try {
            const snap = await getDoc(doc(db, "resources", viewBtn.dataset.viewResource));
            if (!snap.exists()) return;
            if (!loadFileStorage) throw new Error("fileStorage loader not set");
            const { openResourceFile } = await loadFileStorage();
            const ok = await openResourceFile({ id: snap.id, ...snap.data() });
            if (!ok) alert(t("alertOpenFileFailed"));
        } catch (err) {
            alert(err.message);
        }
        return;
    }

    const editBtn = e.target.closest("[data-edit-resource]");
    if (editBtn) {
        openEditResourceModalFn(editBtn.dataset.editResource);
        return;
    }

    const delBtn = e.target.closest("[data-delete-resource]");
    if (delBtn) {
        deleteResourceByIdFn(delBtn.dataset.deleteResource);
    }
}

/**
 * Handle the resource share form submission (create or edit).
 *
 * @param {Event} e - submit event
 * @param {Object} opts - {
 *   auth, buildCourseIdentityKey, uploadFileToStorage, loadFileStorage,
 *   db, collection, doc, addDoc, updateDoc, getDoc,
 *   loggedInUserUID, studentCurrentTrimesterKey,
 *   t, closeShareModal, updateFiltersAndListen, switchUploadMethod
 * }
 * @returns {Promise<void>}
 */
export async function handleResourceSubmit(e, opts) {
    e.preventDefault();

    const {
        auth,
        buildCourseIdentityKey,
        uploadFileToStorageFn,
        loadFileStorage,
        db,
        collection,
        doc,
        addDoc,
        updateDoc,
        getDoc,
        loggedInUserUID,
        studentCurrentTrimesterKey,
        t,
        closeShareModal,
        updateFiltersAndListen,
    } = opts;

    const formEl = document.getElementById("resourceShareForm");
    const editId = formEl.dataset.editId || "";
    const noteTitle = document.getElementById("shareTitle").value.trim();
    const courseLabel = formEl.dataset.lockedCourseTitle || formEl.dataset.lockedCode;
    const fullTitle = noteTitle ? `${courseLabel} — ${noteTitle}` : courseLabel;

    let urlPayload = "";
    let urlType = "external";
    let storagePath = "";

    try {
        const currentMethod = window.currentActiveMethod || "file";

        if (currentMethod === "file") {
            if (window._pendingUploadFile) {
                const submitBtn = document.getElementById("sm_submit");
                submitBtn.disabled = true;
                submitBtn.innerText = t("alertUploading");

                const uploaded = await uploadFileToStorageFn(window._pendingUploadFile, loggedInUserUID);

                if (editId) {
                    const prevSnap = await getDoc(doc(db, "resources", editId));
                    const oldPath = prevSnap.exists() ? prevSnap.data().storagePath : null;
                    if (oldPath && oldPath !== uploaded.storagePath) {
                        const { deletePortalFile } = await loadFileStorage();
                        await deletePortalFile(oldPath);
                    }
                }
                urlPayload = uploaded.downloadUrl;
                storagePath = uploaded.storagePath;
                urlType = uploaded.urlType;

                submitBtn.disabled = false;
                submitBtn.innerText = editId ? t("sm_save") : t("sm_submit");
            } else if (editId) {
                const existing = await getDoc(doc(db, "resources", editId));
                if (existing.exists()) {
                    urlPayload = existing.data().url;
                    urlType = existing.data().urlType || "supabase";
                    storagePath = existing.data().storagePath || "";
                }
            } else {
                alert(t("alertPickFile"));
                return;
            }
        } else {
            urlPayload = document.getElementById("shareUrl").value.trim();
            if (!urlPayload) {
                alert(t("alertPasteLink"));
                return;
            }
            urlType = "external";
            storagePath = "";
        }

        const semesterKey = editId
            ? document.getElementById("lockedSemLabel").innerText.trim() || studentCurrentTrimesterKey
            : studentCurrentTrimesterKey;

        if (!urlPayload || (!urlPayload.startsWith("http") && !urlPayload.startsWith("data:"))) {
            alert(t("alertInvalidFileUrl"));
            return;
        }

        const courseTitle = formEl.dataset.lockedCourseTitle || "";
        const courseTeacher = formEl.dataset.lockedCourseTeacher || "";

        const payload = {
            author: document.getElementById("shareAuthor").value.trim(),
            title: fullTitle,
            type: document.getElementById("shareType").value,
            courseCode: formEl.dataset.lockedCode,
            courseTitle,
            courseTeacher,
            courseIdentityKey: buildCourseIdentityKey(formEl.dataset.lockedCode, courseTitle, courseTeacher),
            semester: semesterKey,
            url: urlPayload,
            urlType,
            storagePath,
            userId: loggedInUserUID,
            uploadedBy: loggedInUserUID,
            updatedAt: new Date().toISOString(),
        };

        if (editId) {
            await updateDoc(doc(db, "resources", editId), payload);
            alert(t("alertResourceUpdated"));
        } else {
            await addDoc(collection(db, "resources"), { ...payload, createdAt: new Date().toISOString() });
            alert(t("alertPublished"));
        }

        formEl.reset();
        formEl.dataset.editId = "";
        window._pendingUploadFile = null;
        closeShareModal();
        if (typeof updateFiltersAndListen === "function") updateFiltersAndListen();
    } catch (err) {
        const submitBtn = document.getElementById("sm_submit");
        submitBtn.disabled = false;
        submitBtn.innerText = formEl.dataset.editId ? t("sm_save") : t("sm_submit");
        alert(err.message);
    }
}