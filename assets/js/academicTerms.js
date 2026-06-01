/** Academic session: season + program type (stored in profileTerm / mapping keys) */
export const SESSION_SEASONS = ["Spring", "Summer", "Fall"];

export const SESSION_PROGRAMS = [
    { value: "regular", label: "Regular" },
    { value: "weekend", label: "Weekend" },
];

export const SESSION_TERMS = SESSION_SEASONS.flatMap((season) =>
    SESSION_PROGRAMS.map((p) => `${season} (${p.value})`)
);

export const CALENDAR_SESSION_START = 2026;
export const CALENDAR_SESSION_END = 2030;

/** Profile modal + archive calendar year dropdown (2026–2030) */
export const PROFILE_SESSION_YEARS = ["2026", "2027", "2028", "2029", "2030"];

export function getCalendarSessionYears() {
    const years = [];
    for (let y = CALENDAR_SESSION_START; y <= CALENDAR_SESSION_END; y++) {
        years.push(String(y));
    }
    return years;
}

// ── Dynamic year / batch generators (Phase 5.4) ──────────────────

/** Number of years to show before and after current year */
const YEAR_WINDOW = 2;

/**
 * Get dynamic session/academic years centered on current year.
 * Example: 2026 → ["2024", "2025", "2026", "2027", "2028"]
 * @param {number} [window=2] - Years on each side of current year
 * @returns {string[]}
 */
export function getDynamicSessionYears(window = YEAR_WINDOW) {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - window; y <= currentYear + window; y++) {
        years.push(String(y));
    }
    return years;
}

/**
 * Fill a <select> element with dynamic session years.
 * Also sets the closest matching value if already selected or auto-selects current year.
 *
 * @param {HTMLSelectElement} selectEl - The select element to populate
 * @param {string} [selectedValue] - Optional pre-selected value
 * @param {number} [window=2] - Years on each side of current year
 */
export function fillYearSelect(selectEl, selectedValue, window = YEAR_WINDOW) {
    if (!selectEl) return;
    const years = getDynamicSessionYears(window);

    selectEl.innerHTML = years.map(
        (y) => `<option value="${y}"${y === selectedValue ? " selected" : ""}>${y}</option>`
    ).join("");

    // If no pre-selected value and current year is in range, select it
    if (!selectedValue && !selectEl.value) {
        const currentYear = String(new Date().getFullYear());
        if (years.includes(currentYear)) {
            selectEl.value = currentYear;
        } else if (selectEl.options.length > 0) {
            selectEl.selectedIndex = 0;
        }
    }
}

/**
 * Compute batch numbers from a session year.
 * DIS batch format: e.g., session 2026 → batches 64, 65, 66
 * The formula: baseBatch = sessionYear - 1962 (approximate DIS batch numbering)
 *
 * @param {string|number} sessionYear - Session year (e.g., "2026")
 * @returns {string[]} Array of batch numbers
 */
export function getBatchNumbers(sessionYear) {
    const sy = parseInt(sessionYear, 10);
    if (isNaN(sy)) return [];
    // DIS batch calculation: batch number ≈ year since 1962 establishment
    const base = sy - 1962;
    return [
        String(base),
        String(base + 1),
        String(base + 2),
    ];
}

/**
 * Fill a <select> element with batch numbers computed from a session year.
 *
 * @param {HTMLSelectElement} selectEl - The select element to populate
 * @param {string|number} sessionYear - Session year to derive batches from
 * @param {string} [selectedValue] - Optional pre-selected batch value
 */
export function fillBatchSelect(selectEl, sessionYear, selectedValue) {
    if (!selectEl) return;
    const batches = getBatchNumbers(sessionYear);

    selectEl.innerHTML = batches.map(
        (b) => `<option value="${b}"${b === selectedValue ? " selected" : ""}>${b}</option>`
    ).join("");

    if (!selectedValue && !selectEl.value && selectEl.options.length > 0) {
        selectEl.selectedIndex = 0;
    }
}

/**
 * Get trimesters/terms 1-N for populating term number dropdowns.
 *
 * @param {number} [count=3] - Number of terms (DIS uses trimesters = 3)
 * @returns {string[]}
 */
export function getTrimesterNumbers(count = 3) {
    const nums = [];
    for (let i = 1; i <= count; i++) {
        nums.push(String(i));
    }
    return nums;
}

/**
 * Fill a <select> element with trimester/term numbers.
 *
 * @param {HTMLSelectElement} selectEl
 * @param {string} [selectedValue]
 * @param {number} [count=3]
 */
export function fillTrimesterSelect(selectEl, selectedValue, count = 3) {
    if (!selectEl) return;
    const nums = getTrimesterNumbers(count);

    selectEl.innerHTML = nums.map(
        (n) => `<option value="${n}"${n === selectedValue ? " selected" : ""}>${n}</option>`
    ).join("");

    if (!selectedValue && !selectEl.value && selectEl.options.length > 0) {
        selectEl.selectedIndex = 0;
    }
}

/**
 * Update batch options when session year changes.
 * Convenience for chaining: on year select change → update batch select.
 *
 * @param {HTMLSelectElement} yearSelect - Year select (reads its .value)
 * @param {HTMLSelectElement} batchSelect - Batch select to repopulate
 */
export function syncBatchSelectFromYear(yearSelect, batchSelect) {
    if (!yearSelect || !batchSelect) return;
    fillBatchSelect(batchSelect, yearSelect.value);
}

export function combineSessionTerm(season, program) {
    const s = SESSION_SEASONS.includes(season) ? season : "Spring";
    const p = program === "weekend" ? "weekend" : "regular";
    return `${s} (${p})`;
}

export function splitSessionTerm(term) {
    const norm = normalizeSessionTerm(term);
    const m = norm.match(/^(Spring|Summer|Fall)\s+\((regular|weekend)\)$/i);
    if (m) return { season: m[1], program: m[2].toLowerCase() };
    if (SESSION_SEASONS.includes(norm)) return { season: norm, program: "regular" };
    return { season: "Spring", program: "regular" };
}

/** Map legacy profileTerm / filter values to the new labeled format */
export function normalizeSessionTerm(term) {
    if (!term) return "Spring (regular)";
    const t = String(term).trim();
    if (t === "Spring" || t === "Summer" || t === "Fall") return `${t} (regular)`;
    return t;
}

export function buildTrimesterKey(year, termNum, term, sessionYear) {
    const sessionTerm = normalizeSessionTerm(term);
    return `${year} - ${termNum} (${sessionTerm} ${sessionYear})`;
}

/** Normalize full semester keys, including legacy "(Spring 2026)" without program type */
export function normalizeTrimesterKey(key) {
    if (!key || !key.includes("(")) return key;
    const closeIdx = key.lastIndexOf(")");
    const openIdx = key.indexOf("(");
    if (openIdx < 0 || closeIdx < 0) return key;
    const prefix = key.slice(0, openIdx).trim();
    const inner = key.slice(openIdx + 1, closeIdx).trim();
    const yearMatch = inner.match(/\s+(20\d{2})$/);
    if (!yearMatch) return key;
    const sessionYear = yearMatch[1];
    const termPart = inner.slice(0, inner.length - yearMatch[0].length).trim();
    const dashIdx = prefix.indexOf(" - ");
    if (dashIdx < 0) return key;
    const yr = prefix.slice(0, dashIdx).trim();
    const termNum = prefix.slice(dashIdx + 3).trim();
    return buildTrimesterKey(yr, termNum, termPart, sessionYear);
}

export function getArchiveSessionFull(season, program, sessionYear) {
    return `${combineSessionTerm(season, program)} ${sessionYear}`;
}

/** Legacy course_mapping doc ids used Spring/Summer/Fall without (regular)/(weekend) */
export function toLegacyTrimesterKey(key) {
    const norm = normalizeTrimesterKey(key);
    const closeIdx = norm.lastIndexOf(")");
    const openIdx = norm.indexOf("(");
    if (openIdx < 0 || closeIdx < 0) return null;
    const prefix = norm.slice(0, openIdx).trim();
    const inner = norm.slice(openIdx + 1, closeIdx).trim();
    const yearMatch = inner.match(/\s+(20\d{2})$/);
    if (!yearMatch) return null;
    const sessionYear = yearMatch[1];
    const termPart = inner.slice(0, inner.length - yearMatch[0].length).trim();
    if (!termPart.endsWith(" (regular)")) return null;
    const legacyTerm = termPart.slice(0, -" (regular)".length);
    return `${prefix} (${legacyTerm} ${sessionYear})`;
}

export function fillSessionTermSelect(selectEl, selectedValue) {
    if (!selectEl) return;
    selectEl.innerHTML = SESSION_TERMS.map(
        (v) => `<option value="${v}">${v}</option>`
    ).join("");
    const norm = normalizeSessionTerm(selectedValue || selectEl.value);
    selectEl.value = SESSION_TERMS.includes(norm) ? norm : "Spring (regular)";
}

/** Class Shared Resources Archive: season, program, calendar year as separate dropdowns */
export function fillArchiveSessionFilters({ seasonEl, programEl, yearEl, profileTerm, sessionYear }) {
    if (seasonEl) {
        seasonEl.innerHTML = SESSION_SEASONS.map(
            (s) => `<option value="${s}">${s}</option>`
        ).join("");
    }
    if (programEl) {
        programEl.innerHTML = SESSION_PROGRAMS.map(
            (p) => `<option value="${p.value}">${p.label}</option>`
        ).join("");
    }
    if (yearEl) {
        yearEl.innerHTML = getCalendarSessionYears()
            .map((y) => `<option value="${y}">${y}</option>`)
            .join("");
        if (!yearEl.value && yearEl.options.length) yearEl.selectedIndex = 0;
    }
    if (seasonEl && !seasonEl.value && seasonEl.options.length) seasonEl.selectedIndex = 0;
    if (programEl && !programEl.value && programEl.options.length) programEl.selectedIndex = 0;
    if (profileTerm !== undefined || sessionYear !== undefined) {
        const { season, program } = splitSessionTerm(profileTerm);
        if (seasonEl && SESSION_SEASONS.includes(season)) seasonEl.value = season;
        if (programEl) programEl.value = program === "weekend" ? "weekend" : "regular";
        if (yearEl) {
            const y = String(sessionYear || CALENDAR_SESSION_START);
            if ([...yearEl.options].some((o) => o.value === y)) yearEl.value = y;
        }
    }
}
