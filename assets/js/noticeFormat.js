import { escapeHtml } from "./sanitize.js";

/** Escape HTML, then apply simple notice formatting: newlines, **bold**, *italic* */
export function formatNoticeContent(raw) {
    if (!raw) return "";
    let s = escapeHtml(raw);
    s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
    s = s.replace(/\n/g, "<br>");
    return s;
}
