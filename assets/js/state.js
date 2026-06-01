/**
 * state.js — Centralized Application State Management
 *
 * Replaces scattered global vars, DOM attribute reads, and localStorage
 * with a single reactive store. Both portal and admin modules import from here.
 *
 * Usage:
 *   import { state, subscribe, setState, resetState } from "./state.js";
 *
 *   // Read
 *   console.log(state.user.uid);
 *
 *   // Write (triggers subscribers)
 *   setState("user", { uid: "abc123", name: "Rahim" });
 *
 *   // Subscribe to changes
 *   const unsub = subscribe("user", (newUser) => {
 *       document.getElementById("welcomeMsg").innerText = "Hello, " + newUser.name;
 *   });
 *   // Later: unsub(); // stop listening
 *
 *   // Reset everything (e.g., on logout)
 *   resetState();
 */

// ── Initial default state ────────────────────────────────────────

const INITIAL_STATE = Object.freeze({
    /** @type {{ uid: string|null, name: string, email: string, isProfileIncomplete: boolean, base64Pic: string }} */
    user: {
        uid: null,
        name: "",
        email: "",
        isProfileIncomplete: false,
        base64Pic: "",
    },

    /** @type {{ trimesterKey: string, filters: { year: string, termNum: string, season: string, program: string, sessionYear: string } }} */
    academic: {
        trimesterKey: "",
        filters: {
            year: "",
            termNum: "",
            season: "",
            program: "",
            sessionYear: "",
        },
    },

    /** @type {{ mapped: Array, snapshot: any, activeDetailIndex: number|null, renderTimer: number|null }} */
    courses: {
        mapped: [],
        snapshot: null,
        activeDetailIndex: null,
        renderTimer: null,
    },

    /** @type {{ snapshot: any }} */
    resources: {
        snapshot: null,
    },

    /** @type {{ lang: string, dir: string }} */
    ui: {
        lang: "en",
        dir: "ltr",
    },
});

// ── Internal state (mutable) ─────────────────────────────────────

/** @type {typeof INITIAL_STATE} */
let _state = JSON.parse(JSON.stringify(INITIAL_STATE));

// ── Subscriber system ────────────────────────────────────────────

/** @type {Map<string, Set<Function>>} */
const _subscribers = new Map();

/**
 * Subscribe to changes on a specific state key.
 *
 * @param {string} key - Top-level state key to watch (e.g., "user", "academic", "ui")
 * @param {Function} callback - Called with (newValue, oldValue) when key changes
 * @returns {Function} Unsubscribe function — call to stop listening
 */
export function subscribe(key, callback) {
    if (!_subscribers.has(key)) {
        _subscribers.set(key, new Set());
    }
    _subscribers.get(key).add(callback);

    // Return unsubscribe function
    return () => {
        const set = _subscribers.get(key);
        if (set) {
            set.delete(callback);
            if (set.size === 0) _subscribers.delete(key);
        }
    };
}

/**
 * Notify all subscribers of a key that its value has changed.
 * @param {string} key
 * @param {*} newValue
 * @param {*} oldValue
 */
function _notify(key, newValue, oldValue) {
    const set = _subscribers.get(key);
    if (!set) return;
    for (const cb of set) {
        try {
            cb(newValue, oldValue);
        } catch (e) {
            console.error(`[state.js] Subscriber error for key "${key}":`, e);
        }
    }
}

// ── Public state proxy (read-only reference) ─────────────────────

/**
 * Read-only state object. To modify state, use setState().
 * Note: This is a frozen snapshot — nested objects are also frozen.
 * Use subscribe() to react to changes.
 */
export const state = new Proxy(_state, {
    get(target, prop) {
        if (prop in target) {
            return target[prop];
        }
        return undefined;
    },
    set() {
        console.warn("[state.js] Direct mutation is not allowed. Use setState(key, value) instead.");
        return false;
    },
});

// ── Mutation ─────────────────────────────────────────────────────

/**
 * Update a top-level state key. Deep-merges objects, replaces primitives.
 * Triggers all subscribers for that key.
 *
 * @param {string} key - Top-level key to update (e.g., "user", "academic", "courses")
 * @param {*} value - New value. For objects, performs a shallow merge with existing.
 * @param {boolean} [silent=false] - If true, don't notify subscribers
 */
export function setState(key, value, silent = false) {
    if (!(key in _state)) {
        console.warn(`[state.js] Unknown state key: "${key}"`);
        return;
    }

    const oldValue = _state[key];

    // Shallow merge for objects, direct replace for primitives
    if (typeof value === "object" && value !== null && !Array.isArray(value) && typeof oldValue === "object" && oldValue !== null && !Array.isArray(oldValue)) {
        _state[key] = { ...oldValue, ...value };
    } else {
        _state[key] = value;
    }

    if (!silent) {
        _notify(key, _state[key], oldValue);
    }
}

/**
 * Reset all state to initial defaults. Notifies all subscribers.
 */
export function resetState() {
    const oldState = JSON.parse(JSON.stringify(_state));
    _state = JSON.parse(JSON.stringify(INITIAL_STATE));

    // Notify all keys that have subscribers
    for (const [key] of _subscribers) {
        if (key in _state) {
            _notify(key, _state[key], oldState[key]);
        }
    }
}

// ── Convenience setters for common patterns ──────────────────────

/**
 * Set the current user, merging into state.user.
 * @param {{ uid?: string, name?: string, email?: string, isProfileIncomplete?: boolean, base64Pic?: string }} userPartial
 */
export function setUser(userPartial) {
    setState("user", userPartial);
}

/**
 * Clear the current user (on logout).
 */
export function clearUser() {
    setState("user", { ...INITIAL_STATE.user });
}

/**
 * Set the current academic trimester key.
 * @param {string} key
 */
export function setTrimesterKey(key) {
    setState("academic", { trimesterKey: key });
}

/**
 * Set academic filter values (partial update).
 * @param {{ year?: string, termNum?: string, season?: string, program?: string, sessionYear?: string }} filters
 */
export function setAcademicFilters(filters) {
    setState("academic", { filters: { ..._state.academic.filters, ...filters } });
}

/**
 * Set the UI language and direction.
 * @param {string} lang - Language code (e.g., "en", "bn", "ar")
 * @param {string} [dir] - Text direction ("ltr" or "rtl"). Auto-detected if omitted.
 */
export function setUILang(lang, dir) {
    const resolvedDir = dir || (lang === "ar" ? "rtl" : "ltr");
    setState("ui", { lang, dir: resolvedDir });
}