/**
 * form-validation.js — Inline Form Validation Module
 *
 * Replaces alert()-based error reporting with inline validation feedback.
 * Supports real-time validation, red border + error message, green checkmark,
 * and submit button locking.
 *
 * Usage:
 *   import { validateForm, setupFormValidation, validateField, clearAllErrors } from "./form-validation.js";
 *
 *   // Quick one-shot validation
 *   const rules = {
 *       loginEmail: [
 *           { type: "required", message: "Email is required" },
 *           { type: "email", message: "Please enter a valid email" },
 *       ],
 *       loginPassword: [
 *           { type: "required", message: "Password is required" },
 *           { type: "minLength", value: 6, message: "Minimum 6 characters" },
 *       ],
 *   };
 *   const result = validateForm(formEl, rules);
 *   if (!result.valid) return; // first error is focused automatically
 *
 *   // Real-time validation (validates on input/blur)
 *   setupFormValidation(formEl, rules, {
 *       submitBtn: document.getElementById("btnSubmit"),
 *       onValidSubmit: async (formData) => { ... },
 *   });
 */

// ── CSS class constants ──────────────────────────────────────────

const CSS = {
    FIELD_ERROR: "form-field--error",
    FIELD_VALID: "form-field--valid",
    FIELD_DIRTY: "form-field--dirty",
    ERROR_MSG: "form-field__error-msg",
    ERROR_MSG_VISIBLE: "form-field__error-msg--visible",
};

// ── Built-in validators ──────────────────────────────────────────

/**
 * Map of built-in validator functions.
 * Each returns an error message string if invalid, or null if valid.
 * @type {Object<string, Function>}
 */
const VALIDATORS = {
    required(value, _rule) {
        if (value === null || value === undefined) return "required";
        const str = String(value).trim();
        return str.length === 0 ? "required" : null;
    },

    email(value, _rule) {
        const str = String(value ?? "").trim();
        if (str.length === 0) return null; // let "required" handle empty
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str) ? null : "email";
    },

    minLength(value, rule) {
        const str = String(value ?? "").trim();
        if (str.length === 0) return null;
        return str.length >= rule.value ? null : "minLength";
    },

    maxLength(value, rule) {
        const str = String(value ?? "").trim();
        return str.length <= rule.value ? null : "maxLength";
    },

    pattern(value, rule) {
        const str = String(value ?? "").trim();
        if (str.length === 0) return null;
        return new RegExp(rule.value).test(str) ? null : "pattern";
    },

    url(value, _rule) {
        const str = String(value ?? "").trim();
        if (str.length === 0) return null;
        try {
            new URL(str);
            return null;
        } catch {
            return "url";
        }
    },

    match(value, rule) {
        const targetEl = document.getElementById(rule.field);
        if (!targetEl) return null;
        const targetVal = (targetEl.value ?? "").trim();
        const thisVal = String(value ?? "").trim();
        return thisVal === targetVal ? null : "match";
    },

    fileSize(value, rule) {
        if (!value || !(value instanceof File)) return null;
        const maxBytes = (rule.value || 10) * 1024 * 1024; // default 10 MB
        return value.size <= maxBytes ? null : "fileSize";
    },

    fileType(value, rule) {
        if (!value || !(value instanceof File)) return null;
        const allowed = rule.value || []; // array of extensions e.g. ["pdf","docx"]
        if (allowed.length === 0) return null;
        const ext = value.name.split(".").pop().toLowerCase();
        return allowed.includes(ext) ? null : "fileType";
    },

    uid(value, _rule) {
        const str = String(value ?? "").trim();
        if (str.length === 0) return null;
        // DIS UID format: e.g., "2024-001" or similar
        return /^\d{4}-\d{3,}$/.test(str) ? null : "uid";
    },
};

// ── Internal: get / create error message element ─────────────────

/**
 * Finds or creates the error message span for a field.
 * @param {HTMLElement} field - The input/select/textarea element
 * @returns {HTMLElement}
 */
function getErrorEl(field) {
    let el = field.parentElement.querySelector(`.${CSS.ERROR_MSG}`);
    if (!el) {
        el = document.createElement("span");
        el.className = CSS.ERROR_MSG;
        el.setAttribute("role", "alert");
        el.setAttribute("aria-live", "assertive");
        field.parentElement.appendChild(el);
    }
    return el;
}

// ── Internal: find submit button in form ─────────────────────────

function findSubmitBtn(formEl) {
    return formEl.querySelector('button[type="submit"], input[type="submit"]');
}

// ── Public: validate a single field ──────────────────────────────

/**
 * Validate a single form field against a list of rules.
 * Shows/clears inline error as appropriate.
 *
 * @param {HTMLElement} field - The input/select/textarea element
 * @param {Array<{type: string, value?: *, message: string}>} rules - Validation rules
 * @returns {{ valid: boolean, error: string|null }} Validation result
 */
export function validateField(field, rules) {
    if (!field) return { valid: true, error: null };

    const value = field.type === "file" ? field.files[0] : field.value;
    const errorEl = getErrorEl(field);

    for (const rule of rules) {
        const validator = VALIDATORS[rule.type];
        if (!validator) {
            console.warn(`[form-validation] Unknown validator type: "${rule.type}"`);
            continue;
        }

        const result = validator(value, rule);
        if (result !== null) {
            // Invalid
            field.classList.add(CSS.FIELD_ERROR);
            field.classList.remove(CSS.FIELD_VALID);
            errorEl.textContent = rule.message;
            errorEl.classList.add(CSS.ERROR_MSG_VISIBLE);
            field.setAttribute("aria-invalid", "true");
            field.setAttribute("aria-describedby", errorEl.id || undefined);
            return { valid: false, error: rule.message };
        }
    }

    // All rules passed
    clearFieldError(field);
    if (value !== null && value !== undefined && String(value).trim().length > 0) {
        field.classList.add(CSS.FIELD_VALID);
    }
    return { valid: true, error: null };
}

// ── Public: clear error on a single field ────────────────────────

/**
 * Remove inline error styling from a field.
 * @param {HTMLElement} field
 */
export function clearFieldError(field) {
    if (!field) return;
    field.classList.remove(CSS.FIELD_ERROR, CSS.FIELD_VALID);
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");

    const errorEl = field.parentElement.querySelector(`.${CSS.ERROR_MSG}`);
    if (errorEl) {
        errorEl.classList.remove(CSS.ERROR_MSG_VISIBLE);
        errorEl.textContent = "";
    }
}

// ── Public: clear all errors in a form ───────────────────────────

/**
 * Clear all inline errors in a form (or container).
 * @param {HTMLElement} container - Form or container element
 */
export function clearAllErrors(container) {
    if (!container) return;
    const fields = container.querySelectorAll(`.${CSS.FIELD_ERROR}, .${CSS.FIELD_VALID}`);
    fields.forEach((f) => clearFieldError(f));
}

// ── Public: validate entire form ─────────────────────────────────

/**
 * Validate all fields in a form and return aggregate result.
 * Focuses the first invalid field automatically.
 *
 * @param {HTMLFormElement} formEl - The form element
 * @param {Object<string, Array>} rulesMap - Map of field name → rules array
 * @returns {{ valid: boolean, errors: Object<string, string> }}
 */
export function validateForm(formEl, rulesMap) {
    const errors = {};
    let firstInvalid = null;

    for (const [fieldName, rules] of Object.entries(rulesMap)) {
        const field = formEl.querySelector(`[name="${fieldName}"]`) || document.getElementById(fieldName);
        if (!field) continue;

        const result = validateField(field, rules);
        if (!result.valid) {
            errors[fieldName] = result.error;
            if (!firstInvalid) firstInvalid = field;
        }
    }

    if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

// ── Public: set up real-time validation ──────────────────────────

/**
 * Attach real-time validation listeners to all fields in a form.
 * - Validates on `input` (after first blur)
 * - Validates on `blur`
 * - Disables submit button until form is valid
 * - Calls onValidSubmit(formData) when form is submitted and valid
 *
 * @param {HTMLFormElement} formEl - The form element
 * @param {Object<string, Array>} rulesMap - Map of field name/id → rules array
 * @param {Object} [options]
 * @param {HTMLElement} [options.submitBtn] - Submit button to toggle (auto-detected if omitted)
 * @param {Function} [options.onValidSubmit] - Called with (formData: FormData) on valid submit
 * @param {boolean} [options.validateOnInput=true] - Validate on each input event
 * @param {boolean} [options.validateOnBlur=true] - Validate on blur
 * @returns {Function} Teardown function — call to remove all listeners
 */
export function setupFormValidation(formEl, rulesMap, options = {}) {
    const {
        submitBtn,
        onValidSubmit,
        validateOnInput = true,
        validateOnBlur = true,
    } = options;

    const btn = submitBtn || findSubmitBtn(formEl);
    const teardowns = [];

    /**
     * Re-evaluate entire form and toggle submit button.
     */
    function checkFormValidity() {
        const result = validateForm(formEl, rulesMap);
        if (btn) {
            btn.disabled = !result.valid;
        }
        return result;
    }

    // Attach per-field listeners
    for (const [fieldName, rules] of Object.entries(rulesMap)) {
        const field = formEl.querySelector(`[name="${fieldName}"]`) || document.getElementById(fieldName);
        if (!field) continue;

        let hasBlurred = false;

        const onBlur = () => {
            hasBlurred = true;
            field.classList.add(CSS.FIELD_DIRTY);
            validateField(field, rules);
            checkFormValidity();
        };

        const onInput = () => {
            if (hasBlurred) {
                validateField(field, rules);
                checkFormValidity();
            }
        };

        if (validateOnBlur) {
            field.addEventListener("blur", onBlur);
            teardowns.push(() => field.removeEventListener("blur", onBlur));
        }

        if (validateOnInput) {
            field.addEventListener("input", onInput);
            teardowns.push(() => field.removeEventListener("input", onInput));
        }

        // Also validate on change for select elements
        if (field.tagName === "SELECT") {
            const onChange = () => {
                field.classList.add(CSS.FIELD_DIRTY);
                validateField(field, rules);
                checkFormValidity();
            };
            field.addEventListener("change", onChange);
            teardowns.push(() => field.removeEventListener("change", onChange));
        }
    }

    // Handle form submission
    const onSubmit = (e) => {
        e.preventDefault();
        const result = validateForm(formEl, rulesMap);

        if (result.valid && onValidSubmit) {
            const formData = new FormData(formEl);
            onValidSubmit(formData);
        }
    };

    formEl.addEventListener("submit", onSubmit);
    teardowns.push(() => formEl.removeEventListener("submit", onSubmit));

    // Initial state: disable submit if form is empty/invalid
    if (btn) {
        btn.disabled = true;
    }

    // Return teardown function
    return () => {
        teardowns.forEach((fn) => fn());
        clearAllErrors(formEl);
        if (btn) btn.disabled = false;
    };
}

// ── Public: programmatic field validation ────────────────────────

/**
 * Quick inline validation for a field by its ID.
 * Utility for validating outside of form context (e.g., before API call).
 *
 * @param {string} fieldId - Element ID
 * @param {Array} rules - Validation rules
 * @returns {boolean} True if valid
 */
export function isFieldValid(fieldId, rules) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    const result = validateField(field, rules);
    return result.valid;
}

// ── Public: add custom validator ─────────────────────────────────

/**
 * Register a custom validator function.
 *
 * @param {string} name - Validator name (used in rule.type)
 * @param {Function} fn - (value: string|File, rule: object) => null (valid) | string (error key)
 *
 * Example:
 *   addValidator("noSpaces", (value) => /\s/.test(value) ? "noSpaces" : null);
 */
export function addValidator(name, fn) {
    VALIDATORS[name] = fn;
}