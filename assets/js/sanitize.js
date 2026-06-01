// =============================================================================
// Input Sanitization Utility
// Provides safe DOM insertion with XSS protection.
// Inline implementation — no external DOMPurify dependency needed for this scope.
// =============================================================================

/**
 * Escape HTML special characters to prevent XSS injection.
 * Use this for any user-generated content before inserting into innerHTML.
 * @param {string} text - Raw user input
 * @returns {string} HTML-safe escaped string
 */
export function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Sanitize a URL for safe use in href attributes.
 * Only allows http:, https:, and data: protocols.
 * @param {string} url
 * @returns {string} Sanitized URL or empty string if unsafe
 */
export function sanitizeUrl(url) {
    const trimmed = String(url || "").trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("https://") || trimmed.startsWith("http://") || trimmed.startsWith("data:")) {
        return trimmed;
    }
    return "";
}

/**
 * Sanitize plain text — strip ALL HTML tags, leaving only text content.
 * Use when you need plain text (e.g., for title attributes, aria-labels).
 * @param {string} text
 * @returns {string} Plain text with no HTML tags
 */
export function sanitizePlainText(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}