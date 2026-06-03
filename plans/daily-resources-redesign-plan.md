# Redesign Plan: Daily Resources Integration into Course Detail & Bug Fixes

## Overview

Three tasks bundled together:
1. **Remove** daily resources badge from routine cards
2. **Move** daily resources functionality into Course Detail → View Materials tab (with date selector based on daily routine)
3. **Add** date-based threading to Discussion tab
4. **Fix** `deleteDoc is not a function` bug in student resource delete

---

## Bug: `deleteDoc is not a function`

### Root Cause
In [`_bindClassSectionEvents()`](assets/js/portal/dailyResources.js:196), the `deleteResourceById` call passes `{ getDoc, doc, db }` — missing `deleteDoc`. `deleteResourceById` in [`upload.js`](assets/js/portal/upload.js:206) destructures `{ getDoc, doc, db, deleteDoc }` and calls `deleteDoc(doc(...))`. Since `deleteDoc` is undefined, it throws.

The same issue exists in the firestore object constructed in [`index.html`](index.html:1145) (badge click path, line ~1280 for hash navigation) — both omit `deleteDoc`.

### Fix (3 locations)
1. [`dailyResources.js`](assets/js/portal/dailyResources.js:270-281): Include `deleteDoc` in destructured firestore and pass it
2. [`index.html`](index.html:1145): Add `deleteDoc: deleteDoc` to firestore object in badge click handler
3. [`index.html`](index.html:1279): Add `deleteDoc: deleteDoc` to firestore object in hash navigation handler

---

## Task A: Remove Resources Badge from Routine Cards

### Files to modify:
- [`assets/js/portal/routines.js`](assets/js/portal/routines.js:89-94): Remove `resourceBadge` generation from `buildRoutineCardHTML`
- [`assets/js/portal/routines.js`](assets/js/portal/routines.js:77): Remove `opts.resourcesSnapshot` parameter from `buildRoutineCardHTML`
- [`assets/js/portal/routines.js`](assets/js/portal/routines.js:128-136): Remove `getResourcesSnapshot` parameter from `initRoutineAndNoticeListeners`
- [`assets/js/portal/routines.js`](assets/js/portal/routines.js:151-153): Remove usage of `getResourcesSnapshot` inside listener
- [`index.html`](index.html:1116-1121): Remove `getResourcesSnapshot` callback from `initRoutineAndNoticeListeners` call
- [`index.html`](index.html:1124-1162): Remove the badge click delegation handler on `#dailyRoutineList`

---

## Task B: Add Daily Date Selector to Course Detail → View Materials

### Concept
When viewing a course's "Shared materials" tab, a date selector appears showing all dates when this course has a routine slot. Selecting a date filters resources to that specific date. An "All dates" option shows all resources (current behavior).

### Implementation

#### B1. Query routines for the course
In `index.html` → `_renderCourseDetail()`, query the `routines` collection filtered by `courseCode`. Collect unique dates. Build a `<select>` dropdown.

#### B2. Add date selector UI
Add a `<select>` element in the Course Detail sidebar (below the upload button) or above the resources list. Options:
- "All Dates" (default — shows all resources for the course)
- Each date from routines (e.g., "2026-06-03 (Wednesday)")

#### B3. Filter resources by selected date
When a date is selected, filter `getResourcesForCourse()` to only return resources matching `routineDate`. When "All Dates" is selected, show everything (current behavior).

#### B4. Upload with date context
When a date is selected, set `window._dailyUploadContext` with the routine date info before opening the share modal. The existing `handleResourceSubmit` already reads `window._dailyUploadContext` and attaches `routineDate`/`routineSlot`/`routineId` to the payload.

#### Files to modify:
- [`assets/js/portal/courses.js`](assets/js/portal/courses.js:245): Modify `renderCourseDetail` to accept optional `availableDates` and `onDateChange` callback
- [`index.html`](index.html:266-291): Add date selector HTML in course detail sidebar area
- [`index.html`](index.html:998-1031): Modify `_renderCourseDetail` to fetch routine dates for the course and render date selector
- [`assets/js/i18n.js`](assets/js/i18n.js:96-104): Add translations: `dailySelectDate`, `dailyAllDates`

---

## Task C: Add Date-Based Threading to Discussion Tab

### Concept
In the Discussion tab, threads can optionally be tagged with a specific routine date. A date selector (same as View Materials) filters threads. New threads can be linked to a date.

### Implementation

#### C1. Thread data model extension
Threads already have: `title`, `content`, `authorUID`, `authorName`, `createdAt`, `isPinned`, `isLocked`, `replyCount`. Add optional field: `routineDate` (string).

#### C2. Date selector in forum tab
Add a date filter dropdown in the forum tab header that re-filters threads client-side.

#### C3. Thread form: optional date selector
When creating a new thread, include a date selector (only visible when there are routine dates available for this course). Threads without a date are "general" discussions.

#### C4. Thread filtering
When a date is selected, show only threads with `routineDate` matching. "All Dates" shows all threads (current behavior).

#### Files to modify:
- [`assets/js/portal/forum.js`](assets/js/portal/forum.js:40): Modify `renderForumTab` to accept `availableDates` and onSnapshot to filter by date
- [`assets/js/portal/forum.js`](assets/js/portal/forum.js:54-87): Add date selector to forum HTML skeleton
- [`assets/js/portal/forum.js`](assets/js/portal/forum.js:62-80): Add date picker to thread creation form
- [`assets/js/portal/forum.js`](assets/js/portal/forum.js:270-283): Include `routineDate` in thread payload
- [`index.html`](index.html:1019-1030): Pass `availableDates` to `renderForumTab`
- [`assets/js/i18n.js`](assets/js/i18n.js): Add translations: `forumSelectDate`, `forumAllDates`, `forumDateLabel`

---

## Summary of All Files to Modify

| # | File | Changes |
|---|------|---------|
| 1 | `assets/js/portal/routines.js` | Remove resource badge from `buildRoutineCardHTML`, simplify `initRoutineAndNoticeListeners` |
| 2 | `assets/js/portal/courses.js` | Add date selector support to `renderCourseDetail` |
| 3 | `assets/js/portal/forum.js` | Add date selector + date-tagged threads |
| 4 | `assets/js/portal/dailyResources.js` | Fix `deleteDoc` bug (include in firestore destructure) |
| 5 | `assets/js/portal/upload.js` | No changes needed (already handles daily context) |
| 6 | `assets/js/i18n.js` | ~8 new translations (EN + BN) |
| 7 | `index.html` | Remove badge handler, add date selector HTML, fix firestore objects, wire new interactions |