/**
 * toast.js — Toast Notification System for DIS Student Portal
 *
 * Replaces alert() with accessible, non-blocking toast notifications.
 * Supports 4 variants: success, error, warning, info.
 * Auto-dismisses, stacks multiple toasts, fully accessible.
 *
 * Usage:
 *   import { showToast } from "./toast.js";
 *   showToast("Resource uploaded!", "success");
 *   showToast("Failed to save.", "error");
 *   showToast("Please fill all fields.", "warning");
 *   showToast("New notice available.", "info");
 *
 *   // With options:
 *   showToast("Custom duration", "info", { duration: 8000 });
 *   showToast("Persistent", "error", { duration: 0 }); // stays until manual close
 *   showToast("With title", "success", { title: "Upload Complete" });
 */

// ── Icon map per variant ─────────────────────────────────────────

const ICON_MAP = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info",
};

// ── Default options ──────────────────────────────────────────────

const DEFAULTS = {
    duration: 5000,
    title: "",
};

// ── Internal state ───────────────────────────────────────────────

let _container = null;

// ── Ensure container exists ─────────────────────────────────────

function getContainer() {
    if (_container) return _container;

    _container = document.createElement("div");
    _container.className = "toast-container";
    _container.setAttribute("aria-live", "polite");
    _container.setAttribute("aria-atomic", "false");
    _container.setAttribute("role", "status");
    document.body.appendChild(_container);

    return _container;
}

// ── Dismiss a single toast ──────────────────────────────────────

function dismissToast(toastEl) {
    if (toastEl.dataset.dismissed === "true") return;
    toastEl.dataset.dismissed = "true";

    // Clear any pending auto-dismiss timer
    const timerId = toastEl._dismissTimer;
    if (timerId) {
        clearTimeout(timerId);
        toastEl._dismissTimer = null;
    }

    // Animate out
    toastEl.classList.add("toast--dismissing");

    // Remove from DOM after animation
    toastEl.addEventListener(
        "transitionend",
        () => {
            if (toastEl.parentNode) {
                toastEl.parentNode.removeChild(toastEl);
            }
            // Clean up container if empty
            const container = getContainer();
            if (container.childElementCount === 0 && _container) {
                _container.remove();
                _container = null;
            }
        },
        { once: true }
    );

    // Fallback: remove after 500ms even if transitionend doesn't fire
    setTimeout(() => {
        if (toastEl.parentNode) {
            toastEl.parentNode.removeChild(toastEl);
            const container = getContainer();
            if (container.childElementCount === 0 && _container) {
                _container.remove();
                _container = null;
            }
        }
    }, 500);
}

// ── Build a single toast element ─────────────────────────────────

function buildToastEl(message, type, options) {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", "alert");

    // Icon
    const icon = document.createElement("span");
    icon.className = "toast__icon";
    const iconEl = document.createElement("i");
    iconEl.className = `fa-solid ${ICON_MAP[type] || ICON_MAP.info}`;
    icon.appendChild(iconEl);
    toast.appendChild(icon);

    // Content
    const content = document.createElement("div");
    content.className = "toast__content";

    if (options.title) {
        const title = document.createElement("div");
        title.className = "toast__title";
        title.textContent = options.title;
        content.appendChild(title);
    }

    const msg = document.createElement("div");
    msg.className = "toast__message";
    msg.textContent = message;
    content.appendChild(msg);

    toast.appendChild(content);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "toast__close";
    closeBtn.setAttribute("aria-label", "Dismiss notification");
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.addEventListener("click", () => dismissToast(toast));
    toast.appendChild(closeBtn);

    return toast;
}

// ── Public: showToast ────────────────────────────────────────────

/**
 * Display a toast notification.
 *
 * @param {string} message - The notification message text.
 * @param {"success"|"error"|"warning"|"info"} [type="info"] - Toast variant.
 * @param {Object} [options] - Optional configuration.
 * @param {number} [options.duration=5000] - Auto-dismiss in ms. 0 = persistent.
 * @param {string} [options.title=""] - Optional bold title above message.
 * @returns {HTMLElement} The toast DOM element (for programmatic dismiss).
 */
export function showToast(message, type = "info", options = {}) {
    const opts = { ...DEFAULTS, ...options };
    const container = getContainer();
    const toastEl = buildToastEl(message, type, opts);

    container.appendChild(toastEl);

    // Auto-dismiss after duration (unless duration is 0)
    if (opts.duration > 0) {
        toastEl._dismissTimer = setTimeout(() => {
            dismissToast(toastEl);
        }, opts.duration);
    }

    return toastEl;
}

// ── Public: dismissAllToasts ─────────────────────────────────────

/**
 * Dismiss all currently visible toasts immediately.
 */
export function dismissAllToasts() {
    if (!_container) return;
    const toasts = Array.from(_container.querySelectorAll(".toast"));
    toasts.forEach((t) => dismissToast(t));
}
