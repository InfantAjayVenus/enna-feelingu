# Discovery: Periodic Summaries (enna-feelingu)

## Why

Hourly check-ins give the user accurate, real-time mood data — but raw data alone does not produce insight. At the end of a day, week, or month, the user deserves a moment of reflection: what was the emotional shape of this period, when did it peak, when did it dip? Periodic summaries close the loop between logging and learning, surfacing patterns the user cannot easily see by scrolling through individual entries.

## Who

The same single user who owns the app. All summaries are private, local, and never shared. There are no other roles, no therapist dashboard, no social layer.

## Success Criteria

- After the day ends, the user can see — with no manual calculation — their average mood, the best moment of the day, and the worst moment of the day. When multiple entries share the same score, the tie is broken by context: the entry surrounded by higher neighbouring mood scores wins for "best moment" (and lower for "worst moment"); if still tied, the most recent entry is shown.
<!-- -------- bee-comment -------- -->
> **@developer**: we need to still decide how we choose the best moment, thinking of a tiered approach. Highest score as first choice, if there's a tie, the entry surrounded by higher mood score is chosen etc.,
> **@bee**: Added a tiered tie-breaking rule to the Success Criterion: Tier 1 = highest (or lowest) score; Tier 2 = entry whose immediate neighbours have higher (or lower) average mood, giving contextual weight; Tier 3 = most recent. This same rule is applied in AC1.4, AC1.5, and AC4.6.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- The user can read and write a brief daily note ("how was my day overall?") attached to the summary, without navigating away from it.
- Past daily, weekly, and monthly summaries are browsable from within the app at any time.
- The home screen surfaces a summary card automatically at the right time — the user does not need to go hunting for it.
- Summary notifications arrive reliably without the user configuring a separate time — the trigger is derived from their existing active hours setting.

## Problem Statement

The hourly check-in produces a growing record of mood snapshots, but the app currently offers no aggregated view above the day level. Periodic summaries are a higher-priority addition than the drill-down history chart (month → week → day), and should ship before that chart is built. The user has no way to answer "how did this week feel overall?" or "what was my emotional low point yesterday?" without manually scanning entries. Periodic summaries answer those questions automatically, at the right moment, in the right place.
<!-- -------- bee-comment -------- -->
> **@developer**: I'd like this feature prioritized more than the history chart.
> **@bee**: Updated the Problem Statement to explicitly note that periodic summaries take priority over the drill-down history chart (AC5.6–AC5.10 of the hourly check-in spec). This signals to the implementation planner that summaries should be sequenced before chart work.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

## Hypotheses

- H1: Deriving the summary notification time from the active hours setting (1 hour after the last check-in for daily; 1 hour before the first check-in for weekly/monthly) is intuitive enough that users will not want to configure it separately.
- H2: Showing the summary card on the home screen is the right placement — users land there first and will discover it without being taught where to look.
- H3: The daily journal note is valuable for reflection even when it is optional — users who want to write will appreciate the field; users who do not will ignore it without friction.
- H4: For weekly and monthly summaries, "best day / worst day" and "best week / worst week" are meaningful enough without activity-level pattern analysis. If users want deeper insight, the AI correlation feature (OQ1) becomes a priority.
- H5: Inline summary entries in the history list (alongside hourly entries) is the right place for past summaries — users already go to history to look back, so summaries should be discoverable there.

## Out of Scope

- Custom notification timing for summaries (the trigger rules are fixed; no separate time picker)
- Configurable week start day (Sunday default; user configurability deferred to a later phase)
- AI or LLM-based activity-mood correlation analysis (parked — see OQ1)
- Weekly and monthly journal note fields (daily only)
- Editing or deleting past summary notes
- Exporting summaries separately (existing export covers raw entries; summaries are view-only)
- Push notification to prompt the user to write their daily note (the note field is on the summary screen only)
- Summary statistics spanning longer than one calendar month
- Drill-down history chart (month → week → day) — deferred in favour of summaries

---

## Slices

Slices are ordered so each one delivers something independently usable. Notifications and home card integration are layered on after the core screen is proven.

---

### Slice 1 — Daily Summary Screen (Walking Skeleton)

**What this delivers:** A daily summary screen the user can reach from the history list. It shows the day's average mood, best moment, worst moment, and an optional free-text note. The note is included here because it is a simple text field with no dependencies on notifications or the home card.

**Why first:** The screen, its computed stats, and the note field are the foundation everything else builds on. Validating the computation logic, layout, and note persistence before adding notification scheduling and home card integration keeps the scope tight and the first slice independently testable.

**Acceptance Criteria**

- AC1.1: Past daily summaries appear as entries in the history list, inline with hourly entries, clearly labeled as "Daily Summary — [date]" so they are visually distinguishable from check-in entries.
- AC1.2: Tapping a daily summary entry in the history list opens the daily summary screen for that date.
- AC1.3: The daily summary screen displays the average mood score for the day, rounded to one decimal place.
- AC1.4: The daily summary screen displays a "Best moment" section showing the activity text of the entry with the highest mood score that day. If two entries share the highest score, the tie is broken by context: the entry whose immediate neighbours (entries before and after) have a higher average mood score is shown. If still tied, the most recent of those entries is shown.
- AC1.5: The daily summary screen displays a "Worst moment" section showing the activity text of the entry with the lowest mood score that day. If two entries share the lowest score, the tie is broken by context: the entry whose immediate neighbours have a lower average mood score is shown. If still tied, the most recent of those entries is shown.
- AC1.6: If a "Best moment" or "Worst moment" entry has no activity text, that section displays a placeholder such as "No activity logged" rather than a blank space.
- AC1.7: If no check-in entries exist for the day, the summary screen displays "No check-ins logged today" instead of any mood stats, best moment, or worst moment sections.
- AC1.8: A daily summary entry appears in the history list for every past day that has at least one check-in entry. Days with no entries do not produce a summary entry in the list.
<!-- -------- bee-comment -------- -->
> **@developer**: enhancement for the future, we can even group everything as a sub-tree. History list has list of month summaries, opening that will show the summary and the list of weekly summaries and so on.
> **@bee**: Captured as OQ5 — a future enhancement to restructure the history list as a collapsible sub-tree (monthly → weekly → daily → hourly entries) rather than a flat inline list. Not in scope for this feature.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC1.9: The daily summary screen is reachable only via the history list in this slice — there is no notification or home card entry point yet.
- AC1.10: The daily summary screen includes a text input field below the mood stats and best/worst moment sections, labeled "How was your day overall?" or equivalent.
- AC1.11: The note field is optional — the summary screen is complete and useful with the field left empty. There is no validation error for an empty note.
- AC1.12: When the user types a note and saves it (via a "Save note" button or equivalent), the note is stored locally and associated with that specific day's summary.
- AC1.13: When the user reopens the summary screen for a day where a note was saved, the saved note is pre-populated in the text field.
- AC1.14: The note persists across app restarts and does not disappear between sessions.
- AC1.15: If the user saves an empty note field over a previously saved note, the previous note is cleared and replaced with empty — it is not preserved.
- AC1.16: The note field is editable on any past daily summary screen, not only the current day's.
<!-- -------- bee-comment -------- -->
> **@developer**: merge it to slice 1.
> **@bee**: Merged the daily summary note (formerly Slice 4) into Slice 1. The note is a simple text field independent of the home card and notification slices, so it belongs in the walking skeleton. Slice 4 is removed; former Slices 5 and 6 are renumbered to Slices 4 and 5. Milestone Map updated accordingly.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

---

### Slice 2 — Daily Summary Home Card

**What this delivers:** After the daily summary trigger time (1 hour after the last active-hours check-in), a summary card appears on the home screen. The card shows the day's key stats at a glance. Tapping it opens the full daily summary screen.

**Why second:** The home screen is where users land first. Surfacing the summary card there — without requiring them to navigate to history — is the primary discovery mechanism. The notification comes next; the card comes first because it requires no scheduling infrastructure.

**Acceptance Criteria**

- AC2.1: After the daily summary trigger time for today (1 hour after the last active-hours check-in hour), a summary card appears on the home screen.
- AC2.2: The summary card displays the day's average mood score and a brief indicator of best and worst moments (activity text, truncated if long).
- AC2.3: Tapping the summary card opens the full daily summary screen for today.
- AC2.4: The summary card does not appear on the home screen before the trigger time for that day.
- AC2.5: If no check-in entries exist for the day, the summary card still appears after the trigger time but displays "No check-ins logged today" rather than mood stats.
- AC2.6: The daily summary card appears on the home screen from the trigger time until the user logs their first check-in entry of the following day. Once that first next-day entry is logged, the card is no longer shown.
<!-- -------- bee-comment -------- -->
> **@developer**: The home screen shows the card from the time the summary is generated till the first entry of the next day.
> **@bee**: Updated AC2.6 from "at most one card at a time / current or most recently completed day" to the user's exact rule: the card shows from trigger time until the first check-in of the following day is logged. This gives users who open the app first thing in the morning one last view of yesterday's summary before it clears.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC2.7: If the user has not configured active hours, no daily summary card appears (since the trigger time cannot be derived).

---

### Slice 3 — Daily Summary Notification

**What this delivers:** A notification fires automatically 1 hour after the last active-hours check-in of the day. Tapping the notification opens the daily summary screen.

**Why third:** The notification is the proactive nudge that surfaces the summary without the user having to remember to open the app. It depends on the summary screen (Slice 1) being complete and uses the same trigger time logic introduced in Slice 2.

**Acceptance Criteria**

- AC3.1: A notification fires exactly 1 hour after the last scheduled active-hours check-in of the day (e.g., if active hours end at 10pm, the notification fires at 11pm).
- AC3.2: The notification body communicates that the user's daily summary is ready — it does not use generic text like "You have a notification."
- AC3.3: Tapping the notification opens the app directly to the daily summary screen for that day, not to the home screen or history list.
- AC3.4: If the user has not granted notification permission, no summary notification is scheduled. The home card (Slice 2) remains the only proactive entry point.
- AC3.5: The summary notification fires only once per day. If the user dismisses or taps it, it does not reappear for that day.
- AC3.6: The summary notification continues to fire correctly after the phone has been restarted.
- AC3.7: No summary notification fires on days where the user has no active hours configured.
- AC3.8: If the user changes their active hours setting, the next day's summary notification is rescheduled to reflect the new last check-in time. The current day's notification is unaffected.

---

### Slice 4 — Weekly Summary

**What this delivers:** A complete weekly summary — notification, home card, and browsable screen — covering the calendar week (Monday–Sunday). The summary surfaces on Sunday morning, 1 hour before the first active-hours check-in, so the user starts the new week with a reflection on the last one. The screen shows average mood for the week, the best day, and the worst day.

**Why fourth:** Weekly summary depends on the same notification scheduling and home card patterns established in Slices 2 and 3. Shipping it after daily summaries are stable means the weekly slice can reuse those patterns with minimal new risk.

**Acceptance Criteria**

**Screen and history**
- AC4.1: Past weekly summaries appear in the history list inline with other entries, clearly labeled "Weekly Summary — [week label, e.g., Mar 10–16]" so they are distinguishable from daily summaries and check-in entries.
- AC4.2: Tapping a weekly summary entry in the history list opens the weekly summary screen for that week.
- AC4.3: The weekly summary screen displays the average mood score for the week, rounded to one decimal place.
- AC4.4: The weekly summary screen displays the "Best day" — the calendar day with the highest daily average mood score — showing the day name, date, and its average mood score.
- AC4.5: The weekly summary screen displays the "Worst day" — the calendar day with the lowest daily average mood score — showing the day name, date, and its average mood score.
- AC4.6: If two days tie for best or worst daily average, the tie is broken by context: the day whose neighbouring days (the day before and the day after within the week) have a higher (for best) or lower (for worst) combined average mood is shown. If still tied, the more recent day is shown.
<!-- -------- bee-comment -------- -->
> **@developer**: this should also follow that tiered strategy.
> **@bee**: Updated AC4.6 (formerly AC5.6) to apply the same three-tier tie-breaking rule used in AC1.4/AC1.5: Tier 1 = highest/lowest daily average; Tier 2 = the day whose neighbouring days within the week have a more extreme combined average; Tier 3 = most recent.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC4.7: If the week has entries for fewer than 2 days, the summary screen shows whatever stats are available and displays a note such as "Log more days for a fuller picture" below the stats.
- AC4.8: If the week has no entries at all, the summary screen displays "No check-ins logged this week" instead of stats.

**Home card**
- AC4.9: On Sunday morning, 1 hour before the first active-hours check-in of the day, a weekly summary card appears on the home screen. The weekly card is displayed above the daily summary card (if one is also present). The weekly card remains visible until the daily summary card for the following day appears (i.e., 1 hour after Sunday's last active-hours check-in).
<!-- -------- bee-comment -------- -->
> **@developer**: Let's keep it as first day (Sunday) morning, one hour before the first daily check-in notification, so that the user starts with reflecting the last week. The weekly card will sit above the daily card and will stay there till the next daily card is displayed.
> **@bee**: Updated AC4.9 (formerly AC5.9) to reflect the new trigger: Sunday morning, 1 hour before the first active-hours check-in. The weekly card sits above the daily card and persists until the daily summary card for Sunday night appears. Also updated AC4.12 and AC4.13 to match. Resolved OQ2 (card stacking order) in line with this — see OQ2 resolution below.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC4.10: The weekly summary card displays the week's average mood and a brief indicator of best and worst day.
- AC4.11: Tapping the weekly summary card opens the full weekly summary screen.
- AC4.12: The weekly summary card does not appear before Sunday morning's trigger time (1 hour before the first active-hours check-in on Sunday).

**Notification**
- AC4.13: A notification fires on Sunday morning, 1 hour before the first active-hours check-in of the day, to prompt weekly reflection.
- AC4.14: The notification body communicates that the user's weekly summary is ready.
- AC4.15: Tapping the notification opens the app directly to the weekly summary screen for that week.
- AC4.16: The weekly summary notification fires only once per week and does not repeat after the user taps or dismisses it.

---

### Slice 5 — Monthly Summary

**What this delivers:** A complete monthly summary — notification, home card, and browsable screen — covering the calendar month. The summary surfaces on the 1st of the new month, 1 hour before the first active-hours check-in, so the user starts the new month with a reflection on the last one. The screen shows average mood for the month, the best week, and the worst week.

**Why last:** Monthly summary is the broadest aggregation and has the least urgency for day-to-day use. It follows the same patterns as weekly (Slice 4) and is the final layer of the periodic summary stack.
<!-- -------- bee-comment -------- -->
> **@developer**: the comments on slice 5 also applies to slice 6.
> **@bee**: Applied the same timing rule to monthly: the monthly summary surfaces on the 1st of the new calendar month, 1 hour before the first active-hours check-in — mirroring the weekly pattern. Updated AC5.9, AC5.12, and AC5.13 accordingly. The monthly card sits above the weekly card when both appear simultaneously (e.g., when the 1st falls on a Sunday).
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Acceptance Criteria**

**Screen and history**
- AC5.1: Past monthly summaries appear in the history list inline with other entries, clearly labeled "Monthly Summary — [month name and year, e.g., March 2026]" so they are distinguishable from weekly and daily entries.
- AC5.2: Tapping a monthly summary entry in the history list opens the monthly summary screen for that month.
- AC5.3: The monthly summary screen displays the average mood score for the month, rounded to one decimal place.
- AC5.4: The monthly summary screen displays the "Best week" — the calendar week with the highest weekly average mood score — showing the week label (e.g., "Mar 10–16") and its average mood score.
- AC5.5: The monthly summary screen displays the "Worst week" — the calendar week with the lowest weekly average mood score — showing the week label and its average mood score.
- AC5.6: If two weeks tie for best or worst, the tie is broken by context: the week whose neighbouring weeks within the month have a higher (for best) or lower (for worst) combined average mood is shown. If still tied, the more recent week is shown.
- AC5.7: If the month has entries across fewer than 2 weeks, the summary screen shows available stats and displays a note such as "Log more weeks for a fuller picture."
- AC5.8: If the month has no entries at all, the summary screen displays "No check-ins logged this month" instead of stats.

**Home card**
- AC5.9: On the 1st of the new calendar month, 1 hour before the first active-hours check-in of the day, a monthly summary card appears on the home screen. When a weekly summary card is also present (e.g., if the 1st falls on a Sunday), the monthly card is displayed above the weekly card, which is above the daily card. The monthly card remains visible until the daily summary card for that evening appears.
- AC5.10: The monthly summary card displays the month's average mood and a brief indicator of best and worst week.
- AC5.11: Tapping the monthly summary card opens the full monthly summary screen.
- AC5.12: The monthly summary card does not appear before the 1st-of-month morning trigger time (1 hour before the first active-hours check-in).

**Notification**
- AC5.13: A notification fires on the 1st of the new calendar month, 1 hour before the first active-hours check-in. If a weekly summary notification is also scheduled for the same time (i.e., the 1st falls on a Sunday), the monthly notification is delayed by 30 minutes to avoid simultaneous alerts.
<!-- -------- bee-comment -------- -->
> **@developer**: if the monthly card happens to overlap with a weekly card, we delay the monthly notification by 30 mins.
> **@bee**: Updated AC5.13 to specify the 30-minute delay: when the 1st of the month falls on a Sunday, the weekly notification fires at the normal time (1 hour before first check-in) and the monthly notification fires 30 minutes later. The home cards still appear simultaneously — only the notifications are staggered.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- AC5.14: The notification body communicates that the user's monthly summary is ready.
- AC5.15: Tapping the notification opens the app directly to the monthly summary screen for that month.
- AC5.16: The monthly summary notification fires only once per month and does not repeat after the user taps or dismisses it.

---

## Milestone Map

### Phase 1 — Daily Summary Screen + Note (Slice 1)
The core data model, screen, and note field are proven. The user can browse past daily summaries from the history list, see average mood with tiered best/worst moments, and optionally write a daily reflection note. No scheduling, no home card — just the foundation.

### Phase 2 — Daily Summary Home Card (Slice 2)
The home screen becomes a landing point for the current day's summary after the trigger time. The card clears when the user logs their first entry of the following day. No notification infrastructure yet.

### Phase 3 — Daily Summary Notification (Slice 3)
The app becomes proactive. A notification fires 1 hour after the last active-hours check-in, tapping it opens the summary screen directly. Notification rescheduling on active hours changes is handled here.

### Phase 4 — Weekly Summary (Slice 4)
Weekly summaries are added end-to-end: screen, history entry, home card (Sunday morning, above daily card), and notification. Reuses the scheduling and card patterns from Phases 2–3. Tiered tie-breaking and sparse data handling introduced here.

### Phase 5 — Monthly Summary (Slice 5)
Monthly summaries complete the periodic summary stack. Screen, history entry, home card (1st of month, above weekly card), and notification follow the same pattern as Phase 4. Monthly notification is delayed 30 minutes when it coincides with the weekly notification.

---

## Module Structure

Additions and extensions to the existing module structure:

- `features/summaries/` — owns: DailySummaryScreen, WeeklySummaryScreen, MonthlySummaryScreen, SummaryCard (shared home card component with stacking support), summary computation logic (avg mood, tiered best/worst moment, best/worst day, best/worst week), note persistence
- `features/home/` — extended to conditionally render stacked SummaryCard(s) based on current time vs. trigger time, and clear them based on next-day entry / next-period arrival
- `features/history/` — extended to render summary entries (daily, weekly, monthly) inline in the history list, with distinct visual treatment and correct chronological positioning
- `features/notifications/` — extended to schedule daily (end-of-day), weekly (Sunday morning), and monthly (1st-of-month morning, with 30-min stagger when coinciding with weekly) summary notifications derived from active hours settings
- `store/` — extended to persist summary notes (keyed by date) and to store pre-computed or on-demand summary records

---

## Open Questions

- OQ1: **Smart activity-mood correlation** — the user wants "smart" (semantic, not keyword-based) analysis of which activities correlate with better or worse moods across weekly and monthly data. This likely requires on-device AI or an external LLM API, both of which conflict with the app's fully local, no-backend design or add significant complexity. The user wants to experiment with on-device AI before committing to an approach. This is parked as a future enhancement for weekly and monthly summaries. When revisited, the key decision is: on-device model (heavy, private) vs. external API (lighter, requires network and API key).

- OQ2: **Home card stacking** — ~~how should the home screen handle simultaneous daily, weekly, and monthly cards?~~ **Resolved**: stack vertically — monthly card above weekly card above daily card. All visible simultaneously when multiple periods end/begin on the same day (e.g., a Sunday that is also the 1st of the month).

- OQ3: **Week start day configurability** — Sunday is the default week boundary for weekly summaries. The user may want to configure this (e.g., Monday start) in a later phase. Deferred; no setting exists yet.

- OQ4: **History list ordering** — ~~what is the ordering of summary entries relative to hourly entries?~~ **Resolved**: daily summary entries appear after the last hourly entry of that day (chronologically, since they are computed at end-of-day). Weekly and monthly summary entries appear at their trigger timestamp (Sunday morning / 1st-of-month morning), chronologically before that day's first check-in entry.

- OQ5: **History list sub-tree grouping** — future enhancement: restructure the history list as a collapsible tree (monthly summary → weekly summaries → daily summaries → hourly entries) rather than a flat inline list. Not in scope for this feature.

---

## Revised Assessment

Size: EPIC (five slices, each independently shippable)
Greenfield: no (integrates into existing home screen, history list, notifications module, and store)
Risk: MODERATE — background notification scheduling reliability on Android (same risk as hourly check-ins), time-based home card logic requires accurate local time comparison, inline history integration must handle three distinct entry types without breaking existing list rendering. Summary computation must handle sparse data and tiered tie-breaking gracefully.

[x] Reviewed
