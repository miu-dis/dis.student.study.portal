// DIS Student Portal — Mobile App Mode
// Detects PWA/Capacitor standalone mode and activates app-mode UI

import { initRipple } from "./portal-ui.js";

/**
 * Check if running in standalone app mode (PWA or Capacitor)
 */
export function isAppMode() {
    return (
        // Android Chrome PWA
        window.matchMedia("(display-mode: standalone)").matches ||
        // iOS Safari PWA
        (typeof navigator !== "undefined" && navigator.standalone) ||
        // Capacitor
        (typeof window.__capacitor !== "undefined")
    );
}

/**
 * Activate app-mode CSS and mobile-specific features
 */
export function activateAppMode() {
    if (!isAppMode()) return;

    document.body.classList.add("app-mode");

    // Service Worker registration
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
            console.warn("[MobileApp] Service Worker registration failed:", err);
        });
    }

    // Init bottom navigation
    initBottomNav();

    // Intercept view switching for page transitions
    interceptViewSwitching();

    // Init pull-to-refresh on marked containers
    document.querySelectorAll("[data-pull-refresh]").forEach(initPullToRefresh);

    // Replace native selects with bottom sheets (marked with data-native)
    replaceSelectsWithBottomSheets();

    // Apply ripple effect to dynamically created select triggers
    initRipple(".app-select-trigger");

    console.log("[MobileApp] App mode activated");
}

// ─── Bottom Tab Navigation ────────────────────────────────────────

function initBottomNav() {
    const nav = document.getElementById("appBottomNav");
    if (!nav) return;

    // Show the nav (hidden by default)
    nav.classList.remove("hidden");

    const tabs = nav.querySelectorAll(".app-tab-item");
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabName = tab.dataset.tab;
            if (!tabName) return;

            // Update active state
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            // Dispatch event for page-level handling
            window.dispatchEvent(
                new CustomEvent("appTabChange", { detail: { tab: tabName } })
            );

            // Scroll to target section if exists
            const target = document.getElementById(tabName + "Section");
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

// ─── Page Transition Interception ─────────────────────────────────

function interceptViewSwitching() {
    // Intercept show/hide of detail views to add app-style page transitions.
    // Uses MutationObserver on the class attribute — when a detail view is
    // shown (hidden removed), we add the slide-in-right animation.  When it
    // is hidden (hidden added) after being shown with the app transition, we
    // briefly restore visibility to play the slide-out-left animation before
    // re-hiding.  This works alongside the page's existing open/close logic
    // without interfering with it.
    const viewPairs = [
        { main: "homeMainContent", detail: "courseDetailView" },
        { main: "homeMainContent", detail: "dailyResourcesView" },
    ];

    viewPairs.forEach(({ main, detail }) => {
        const detailEl = document.getElementById(detail);
        const mainEl = document.getElementById(main);
        if (!detailEl || !mainEl) return;

        let animatingOut = false;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type !== "attributes" || mutation.attributeName !== "class") return;

                const isHidden = detailEl.classList.contains("hidden");
                const hasEnter = detailEl.classList.contains("app-page-enter");

                // Detail view is being shown — add enter animation
                if (!isHidden && !hasEnter && !animatingOut) {
                    detailEl.classList.add("app-page-enter");
                }

                // Detail view is being hidden after an app transition — play exit animation
                if (isHidden && hasEnter && !animatingOut) {
                    animatingOut = true;
                    // Temporarily restore visibility so the animation can play
                    detailEl.classList.remove("hidden");
                    detailEl.classList.remove("app-page-enter");
                    detailEl.classList.add("app-page-back");
                    // Ensure main content is visible (original handler may have already done this)
                    mainEl.classList.remove("hidden");
                    // Re-hide after the exit animation completes
                    setTimeout(() => {
                        detailEl.classList.add("hidden");
                        detailEl.classList.remove("app-page-back");
                        animatingOut = false;
                    }, 220);
                }
            });
        });
        observer.observe(detailEl, { attributes: true, attributeFilter: ["class"] });
    });
}

// ─── Pull-to-Refresh ──────────────────────────────────────────────

export function initPullToRefresh(container) {
    let pullStart = 0;
    let pulling = false;
    let pullDistance = 0;
    let refreshing = false;
    const THRESHOLD = 60;

    // Create indicator
    const indicator = document.createElement("div");
    indicator.className = "app-pull-indicator";

    const computedStyle = window.getComputedStyle(container);
    if (computedStyle.position === "static") {
        container.style.position = "relative";
    }
    container.prepend(indicator);

    container.addEventListener(
        "touchstart",
        (e) => {
            if (refreshing) return;
            if (container.scrollTop <= 0) {
                pullStart = e.touches[0].clientY;
            }
        },
        { passive: true }
    );

    container.addEventListener(
        "touchmove",
        (e) => {
            if (refreshing) return;
            if (container.scrollTop <= 0) {
                pullDistance = e.touches[0].clientY - pullStart;
                if (pullDistance > 10 && !pulling) {
                    pulling = true;
                }
                if (pulling) {
                    indicator.classList.add("ready");
                    if (pullDistance >= THRESHOLD) {
                        indicator.classList.add("ready");
                    }
                }
            }
        },
        { passive: true }
    );

    container.addEventListener("touchend", async () => {
        if (!pulling || refreshing) {
            pullDistance = 0;
            return;
        }
        if (pullDistance >= THRESHOLD) {
            refreshing = true;
            indicator.classList.remove("ready");
            indicator.classList.add("active");
            // Trigger refresh
            const refreshFnName = container.dataset.pullRefresh;
            if (refreshFnName && typeof window[refreshFnName] === "function") {
                try {
                    await window[refreshFnName]();
                } catch (err) {
                    console.warn("[MobileApp] Pull-to-refresh error:", err);
                }
            }
            // Also dispatch a custom event
            container.dispatchEvent(new CustomEvent("pullRefresh"));
        }
        // Clean up indicator state
        indicator.classList.remove("active", "ready");
        pulling = false;
        pullDistance = 0;
        refreshing = false;
    });
}

// ─── Bottom Sheet Select ──────────────────────────────────────────

function replaceSelectsWithBottomSheets() {
    document.querySelectorAll("body.app-mode select[data-native]").forEach((select) => {
        if (select.dataset.sheetInit) return;
        select.dataset.sheetInit = "1";
        select.style.display = "none";

        // Create trigger
        const wrapper = document.createElement("div");
        wrapper.className = "app-select-trigger portal-ripple-host";
        const selectedText =
            select.options[select.selectedIndex]?.text || "Select...";
        wrapper.innerHTML = `
            <span class="app-select-value">${selectedText}</span>
            <i class="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
        `;
        select.parentNode.insertBefore(wrapper, select);

        // Create bottom sheet
        const backdrop = document.createElement("div");
        backdrop.className = "app-bottom-sheet-backdrop";

        const sheet = document.createElement("div");
        sheet.className = "app-bottom-sheet";

        // Drag handle
        const handle = document.createElement("div");
        handle.className = "app-bottom-sheet-handle";
        sheet.appendChild(handle);

        const label = document.createElement("div");
        label.className = "app-bottom-sheet-label";
        label.textContent = select.getAttribute("aria-label") || "Select option";
        sheet.appendChild(label);

        Array.from(select.options).forEach((opt) => {
            const div = document.createElement("div");
            div.className =
                "app-bottom-sheet-option" + (opt.selected ? " selected" : "");
            div.dataset.value = opt.value;
            div.textContent = opt.text;
            div.addEventListener("click", () => {
                select.value = opt.value;
                select.dispatchEvent(new Event("change", { bubbles: true }));
                wrapper.querySelector(".app-select-value").textContent =
                    opt.text;
                sheet
                    .querySelectorAll(".selected")
                    .forEach((el) => el.classList.remove("selected"));
                div.classList.add("selected");
                closeSheet();
            });
            sheet.appendChild(div);
        });

        backdrop.appendChild(sheet);
        document.body.appendChild(backdrop);

        wrapper.addEventListener("click", () => {
            backdrop.classList.add("open");
            sheet.classList.add("open");
        });

        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) closeSheet();
        });

        function closeSheet() {
            backdrop.classList.remove("open");
            sheet.classList.remove("open");
        }
    });
}

// ─── Auto-init on load ────────────────────────────────────────────

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activateAppMode);
} else {
    activateAppMode();
}