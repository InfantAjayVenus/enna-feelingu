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
- Excel export in the first pass (CSV and JSON ship first)
- A mood chart spanning months (the list view ships first; the chart is a follow-on)

---

## Slices

Slices are ordered by "get the core loop working first." Each slice is independently usable and testable before the next one begins.

---

### Slice 1 — In-App Check-In Screen (Walking Skeleton)

**What this delivers:** The complete core loop — log a mood and activity — without any notifications. You open the app, tap to add an entry, and it's saved.

**Why first:** This is the easiest path to a working app. It validates the data model and the entry experience before anything else is built on top of it.

**Acceptance Criteria**

- AC1.1: When the user opens the app for the first time, they see a screen that lets them start a new check-in immediately — no setup required to reach it.
- AC1.2: The check-in form shows a mood input that accepts whole numbers from 1 to 10 only. Values outside this range cannot be submitted.
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

- AC2.1: On first launch (or first visit to settings), the user is asked to set their active hours — a start time and an end time for when notifications should fire.
- AC2.2: The app requests notification permission from the device. If the user denies permission, the app explains what will not work and does not crash.
- AC2.3: A notification fires at the top of each hour within the user's active window (e.g., if active hours are 8am–10pm, notifications fire at 8:00, 9:00, 10:00, ... 22:00).
- AC2.4: Tapping a notification opens the app directly to the check-in screen, not to the home screen or history view.
- AC2.5: If the user does not act on a notification, it does not stack — the next hour's notification replaces or supplements it rather than accumulating a pile of unread prompts.
- AC2.6: Notifications continue to fire correctly after the phone has been restarted.
- AC2.7: No notifications fire outside the user's configured active hours.

---

### Slice 3 — DND Hours and Skip Check-In

**What this delivers:** Two quality-of-life features that make the hourly cadence sustainable. DND suppresses notifications during a window (e.g., overnight). Skip carries the previous entry forward so the user is not forced to retype when nothing has changed.

**Why third:** Without these, the app becomes annoying quickly. DND prevents 2am interruptions. Skip prevents friction when you're doing the same thing you were doing an hour ago.

**Acceptance Criteria**

**DND**
- AC3.1: The user can configure a DND window (start time and end time) in settings. This is separate from the active hours window.
- AC3.2: No notifications fire during the DND window, even if the DND window overlaps with the active hours window.
- AC3.3: The user can enable or disable DND without changing the active hours configuration.
- AC3.4: Changes to the DND window take effect without requiring an app restart.

**Skip**
- AC3.5: The check-in screen (and/or the notification, if action buttons are available) offers a "Skip — same as last time" option.
- AC3.6: When the user selects Skip, a new entry is created using the mood score and activity text from the most recent saved entry, with the current timestamp.
- AC3.7: If there is no previous entry to copy from, the Skip option is hidden or disabled.
- AC3.8: A skipped entry is stored and visible in history the same way a manually entered one is — it is not discarded.

---

### Slice 4 — Retroactive Logging

**What this delivers:** The ability to go back and log a missed hour from within the app. If you ignored a notification (or the phone was in a bag), you can still fill in that slot later.

**Why fourth:** Without this, any disruption creates a permanent gap in the record. Retroactive logging keeps the history clean and the data trustworthy.

**Acceptance Criteria**

- AC4.1: The user can access a "log a past entry" flow from within the app — reachable from the history view or a clearly labelled action.
- AC4.2: In this flow, the user can select any past hour (date + hour) for which no entry exists yet.
- AC4.3: Hours that already have an entry are either hidden from the picker or clearly marked as already logged.
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
- AC5.2: Each entry in the list displays: the date and hour it was recorded, the mood score, and the activity text (or a placeholder if no text was entered).
- AC5.3: The mood score is shown with the same negative / neutral / positive visual treatment used in the check-in form.
- AC5.4: The list is scrollable and handles at least several months of hourly entries without becoming unusably slow.
- AC5.5: If there are no entries yet, the screen shows an empty state message rather than a blank screen.

**Day-focused drill-down (follow-on within this slice)**
- AC5.6: The user can select a specific day and see only the entries for that day in chronological order (earliest first).
- AC5.7: The user can navigate between days (forward/back) without returning to the full list.
- AC5.8: A mood chart is shown for the selected day, plotting mood score (y-axis) against hour (x-axis), so the user can see their emotional arc across the day.
- AC5.9: The user can zoom out to a weekly view showing average or representative mood per day.
- AC5.10: The user can zoom out further to a monthly view showing average or representative mood per week.

---

### Slice 6 — Export

**What this delivers:** A way to get all recorded data off the device in a portable format. CSV and JSON ship first. Excel is a later addition.

**Why last:** Export is valuable but not needed to use the app day-to-day. It becomes relevant after the user has accumulated data worth exporting.

**Acceptance Criteria**

- AC6.1: The user can find an export option within the app — in settings or on the history screen — without it being buried more than two taps deep.
- AC6.2: The user can choose between CSV and JSON as the export format.
- AC6.3: Triggering an export produces a file that is shared via the device's native share sheet (so the user can save it to cloud storage, email it, or open it in another app).
- AC6.4: The exported file includes every saved entry: timestamp, mood score, activity text, and whether the entry was a skip or a manual entry.
- AC6.5: A CSV export opens correctly in a spreadsheet application (one row per entry, headers in the first row, no broken encoding for special characters).
- AC6.6: A JSON export is valid, parseable JSON (an array of objects, one per entry).
- AC6.7: If there are no entries to export, the app shows a message rather than producing an empty or broken file.

---

## Milestone Map

### Phase 1 — Walking Skeleton (Slice 1)
The core loop works. The user can open the app, log a mood and activity, and see it saved. No notifications yet.

### Phase 2 — Prompted Loop (Slices 2 + 3)
The app becomes proactive. Hourly notifications fire on a fixed clock during active hours. DND suppresses them overnight. Skip carries the last entry forward. The in-app screen is the check-in target for tapped notifications.

### Phase 3 — Complete Record (Slice 4)
Retroactive logging closes the gaps. Any missed hour can be filled in after the fact.

### Phase 4 — Meaningful History (Slice 5, list first)
The user can browse everything they have logged. A flat list ships first; the drill-down chart view follows once the list is solid.

### Phase 5 — Data Portability (Slice 6)
Export to CSV or JSON. Data can leave the device.

---

## Module Structure

This is a greenfield app. Suggested ownership boundaries:

- `app/` — screens and navigation (Expo Router file-based routes)
- `features/checkin/` — owns: CheckInForm, SkipAction, RetroactiveEntry
- `features/history/` — owns: EntryList, DayView, MoodChart, WeekView, MonthView
- `features/notifications/` — owns: scheduling, DND logic, permission handling
- `features/settings/` — owns: active hours config, DND config
- `features/export/` — owns: CSV serializer, JSON serializer, share-sheet trigger
- `store/` — owns: local persistence layer (all entries, settings)

---

## Open Questions

- OQ1: Notification action buttons (the "WhatsApp style" second-preference UX) — are these achievable early enough to be worth exploring in Phase 2, or should they be explicitly deferred until the developer is more comfortable with the React Native notification ecosystem?
- OQ2: The floating popup (MS Authenticator style, first-preference UX) — this likely requires a foreground service or overlay permission on Android. Should this be captured as a future enhancement or parked indefinitely given the complexity?
- OQ3: Should the "active hours" window and the "DND" window be unified into a single "active hours" concept (notifications only fire between these times), or does the user genuinely need both independently?
- OQ4: Is there a maximum number of hours the user wants notifications to fire per day? (Android has a limit on scheduled exact alarms — worth validating this does not become a constraint for wide active windows.)
- OQ5: Excel export — deferred, but should it use a native `.xlsx` format or is a `.xls`-compatible CSV sufficient for the user's purposes?

---

## Technical Context

(For the developer — not part of the product requirements, but relevant to implementation planning.)

- Expo's notification library (`expo-notifications`) supports scheduling local notifications. Exact-time recurring notifications on Android require the `SCHEDULE_EXACT_ALARM` permission, which must be declared and may require the user to grant it manually on Android 12+.
- Local storage options include `expo-sqlite` (structured, queryable) or `@react-native-async-storage/async-storage` (simpler key-value). Given the volume of hourly entries over months, SQLite is worth considering early.
- The floating popup (OQ2) would require a foreground service and `SYSTEM_ALERT_WINDOW` permission — a meaningful implementation leap beyond standard Expo managed workflow.
- Notification action buttons (inline reply / skip without opening app) are supported via `expo-notifications` category actions, but behavior varies by Android version and manufacturer.
- Export via the native share sheet uses `expo-sharing` or `expo-file-system` + `Share` from React Native core.

---

## Revised Assessment

Size: EPIC (six slices, each independently shippable)
Greenfield: yes
Risk: MODERATE — notification scheduling reliability on Android varies by manufacturer (battery optimization kills background processes on some devices); local data integrity must be protected against app updates wiping storage.

[ ] Reviewed
