/**
 * ui-states.js — Reusable Loading / Empty / Error State Renderers
 *
 * Provides consistent, accessible state components for all portal and admin pages.
 * Integrates with i18n for multi-language support and toast.js for error feedback.
 *
 * Usage:
 *   import { renderLoadingState, renderEmptyState, renderErrorState, clearUIState } from "./ui-states.js";
 *
 *   // Loading
 *   renderLoadingState(containerEl, "Loading courses...");
 *
 *   // Empty
 *   renderEmptyState(containerEl, "No resources found", "Upload your first resource");
 *
 *   // Error
 *   renderErrorState(containerEl, "Failed to load data", { onRetry: () => fetchData() });
 *
 *   // Clear
 *   clearUIState(containerEl);
 */

// ── Escape helper (inline to avoid circular dependency) ──────────

const esc = (s) => {
    const map = {
        "\x26": "\x26amp;",
        "\x3C": "\x26lt;",
        "\x3E": "\x26gt;",
        "\x22": "\x26quot;",
        "\x27": "\x26#39;"
    };
    return String(s ?? "").replace(/[&<>"']/g, (c) => map[c] || c);
};

// ── SVG Icons (inline for zero-dependency) ───────────────────────

const ICONS = {
    loading: `<svg class="ui-state__spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="3"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    empty: `<svg class="ui-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="12" y2="17"/>
    </svg>`,
    error: `<svg class="ui-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
    skeleton: `<div class="ui-state__skeleton" aria-hidden="true">
        <div class="ui-state__skeleton-line ui-state__skeleton-line--w75"></div>
        <div class="ui-state__skeleton-line ui-state__skeleton-line--w100"></div>
        <div class="ui-state__skeleton-line ui-state__skeleton-line--w60"></div>
        <div class="ui-state__skeleton-line ui-state__skeleton-line--w90"></div>
    </div>`,
};

// ── CSS class constants ──────────────────────────────────────────

const BASE_CLASS = "ui-state";

// ── Internal: create wrapper ─────────────────────────────────────

/**
 * Creates a wrapper div with consistent base classes.
 * @param {string} type - "loading", "empty", "error", "skeleton"
 * @returns {HTMLElement}
 */
function createWrapper(type) {
    const wrapper = document.createElement("div");
    wrapper.className = `${BASE_CLASS} ${BASE_CLASS}--${type}`;
    wrapper.setAttribute("role", type === "error" ? "alert" : "status");
    wrapper.setAttribute("aria-live", "polite");
    return wrapper;
}

// ── Public: renderLoadingState ───────────────────────────────────

/**
 * Display a loading state with optional spinner and message.
 *
 * @param {HTMLElement} containerEl - Target container element
 * @param {string} [message="Loading..."] - Loading message text
 * @param {Object} [options]
 * @param {boolean} [options.spinner=true] - Show spinner
 * @param {boolean} [options.skeleton=false] - Show skeleton placeholders instead of spinner
 */
export function renderLoadingState(containerEl, message = "Loading...", options = {}) {
    const { spinner = true, skeleton = false } = options;
    clearUIState(containerEl);

    const wrapper = createWrapper(skeleton ? "skeleton" : "loading");
    wrapper.setAttribute("aria-busy", "true");

    if (spinner && !skeleton) {
        wrapper.innerHTML += ICONS.loading;
    }

    if (skeleton) {
        wrapper.innerHTML += ICONS.skeleton;
    } else if (message) {
        const msg = document.createElement("p");
        msg.className = `${BASE_CLASS}__message`;
        msg.textContent = message;
        wrapper.appendChild(msg);
    }

    containerEl.appendChild(wrapper);
}

// ── Public: renderEmptyState ─────────────────────────────────────

/**
 * Display an empty state with icon and optional call-to-action.
 *
 * @param {HTMLElement} containerEl - Target container element
 * @param {string} [message="No items found"] - Empty state message
 * @param {string} [ctaText] - Optional call-to-action button text
 * @param {Object} [options]
 * @param {Function} [options.onCta] - Callback when CTA button is clicked
 * @param {boolean} [options.icon=true] - Show empty icon
 */
export function renderEmptyState(containerEl, message = "No items found", ctaText, options = {}) {
    const { onCta, icon = true } = options;
    clearUIState(containerEl);

    const wrapper = createWrapper("empty");

    if (icon) {
        wrapper.innerHTML += ICONS.empty;
    }

    const msg = document.createElement("p");
    msg.className = `${BASE_CLASS}__message`;
    msg.textContent = message;
    wrapper.appendChild(msg);

    if (ctaText && onCta) {
        const btn = document.createElement("button");
        btn.className = `${BASE_CLASS}__cta`;
        btn.type = "button";
        btn.textContent = ctaText;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            onCta();
        });
        wrapper.appendChild(btn);
    }

    containerEl.appendChild(wrapper);
}

// ── Public: renderErrorState ─────────────────────────────────────

/**
 * Display an error state with message, optional retry button, and optional details.
 *
 * @param {HTMLElement} containerEl - Target container element
 * @param {string} [message="Failed to load data"] - Error message
 * @param {Object} [options]
 * @param {Function} [options.onRetry] - Retry callback (shown as button)
 * @param {string} [options.retryText="Retry"] - Retry button text
 * @param {string} [options.details] - Technical error details (shown in collapsible <details>)
 * @param {boolean} [options.icon=true] - Show error icon
 */
export function renderErrorState(containerEl, message = "Failed to load data", options = {}) {
    const { onRetry, retryText = "Retry", details, icon = true } = options;
    clearUIState(containerEl);

    const wrapper = createWrapper("error");

    if (icon) {
        wrapper.innerHTML += ICONS.error;
    }

    const msg = document.createElement("p");
    msg.className = `${BASE_CLASS}__message`;
    msg.textContent = message;
    wrapper.appendChild(msg);

    if (onRetry) {
        const btn = document.createElement("button");
        btn.className = `${BASE_CLASS}__cta ${BASE_CLASS}__cta--retry`;
        btn.type = "button";
        btn.textContent = retryText;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            // Show loading state on retry
            renderLoadingState(containerEl, "Retrying...");
            onRetry();
        });
        wrapper.appendChild(btn);
    }

    if (details) {
        const detailsEl = document.createElement("details");
        detailsEl.className = `${BASE_CLASS}__details`;

        const summary = document.createElement("summary");
        summary.textContent = "Technical details";
        detailsEl.appendChild(summary);

        const pre = document.createElement("pre");
        pre.textContent = details;
        detailsEl.appendChild(pre);

        wrapper.appendChild(detailsEl);
    }

    containerEl.appendChild(wrapper);
}

// ── Public: clearUIState ─────────────────────────────────────────

/**
 * Remove all UI state elements from a container.
 *
 * @param {HTMLElement} containerEl - Container to clear
 */
export function clearUIState(containerEl) {
    if (!containerEl) return;
    const existing = containerEl.querySelectorAll(`.${BASE_CLASS}`);
    existing.forEach((el) => el.remove());
}

// ── Convenience: inline skeleton for cards ───────────────────────

/**
 * Create a skeleton card placeholder (for use inside grid layouts).
 * Useful for showing loading placeholders in card-based layouts.
 *
 * @param {number} [count=1] - Number of skeleton cards to generate
 * @returns {string} HTML string of skeleton cards
 */
export function skeletonCards(count = 1) {
    let html = "";
    for (let i = 0; i < count; i++) {
        html += `<div class="${BASE_CLASS}--skeleton-card" aria-hidden="true">
            <div class="ui-state__skeleton-line ui-state__skeleton-line--w40 ui-state__skeleton-line--h-lg"></div>
            <div class="ui-state__skeleton-line ui-state__skeleton-line--w80"></div>
            <div class="ui-state__skeleton-line ui-state__skeleton-line--w60"></div>
        </div>`;
    }
    return html;
}