// assets/js/admin/routineLedgerManager.js
// Routine Date Ledger — table renderer, toggle, and bulk confirm for admin dashboard

function esc(s) {
    return String(s || "").replace(/&/g, "&").replace(/"/g, """).replace(/</g, " < ").replace(/>/g, " > ");
}

/**
 * Render the routine date ledger table.
 * @param {Object} snapshot - Firestore snapshot of routine_date_ledger documents
 * @param {HTMLElement} containerEl
 * @param {HTMLElement} countEl
 * @param {Object} db - Firestore db instance
 * @param {Function} docFn - Firestore doc()
 * @param {Function} updateDocFn - Firestore updateDoc()
 * @param {string} adminName - Current admin's display name
 * @param {Function} showToast - Toast notification function
 * @param {Function} t - i18n translator for admin namespace
 */
export function renderLedgerTable(snapshot, containerEl, countEl, db, docFn, updateDocFn, adminName, showToast, t) {
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