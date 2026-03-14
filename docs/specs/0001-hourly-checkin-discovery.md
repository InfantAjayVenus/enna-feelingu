# Discovery: Hourly Check-In (enna-feelingu)

## Why

Most mood tracking apps ask you to reflect at the end of the day, by which point you've forgotten half of it. This app interrupts you every hour with a lightweight prompt — what did you do, how do you feel — so the record is accurate and the habit is low-friction. Everything lives on the device, no account required, no data leaving the phone.

## Who

A single user: the person who installed the app. There are no other roles, no sharing, no social layer. The app is a private daily journal that happens to be time-structured.

## Success Criteria

- The user can complete a check-in in under 30 seconds without opening a menu or navigating anywhere.
- The user can look back at any past day and reconstruct what they were doing and how they felt, hour by hour.
- The user has been actively logging for at least two weeks without losing any data.
- The user can hand off their mood history to another tool (spreadsheet, therapist, personal archive) via export.

## Problem Statement

Mood and productivity are easier to improve when you can see patterns — but patterns require consistent, accurate data. End-of-day journaling is too lossy (you forget the bad 2pm hour by 10pm). enna-feelingu captures the day in real time, one hour at a time, with the smallest possible interruption.

## Hypotheses

- H1: The hourly prompt is the right cadence. If users start skipping more than they log, the interval may need to be configurable.
- H2: Free-text activity entry is enough context. If users find the entries meaningless in retrospect, structured activity categories may be needed.
- H3: A simple chronological list is sufficient for the day view in v1. A drill-down chart (months → weeks → days) is valuable but not necessary to start using the app.
- H4: Notification action buttons (without opening the app) are achievable for this developer's skill level before the end of the project. If not, the in-app screen is a complete solution on its own.

## Out of Scope

- iOS support (Android-first; iOS can follow later)
- Backend sync, cloud storage, or accounts of any kind
- Sharing entries with other people
- Structured activity categories or tags (free text only for now)
- Configurable check-in interval (hourly is fixed for now)
- Reminders or nudges beyond the hourly check-in notification
- Mood streaks, gamification, or achievement badges
- In-app data deletion beyond what the OS provides
- Excel export (not planned; CSV and JSON are sufficient)
- A mood chart spanning months (the list view ships first; the chart is a follow-on)
- Separate DND window (active hours already controls when notifications fire)

---

## Slices

Slices are ordered by "get the core loop working first." Each slice is independently usable and testable before the next one begins.

---

### Slice 1 — In-App Check-In Screen (Walking Skeleton)

**What this delivers:** The complete core loop — log a mood and activity — without any notifications. You open the app, tap to add an entry, and it's saved.

**Why first:** This is the easiest path to a working app. It validates the data model and the entry experience before anything else is built on top of it.

**Acceptance Criteria**

- AC1.1: When the user opens the app for the first time, they see a screen that lets them start a new check-in immediately — no setup required to reach it.
- AC1.2: The check-in form presents mood as a row of 10 tappable buttons (one per score, 1–10), each displaying an emoji that represents the mood level. Alternatively, the mood input may be a slider where a single emoji updates dynamically as the user drags to a new value. Only whole numbers 1–10 are selectable; values outside this range cannot be submitted.
<!-- -------- bee-comment -------- -->
> **@developer**: this input is best in the form of a set of buttons / a slider. We could also use emojis to represent mood. Either 10 buttons with equivalent emojis on it. If its a slider, a single emoji that changes as we slide the pointer to a number.
> **@bee**: Rewrote AC1.2 to specify emoji buttons or dynamic-emoji slider as the two accepted input patterns. The old "accepts whole numbers" phrasing was too abstract — now it describes what the user actually sees and touches.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC1.3: Moods 1–4 are visually distinguished as negative, 5 as neutral, and 6–10 as positive — using color, label, or icon — so the user knows what tier they are selecting before they confirm.
- AC1.4: The check-in form includes a free-text field for "what I did this hour." This field is optional — a check-in with only a mood score can be saved.
- AC1.5: When the user submits a check-in, it is saved to local device storage with a timestamp accurate to the minute.
- AC1.6: After saving, the user sees confirmation that the entry was recorded (a message, a screen change, or a visual cue — not a silent no-op).
- AC1.7: The saved entry persists after the app is closed and reopened. It does not disappear between sessions.
- AC1.8: If the user submits the form with no mood selected, the app shows an inline error and does not save the entry.

---

### Slice 2 — Notification Scheduling (Fixed Clock)

**What this delivers:** The app fires a notification at the top of every hour during the user's configured active hours. Tapping the notification opens the in-app check-in screen.

**Why second:** Notifications turn this from a manual journaling app into a habit-forming prompt system. The check-in screen from Slice 1 becomes the landing target.

**Acceptance Criteria**

- AC2.1: On first launch (or first visit to settings), the user is asked to set their active hours — a start time and an end time for when notifications should fire. The user can select granular time slots within this window (e.g., exclude specific hours) for finer control.
- AC2.2: The app requests notification permission from the device. If the user denies permission, the app explains what will not work and does not crash.
- AC2.3: A notification fires at the top of each hour within the user's active window (e.g., if active hours are 8am–10pm, notifications fire at 8:00, 9:00, 10:00, ... 22:00).
- AC2.4: Tapping a notification opens the app directly to the check-in screen, not to the home screen or history view.
- AC2.5: If the user does not act on a notification, it does not stack — the next hour's notification replaces or supplements it rather than accumulating a pile of unread prompts.
- AC2.6: Notifications continue to fire correctly after the phone has been restarted.
- AC2.7: No notifications fire outside the user's configured active hours.

---

### Slice 3 — Skip Check-In

**What this delivers:** Quality-of-life features that make the hourly cadence sustainable. Skip carries the previous entry forward so the user is not forced to retype when nothing has changed. Auto-skip handles the case when the user simply doesn't respond.

**Why third:** Without skip, the app creates friction when you're doing the same thing you were doing an hour ago. Skip and auto-skip keep the record complete without demanding constant attention.

<!-- -------- bee-comment -------- -->
> **@developer**: given that we explicitly have an active hours window, I don't think we need a separate DND feature.
> **@bee**: Agreed — removed the entire DND sub-section (AC3.1–AC3.4) and renamed this slice from "DND Hours and Skip Check-In" to just "Skip Check-In." The active hours window in Slice 2 already controls when notifications fire, making a separate DND redundant. Added this to Out of Scope as well.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Acceptance Criteria**

**Skip**
- AC3.1: The check-in screen (and/or the notification, if action buttons are available) offers a "Skip — same as last time" option.
- AC3.2: When the user selects Skip, a new entry is created using the mood score and activity text from the most recent saved entry, with the current timestamp.
- AC3.3: If there is no previous entry to copy from, the Skip option is hidden or disabled.
- AC3.4: A skipped entry is stored and visible in history the same way a manually entered one is — it is not discarded.
- AC3.5: A skipped entry is persisted with a `skipped: true` flag (or equivalent) so that it can be distinguished from a manually entered check-in in the history view and in exports.
<!-- -------- bee-comment -------- -->
> **@developer**: the entry that is skipped should have that state persisted along with the rest of the info.
> **@bee**: Added AC3.5 requiring a `skipped` flag to be stored with the entry. This ensures history and export can differentiate skipped entries from manual ones.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Override skipped entries**
- AC3.6: When the user submits a new manual check-in after one or more consecutive skipped entries, the app offers the option to "apply this mood and activity to the skipped hours too" — overriding the carried-forward values with the new entry's values.
- AC3.7: If the user chooses to override, each affected skipped entry is updated with the new mood score and activity text, and a reference to the overriding entry's ID is stored on each overridden entry (e.g., `overriddenByEntryId`).
- AC3.8: Overriding is optional — the user can decline and keep the skipped entries as they were.
<!-- -------- bee-comment -------- -->
> **@developer**: could we add an option for the user such that the newest entry after skipping could be used to override the previously skipped entries? If we're doing this, we should also persist the ID of the entry from which the skipped entries were overrode.
> **@bee**: Added AC3.6–AC3.8 covering the override flow. When the user logs a new manual entry after skips, they can optionally push that entry's values back to the skipped hours. Each overridden entry stores the ID of the entry that overwrote it, so the data trail is clear.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Auto-skip**
- AC3.9: If the user has not responded to a check-in notification within 25 minutes, the app automatically creates a skipped entry (carrying forward the most recent entry's mood and activity, marked as `skipped: true` and `autoSkipped: true`).
- AC3.10: Auto-skip only fires if there is a previous entry to copy from. If no previous entry exists, no auto-skip occurs.
- AC3.11: An auto-skipped entry is subject to the same override behavior described in AC3.6–AC3.8.
- AC3.12: When an auto-skip fires, any pending notification for that hour is dismissed so the user does not see a stale prompt after the entry has already been recorded.
<!-- -------- bee-comment -------- -->
> **@developer**: we should clear any pending notifications once auto-skipped.
> **@bee**: Added AC3.12 requiring that the pending notification is dismissed when auto-skip fires. This prevents the confusing scenario where the user sees a "how are you feeling?" notification for an hour that's already been auto-logged.
> - [ ] mark as resolved
<!-- -------- /bee-comment -------- -->
<!-- -------- bee-comment -------- -->
> **@developer**: we should also explore option for auto-skip if the user hasn't responded for a specific time say 25 minutes.
> **@bee**: Added AC3.9–AC3.11 for auto-skip. After 25 minutes of no response, the app automatically creates a skipped entry with an `autoSkipped` flag. This keeps the record complete even when the user is busy, and these entries can still be overridden later.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

---

### Slice 4 — Retroactive Logging

**What this delivers:** The ability to go back and log a missed hour from within the app. If you ignored a notification (or the phone was in a bag), you can still fill in that slot later.

**Why fourth:** Without this, any disruption creates a permanent gap in the record. Retroactive logging keeps the history clean and the data trustworthy.

**Acceptance Criteria**

- AC4.1: The user can access a "log a past entry" flow from within the app — reachable from the history view or a clearly labelled action.
- AC4.2: In this flow, the user can select any past hour (date + hour) that has no entry or has a skipped/auto-skipped entry. Selecting a skipped hour replaces the skipped entry with the new manual entry.
<!-- -------- bee-comment -------- -->
> **@developer**: given we will have auto-skip in place, we should allow to add entry for hours with either no entry or skipped entry.
> **@bee**: Updated AC4.2 to allow retroactive logging over skipped/auto-skipped hours, not just empty ones. Since auto-skip fills gaps with carried-forward data, the user should be able to replace those with a real entry when they get a chance. The skipped entry is replaced, not duplicated.
> - [ ] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC4.3: Hours in the picker are visibly marked with their status — "logged" (manual entry), "skipped" (available for replacement), or empty (no entry). The user can see the full timeline with all states clearly visible. Only manually logged hours are non-selectable.
<!-- -------- bee-comment -------- -->
> **@developer**: let's not hide, rather visibly mark it as already logged.
> **@bee**: Updated AC4.3 to explicitly require that logged hours remain visible and marked, rather than hidden. This makes the full timeline visible so the user can clearly see which gaps remain.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC4.4: The check-in form for a retroactive entry is identical to the real-time form — same mood input, same activity text field, same validation.
- AC4.5: A saved retroactive entry appears in the history view in its correct chronological position, not appended to the bottom as if it were new.
- AC4.6: The retroactive entry is stored with the selected historical timestamp, not the time of entry.

---

### Slice 5 — History and Retrospective View

**What this delivers:** A way to browse past entries. Starts simple (flat chronological list), with a drill-down chart view (month → week → day) as a follow-on enhancement within this slice.

**Why fifth:** The history view is what makes the data meaningful — without it, you're logging into a void. But it doesn't have to be a chart on day one; a list is enough to start seeing patterns.

**Acceptance Criteria**

**List view (ships first)**
- AC5.1: The user can navigate to a history screen that shows all past entries in reverse-chronological order (most recent first).
- AC5.2: Each entry in the list displays: the date and hour it was recorded, the mood score, and the activity text (if text is empty, the entry still displays the date/hour and mood score).
- AC5.3: The mood score is shown with the same negative / neutral / positive visual treatment used in the check-in form.
- AC5.4: The list is scrollable and handles at least several months of hourly entries without becoming unusably slow.
- AC5.5: If there are no entries yet, the screen shows an empty state message rather than a blank screen.

**Drill-down views (follow-on within this slice)**
- AC5.6: The user can view a monthly overview showing average or representative mood per week for the selected month.
- AC5.7: The user can drill into a specific week from the monthly view, seeing average or representative mood per day.
- AC5.8: The user can drill into a specific day from the weekly view, seeing all entries for that day in chronological order (earliest first).
- AC5.9: A mood chart is shown for the selected day, plotting mood score (y-axis) against hour (x-axis), so the user can see their emotional arc across the day.
- AC5.10: The user can navigate between days (forward/back) without returning to the full list.
<!-- -------- bee-comment -------- -->
> **@developer**: the order of the AC should be as the largest possible view first, then zoom in, not zoom out.
> **@bee**: Reordered AC5.6–AC5.10 so the drill-down starts at monthly (widest), narrows to weekly, then daily with chart. This matches the natural navigation flow: the user lands on a broad view and zooms in to detail.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

---

### Slice 6 — Export

**What this delivers:** A way to get all recorded data off the device in a portable format. CSV and JSON ship first. Excel is a later addition.

**Why last:** Export is valuable but not needed to use the app day-to-day. It becomes relevant after the user has accumulated data worth exporting.

**Acceptance Criteria**

- AC6.1: The user can find an export option within the app — in settings or on the history screen — without it being buried more than two taps deep.
- AC6.2: The user can choose between CSV and JSON as the export format.
- AC6.3: Triggering an export produces a file that is shared via the device's native share sheet (so the user can save it to cloud storage, email it, or open it in another app).
- AC6.4: Before exporting, the user can select a time window to export — with smart defaults such as "Today," "This Week," "This Month," and "All Time." Only windows that contain at least one entry are selectable. If the user selects a window with no entries, the app shows an error toast: "Nothing to export — please log some entries or choose a different time window."
<!-- -------- bee-comment -------- -->
> **@developer**: the user should be able to choose a specific window to export, with smart defaults like today's logs, this week's logs etc., Only windows with valid entries should be allowed to be exported other wise we show error toast saying "Nothing to export, please log some entries of choose a different time window"
> **@bee**: Rewrote AC6.4 to add time-window selection with smart presets and validation. Windows with no entries are not selectable, with a toast message for edge cases. The old "includes every saved entry" behavior is now the "All Time" default.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC6.5: The exported file includes every entry in the selected window: timestamp, mood score, activity text, and whether the entry was a skip, auto-skip, or manual entry.
- AC6.6: A CSV export opens correctly in a spreadsheet application (one row per entry, headers in the first row, no broken encoding for special characters).
- AC6.7: A JSON export is valid, parseable JSON (an array of objects, one per entry).
- AC6.8: The export button is disabled when there are no entries at all, with a visual cue (greyed out) so the user understands why.
<!-- -------- bee-comment -------- -->
> **@developer**: I'd rather have the export button disabled when there are no entries.
> **@bee**: Replaced the old AC6.7 (show a message for empty exports) with AC6.8 requiring the export button itself to be disabled when no entries exist. This is a cleaner UX — prevent the action rather than explain why it failed.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

---

## Milestone Map

<!-- -------- bee-comment -------- -->
> **@developer**: refer to the comments in the previous section to refine this section.
> **@bee**: Updated all phases to reflect: DND removal from Phase 2, new skip features (override, auto-skip, skipped flag) in Phase 2, granular active hours in Phase 2, time-window export selection in Phase 5, and disabled export button behavior.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

### Phase 1 — Walking Skeleton (Slice 1)
The core loop works. The user can open the app, log a mood with emoji buttons or slider, and see it saved. No notifications yet.

### Phase 2 — Prompted Loop (Slices 2 + 3)
The app becomes proactive. Hourly notifications fire on a fixed clock during the user's configured active hours (with granular hour selection). Skip carries the last entry forward with a `skipped` flag. Auto-skip fills in entries after 25 minutes of no response. After skipping, the user can override previous skipped entries with a fresh manual check-in. A timeboxed spike explores notification action buttons and floating popup feasibility.

### Phase 3 — Complete Record (Slice 4)
Retroactive logging closes the gaps. Any missed hour can be filled in after the fact, with already-logged hours visibly marked in the picker.

### Phase 4 — Meaningful History (Slice 5, list first)
The user can browse everything they have logged. A flat list ships first; the drill-down views follow — monthly overview → weekly → daily with mood chart.

### Phase 5 — Data Portability (Slice 6)
Export to CSV or JSON with selectable time windows (Today, This Week, This Month, All Time). Export button is disabled when no entries exist. Exports include skip/auto-skip status for each entry.

---

## Module Structure

This is a greenfield app. Suggested ownership boundaries:

- `app/` — screens and navigation (Expo Router file-based routes)
- `features/checkin/` — owns: CheckInForm, SkipAction, AutoSkip, OverrideSkipped, RetroactiveEntry
- `features/history/` — owns: EntryList, DayView, MoodChart, WeekView, MonthView
- `features/notifications/` — owns: scheduling, permission handling
- `features/settings/` — owns: active hours config (with granular hour selection)
- `features/export/` — owns: CSV serializer, JSON serializer, time-window picker, share-sheet trigger
- `store/` — owns: local persistence layer (all entries, settings)

---

## Open Questions

- OQ1: Notification action buttons (the "WhatsApp style" second-preference UX) — are these achievable early enough to be worth exploring in Phase 2, or should they be explicitly deferred until the developer is more comfortable with the React Native notification ecosystem?
  **Answer**: Timeboxed spike in Phase 2 after base notification implementation. Implementation planning deferred to post-spike.
- OQ2: The floating popup (MS Authenticator style, first-preference UX) — this likely requires a foreground service or overlay permission on Android. Should this be captured as a future enhancement or parked indefinitely given the complexity?
  **Answer**: Included in the same Phase 2 spike as OQ1. The spike will determine which notification UX approach (action buttons vs. floating popup) is feasible, narrowing the decision to one path forward.
- OQ3: Should the "active hours" window and the "DND" window be unified into a single "active hours" concept (notifications only fire between these times), or does the user genuinely need both independently?
  **Answer**: Unified. DND is removed — the active hours window is the sole control. Granular hour selection within the active window provides enough flexibility.
- OQ4: Is there a maximum number of hours the user wants notifications to fire per day? (Android has a limit on scheduled exact alarms — worth validating this does not become a constraint for wide active windows.)
  **Answer**: No artificial cap — up to 24/day in theory. Android's exact alarm limits need to be validated during implementation to confirm this doesn't become a constraint.
- OQ5: Excel export — deferred, but should it use a native `.xlsx` format or is a `.xls`-compatible CSV sufficient for the user's purposes?
  **Answer**: Let's skip excel entirely for now.

---

## Technical Context

(For the developer — not part of the product requirements, but relevant to implementation planning.)

- Expo's notification library (`expo-notifications`) supports scheduling local notifications. Exact-time recurring notifications on Android require the `SCHEDULE_EXACT_ALARM` permission, which must be declared and may require the user to grant it manually on Android 12+.
- Local storage options include `expo-sqlite` (structured, queryable) or `@react-native-async-storage/async-storage` (simpler key-value). Given the volume of hourly entries over months, SQLite is worth considering early.
- The floating popup (OQ2) would require a foreground service and `SYSTEM_ALERT_WINDOW` permission — a meaningful implementation leap beyond standard Expo managed workflow.
- Notification action buttons (inline reply / skip without opening app) are supported via `expo-notifications` category actions, but behavior varies by Android version and manufacturer.
- Export via the native share sheet uses `expo-sharing` or `expo-file-system` + `Share` from React Native core.
- Auto-skip (AC3.9) will likely need a background task or notification response listener to detect the 25-minute timeout and create the entry. `expo-task-manager` or a notification-dismissed callback may be relevant.

---

## Revised Assessment

Size: EPIC (six slices, each independently shippable)
Greenfield: yes
Risk: MODERATE — notification scheduling reliability on Android varies by manufacturer (battery optimization kills background processes on some devices); local data integrity must be protected against app updates wiping storage. Auto-skip background processing adds implementation complexity.

[x] Reviewed
