// assets/js/admin/routineLedgerManager.js
// Routine Date Ledger — table renderer, toggle, and bulk confirm for admin dashboard

function esc(s) {
    return String(s || "").replace(/[&"<>]/g, function (m) {
        if (m === "&") return "&" + "amp;";
        if (m === "\"") return "&" + "quot;";
        if (m === "<") return "&" + "lt;";
        return "&" + "gt;";
    });
}

/**
 * Render the routine date ledger table.
 * @param {Object} snapshot - Firestore snapshot of routine_date_ledger documents
 * @param {HTMLElement} containerEl
 * @param {HTMLElement} countEl
 * @param {Object} db - Firestore db instance
 * @param {Function} docFn - Firestore doc()
 * @param {Function} updateDocFn - Firestore updateDoc()
 * @param {Function} deleteDocFn - Firestore deleteDoc()
 * @param {string} adminName - Current admin's display name
 * @param {Function} showToast - Toast notification function
 * @param {Function} t - i18n translator for admin namespace
 */
export function renderLedgerTable(snapshot, containerEl, countEl, db, docFn, updateDocFn, deleteDocFn, adminName, showToast, t) {
    if (!containerEl) return;

    if (snapshot.empty) {
        countEl.innerText = "0 entries";
        containerEl.innerHTML = '<div class="text-center py-6 text-xs text-gray-400">' + esc(t("ledgerNoEntries")) + '</div>';
        return;
    }

    const entries = [];
    snapshot.forEach(function (docSnap) {
        entries.push(Object.assign({ id: docSnap.id }, docSnap.data()));
    });

    // Sort: unconfirmed first (so admin sees pending), then newest date first
    entries.sort(function (a, b) {
        if (a.classHeld !== b.classHeld) return a.classHeld ? 1 : -1;
        return (b.routineDate || "").localeCompare(a.routineDate || "");
    });

    countEl.innerText = entries.length + " entries";

    var pendingCount = entries.filter(function (e) { return !e.classHeld; }).length;
    var bulkBtnHTML = pendingCount > 0
        ? '<button type="button" id="ledgerConfirmAllBtn" class="text-[10px] bg-teal-600 text-white px-3 py-1 rounded-full font-semibold hover:bg-teal-700 transition">&#x2705; ' + esc(t("ledgerConfirmAll")) + ' (' + pendingCount + ')</button>'
        : "";

    containerEl.innerHTML =
        '<div class="flex items-center justify-between mb-2">' +
        '<p class="text-[10px] text-gray-400">' + esc(t("ledgerDesc")) + '</p>' +
        bulkBtnHTML +
        '</div>' +
        '<div class="overflow-x-auto max-h-[18rem] overflow-y-auto">' +
        '<table class="w-full text-[10px] text-left text-gray-600 border-collapse">' +
        '<thead class="text-gray-500 uppercase bg-gray-50 sticky top-0">' +
        '<tr>' +
        '<th class="px-2 py-1.5">' + esc(t("ledgerColDate")) + '</th>' +
        '<th class="px-2 py-1.5">' + esc(t("ledgerColCourse")) + '</th>' +
        '<th class="px-2 py-1.5">' + esc(t("ledgerColSubject")) + '</th>' +
        '<th class="px-2 py-1.5">' + esc(t("ledgerColBatch")) + '</th>' +
        '<th class="px-2 py-1.5 text-center">' + esc(t("ledgerColHeld")) + '</th>' +
        '<th class="px-2 py-1.5">' + esc(t("ledgerColConfirmed")) + '</th>' +
        '<th class="px-2 py-1.5 text-center w-8">' + esc(t("ledgerColAction") || "Act") + '</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        entries.map(function (entry, idx) { return renderLedgerRow(entry, idx); }).join("") +
        '</tbody>' +
        '</table>' +
        '</div>';

    // Wire toggle events via event delegation
    containerEl.querySelectorAll(".ledger-toggle").forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            handleLedgerToggle(this, db, docFn, updateDocFn, adminName, showToast, t);
        });
    });

    // Wire bulk confirm button
    var confirmAllBtn = containerEl.querySelector("#ledgerConfirmAllBtn");
    if (confirmAllBtn) {
        confirmAllBtn.addEventListener("click", function () {
            confirmAllVisible(entries, db, docFn, updateDocFn, adminName, showToast, t);
        });
    }

    // Wire delete buttons
    containerEl.querySelectorAll(".ledger-delete-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            handleLedgerDelete(this, db, docFn, deleteDocFn, showToast, t);
        });
    });
}

/**
 * Render a single ledger table row.
 * @param {Object} entry
 * @param {number} idx
 * @returns {string} HTML
 */
function renderLedgerRow(entry, idx) {
    var held = !!entry.classHeld;
    var rowBg = held ? "" : "bg-amber-50/40";
    var confirmedInfo = held && entry.confirmedBy
        ? esc(entry.confirmedBy) + '<br><span class="text-[9px] text-gray-400">' + esc(entry.confirmedAt ? new Date(entry.confirmedAt).toLocaleDateString("en-GB") : "") + '</span>'
        : '<span class="text-gray-300">—</span>';

    return '<tr class="border-b border-gray-100 hover:bg-gray-50/50 ' + rowBg + '">' +
        '<td class="px-2 py-1.5 font-mono text-[10px] font-semibold text-gray-700">' + esc(entry.routineDate || "") + '</td>' +
        '<td class="px-2 py-1.5 font-mono text-teal-700 font-bold">' + esc(entry.courseCode || "") + '</td>' +
        '<td class="px-2 py-1.5 max-w-[120px] truncate" title="' + esc(entry.subject || "") + '">' + esc(entry.subject || "") + '</td>' +
        '<td class="px-2 py-1.5">' + esc(entry.batchNumber || "") + '</td>' +
        '<td class="px-2 py-1.5 text-center">' +
        '<label class="relative inline-flex items-center cursor-pointer">' +
        '<input type="checkbox" class="sr-only peer ledger-toggle" data-id="' + esc(entry.id) + '"' + (held ? " checked" : "") + '>' +
        '<div class="w-8 h-4 bg-gray-300 peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>' +
        '</label>' +
        '</td>' +
        '<td class="px-2 py-1.5 text-[9px]">' + confirmedInfo + '</td>' +
        '<td class="px-2 py-1.5 text-center">' +
        '<button type="button" class="ledger-delete-btn text-red-400 hover:text-red-600 text-xs p-0.5 rounded hover:bg-red-50 transition" data-id="' + esc(entry.id) + '" title="Delete">&#128465;</button>' +
        '</td>' +
        '</tr>';
}

/**
 * Handle a single ledger toggle (Yes/No switch).
 * @param {HTMLInputElement} checkbox
 * @param {Object} db
 * @param {Function} docFn
 * @param {Function} updateDocFn
 * @param {string} adminName
 * @param {Function} showToast
 * @param {Function} t
 */
export async function handleLedgerToggle(checkbox, db, docFn, updateDocFn, adminName, showToast, t) {
    var ledgerId = checkbox.getAttribute("data-id");
    if (!ledgerId) return;

    var classHeld = checkbox.checked;
    checkbox.disabled = true;

    try {
        var payload = { classHeld: classHeld };
        if (classHeld) {
            payload.confirmedAt = new Date().toISOString();
            payload.confirmedBy = adminName;
        } else {
            payload.confirmedAt = null;
            payload.confirmedBy = null;
        }
        await updateDocFn(docFn(db, "routine_date_ledger", ledgerId), payload);
        showToast(t("ledgerToggled"), "success");
    } catch (err) {
        checkbox.checked = !classHeld; // revert
        showToast(t("alertActionFailed") + ": " + err.message, "error");
    } finally {
        checkbox.disabled = false;
    }
}

/**
 * Bulk-confirm all currently visible unconfirmed entries.
 * @param {Array} entries - all entries currently displayed
 * @param {Object} db
 * @param {Function} docFn
 * @param {Function} updateDocFn
 * @param {string} adminName
 * @param {Function} showToast
 * @param {Function} t
 */
export async function confirmAllVisible(entries, db, docFn, updateDocFn, adminName, showToast, t) {
    var unconfirmed = entries.filter(function (e) { return !e.classHeld; });
    if (unconfirmed.length === 0) {
        showToast(t("ledgerAllConfirmed"), "info");
        return;
    }

    var btn = document.getElementById("ledgerConfirmAllBtn");
    if (btn) btn.disabled = true;

    var succeeded = 0;
    for (var i = 0; i < unconfirmed.length; i++) {
        var entry = unconfirmed[i];
        try {
            await updateDocFn(docFn(db, "routine_date_ledger", entry.id), {
                classHeld: true,
                confirmedAt: new Date().toISOString(),
                confirmedBy: adminName,
            });
            succeeded++;
        } catch (err) {
            console.error("Failed to confirm ledger entry:", entry.id, err);
        }
    }

    if (btn) btn.disabled = false;
    showToast(succeeded + "/" + unconfirmed.length + " " + t("ledgerConfirmedCount"), succeeded > 0 ? "success" : "error");
}

/**
 * Delete a single ledger entry.
 * @param {HTMLButtonElement} btn - The delete button that was clicked
 * @param {Object} db - Firestore db instance
 * @param {Function} docFn - Firestore doc()
 * @param {Function} deleteDocFn - Firestore deleteDoc()
 * @param {Function} showToast - Toast notification function
 * @param {Function} t - i18n translator
 */
async function handleLedgerDelete(btn, db, docFn, deleteDocFn, showToast, t) {
    var entryId = btn.dataset.id;
    if (!entryId) return;
    if (!confirm(t("ledgerDeleteConfirm") || "Delete this ledger entry? This cannot be undone.")) return;
    btn.disabled = true;
    try {
        await deleteDocFn(docFn(db, "routine_date_ledger", entryId));
        showToast(t("ledgerDeleted") || "Ledger entry deleted.", "success");
    } catch (err) {
        console.error("Failed to delete ledger entry:", err);
        showToast(t("alertActionFailed") || "Delete failed.", "error");
        btn.disabled = false;
    }
}

/**
 * One-time sync: pull all existing daily routines into the ledger.
 * Safe to run multiple times — uses merge:true so existing entries aren't overwritten.
 * @param {Object} db - Firestore db instance
 * @param {Function} collectionFn - Firestore collection()
 * @param {Function} queryFn - Firestore query()
 * @param {Function} whereFn - Firestore where()
 * @param {Function} getDocsFn - Firestore getDocs()
 * @param {Function} setDocFn - Firestore setDoc()
 * @param {Function} docFn - Firestore doc()
 * @param {Function} showToast - Toast notification function
 * @param {Function} t - i18n translator for admin namespace
 * @returns {Promise<number>} count of synced entries
 */
export async function syncExistingRoutines(db, collectionFn, queryFn, whereFn, getDocsFn, setDocFn, docFn, getDocFn, showToast, t) {
    var btn = document.getElementById("ledgerSyncBtn");
    if (btn) { btn.disabled = true; btn.innerText = t("ledgerSyncing"); }

    try {
        var q = queryFn(collectionFn(db, "routines"), whereFn("boardType", "==", "daily"));
        var snapshot = await getDocsFn(q);

        if (snapshot.empty) {
            showToast(t("ledgerSyncNone"), "info");
            return 0;
        }

        var synced = 0;
        var promises = [];
        snapshot.forEach(function (docSnap) {
            var data = docSnap.data();
            if (!data.routineDate || !data.courseCode) return;
            var ledgerId = String(data.courseCode).trim().toUpperCase() + "_" + data.routineDate;
            var docRef = docFn(db, "routine_date_ledger", ledgerId);

            var p = getDocFn(docRef).then(function (existingDoc) {
                if (existingDoc.exists()) {
                    // Existing entry — only update the reference fields, preserve classHeld/confirmed
                    return setDocFn(docRef, {
                        courseCode: data.courseCode,
                        subject: data.subject || "",
                        routineDate: data.routineDate,
                        batchNumber: data.batchNumber || "",
                        teacherCode: data.teacherCode || "",
                    }, { merge: true });
                } else {
                    // New entry — set defaults for classHeld/confirmed
                    return setDocFn(docRef, {
                        courseCode: data.courseCode,
                        subject: data.subject || "",
                        routineDate: data.routineDate,
                        batchNumber: data.batchNumber || "",
                        teacherCode: data.teacherCode || "",
                        classHeld: false,
                        confirmedAt: null,
                        confirmedBy: null,
                        createdAt: new Date().toISOString(),
                    }, { merge: true });
                }
            });
            promises.push(p);
            synced++;
        });

        await Promise.all(promises);
        showToast(synced + " " + t("ledgerSyncDone"), "success");
        return synced;
    } catch (err) {
        console.error("Ledger sync failed:", err);
        showToast(t("ledgerSyncFailed") + ": " + err.message, "error");
        return 0;
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = t("ledgerSyncBtn"); }
    }
}