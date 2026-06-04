// ─── Student Manager Module (admin) ───
// Extracted from admin-dashboard.html — student directory table, password reset, account deletion
// Dependency injection: Firebase Auth + Firestore functions passed as arguments

/**
 * Render the student directory table from a Firestore users snapshot.
 * @param {object} snapshot - Firestore QuerySnapshot of "users" collection
 * @param {HTMLElement} tbodyEl - the <tbody> element
 */
export function renderStudentTable(snapshot, tbodyEl) {
    tbodyEl.innerHTML = snapshot.docs
        .map((res) => {
            const data = res.data();
            const id = res.id;
            const isBtnVisible = data.role === "admin" ? "hidden" : "inline-block";
            const safeName = (data.name || "User").replace(/'/g, "\\'");
            const safeEmail = (data.email || "").replace(/'/g, "\\'");
            return `<tr>
                <td class="px-4 py-3 font-bold">${data.name || "N/A"}<br><span class="text-[10px] text-gray-400">UID: ${data.universityUID || data.email || id}</span></td>
                <td class="px-4 py-3">Batch: ${data.batchNumber}<br><span class="text-[10px] text-indigo-700 font-bold">${data.trimester || "N/A"}</span></td>
                <td class="px-4 py-3 font-extrabold text-red-600">${data.bloodGroup || "PENDING"}</td>
                <td class="px-4 py-3">${data.phone || "PENDING"}</td>
                <td class="px-4 py-3"><b>${data.emergencyPhone || "PENDING"}</b><br><span class="text-[10px]">(${data.emergencyName})</span></td>
                <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full font-bold text-[10px] ${data.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}">${(data.role || "student").toUpperCase()}</span></td>
                <td class="px-4 py-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="resetStudentPasswordToDefault('${id}', '${safeName}', '${safeEmail}')" class="${isBtnVisible} bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white px-2 py-1 rounded font-bold text-[10px]" title="Send password reset email"><i class="fa-solid fa-key-skeleton"></i> Reset</button>
                        <button onclick="deleteStudentAccount('${id}', '${safeName}')" class="${isBtnVisible} bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 rounded font-bold text-[10px]" title="Delete student account" aria-label="Delete student account"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>`;
        })
        .join("");
}

/**
 * Send a password reset email to a student.
 * Must be exposed on window so inline onclick handlers work.
 * @param {string} uid - student user ID
 * @param {string} name - student name (for confirmation dialog)
 * @param {string} email - student email
 * @param {object} auth - Firebase Auth instance
 * @param {object} db - Firestore instance
 * @param {function} docFn - Firestore doc function
 * @param {function} updateDocFn - Firestore updateDoc function
 * @param {function} sendPasswordResetEmailFn - Firebase sendPasswordResetEmail
 */
export async function resetStudentPasswordToDefault(
    uid,
    name,
    email,
    auth,
    db,
    docFn,
    updateDocFn,
    sendPasswordResetEmailFn
) {
    if (!confirm(`Send password reset email to ${name}?`)) return;
    if (!email) {
        alert("No email found for this student.");
        return;
    }
    try {
        await sendPasswordResetEmailFn(auth, email);
        await updateDocFn(docFn(db, "users", uid), {
            mustResetPass: true,
            resetRequestedAt: new Date().toISOString(),
        });
        alert(`Password reset email sent to ${email}! The student can set a new password from the link.`);
    } catch (err) {
        alert("Reset failed: " + err.message);
    }
}

/**
 * Delete a student's account (Firestore profile only; auth deletion requires admin SDK).
 * @param {string} uid - student user ID
 * @param {string} name - student name (for confirmation dialog)
 * @param {object} db - Firestore instance
 * @param {function} docFn - Firestore doc function
 * @param {function} deleteDocFn - Firestore deleteDoc function
 */
export async function deleteStudentAccount(uid, name, db, docFn, deleteDocFn) {
    if (
        !confirm(
            `PERMANENTLY delete account of "${name}"?\n\nThis will remove the Firestore profile. The auth login will also be disabled. This cannot be undone.`
        )
    )
        return;
    try {
        await deleteDocFn(docFn(db, "users", uid));
        alert(`Account "${name}" deleted successfully.`);
    } catch (err) {
        alert("Delete failed: " + err.message);
    }
}