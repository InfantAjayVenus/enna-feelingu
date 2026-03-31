# Spec: Hourly Check-In — Phase 1 (Walking Skeleton)

## Overview

Phase 1 delivers the complete core loop: the user opens the app, logs a mood score and optional activity text, and the entry is saved to local storage. No notifications, no history view, no skip. This phase validates the data model and the entry experience before anything else is built on top of it.

---

## Acceptance Criteria

### First-launch experience

- [x] When the user opens the app for the first time, the check-in screen is the first thing they see — no onboarding wizard, settings screen, or navigation step is required to reach it.

### Mood input

- [x] The check-in screen presents mood as a horizontal slider. A single emoji updates dynamically as the user drags to a new whole-number value, representing that mood level.
<!-- -------- bee-comment -------- -->
> **@developer**: let's fix the slider that's more sleek, keeps the screen clean and easier for the user to decide.
> **@bee**: Removed the 10-button alternative. The mood input is now a slider only — single emoji that updates as the user drags. Cleaner screen, one clear interaction model.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
- [x] Only whole-number values 1–10 are selectable; fractional or out-of-range values cannot be submitted.
- [x] The slider track has a gradient background — red on the left (score 1) transitioning to green on the right (score 10) — so the user gets immediate visual feedback about the mood tier they are selecting before they release.
<!-- -------- bee-comment -------- -->
> **@developer**: Let's also make the background color of the slider as a gradient from red(left) to green(right) so that it adds visual feedback.
> **@bee**: Updated the tier-distinction AC to specify a red-to-green gradient on the slider track. This replaces the vague "color, label, or icon" language with a concrete, testable visual requirement. The gradient communicates negativity/positivity continuously as the user drags, not just at fixed thresholds.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

### Activity text

- [x] The check-in screen includes a free-text field labelled or described as "what I did this hour" (or equivalent).
- [x] The activity text field is optional — a check-in that has a mood score but no text can be saved without error.

### Saving an entry

- [x] When the user submits a complete check-in (mood selected, text optional), the entry is saved to local device storage with a timestamp accurate to the minute.
- [x] After saving, the user sees a confirmation — a success message, a screen transition, or a visible visual cue. The save is never a silent no-op.

### Validation

- [x] The submit button is disabled and visually inactive until the user has moved the slider to select a mood score. Once a mood is selected, the button becomes active and tappable.
<!-- -------- bee-comment -------- -->
> **@developer**: just make the submit button disabled unless the user selects a mood score.
> **@bee**: Replaced the "show inline error" approach with a disabled submit button. This is a better UX pattern — prevent the invalid action instead of explaining why it failed after the fact. Removed `moodError` from the form state in the API Shape section accordingly.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

### Persistence

- [x] A saved entry survives the app being closed and reopened — it is present in storage on the next launch.
- [x] A saved entry survives the app being force-closed by the OS and relaunched — it is not held only in memory.

---

## Data Model

The canonical TypeScript type for a check-in entry. This type lives in `store/` and is the single definition consumed by all other modules.

```ts
type CheckInEntry = {
  id: string;           // UUID, generated at save time
  timestamp: string;    // ISO 8601, minute precision (e.g. "2026-03-13T14:00:00")
  mood: number;         // Integer 1–10 (inclusive)
  activity: string;     // Free text; empty string when omitted
  skipped: boolean;     // false for all Phase 1 entries
  autoSkipped: boolean; // false for all Phase 1 entries
  overriddenByEntryId: string | null; // null for all Phase 1 entries
};
```

The `skipped`, `autoSkipped`, and `overriddenByEntryId` fields are defined here so the schema is stable when Phase 2 and 3 add skip and override behavior. Phase 1 always writes `false` / `null` for these fields.

The SQLite table must be created with all columns present from the start to avoid a migration in a later phase.

---

## API Shape

### store/ — persistence interface

```ts
// store/checkin-store.ts
saveEntry(entry: CheckInEntry): Promise<void>;
getEntries(): Promise<CheckInEntry[]>;
```

### features/checkin/ — form submission

```ts
// features/checkin/use-checkin-form.ts  (custom hook)
type CheckInFormState = {
  mood: number | null;   // null = slider not yet moved; drives submit button disabled state
  activity: string;
};

type CheckInFormActions = {
  setMood(score: number): void;
  setActivity(text: string): void;
  submit(): Promise<void>;   // saves entry, triggers confirmation
};
```

### app/ — screen (thin)

`app/(tabs)/index.tsx` renders `<CheckInForm />` from `features/checkin/`. No business logic in the screen file.

---

## Out of Scope

The following are explicitly excluded from Phase 1. They are covered in later phases.

- Hourly notifications or any scheduling (Phase 2)
- Skip, auto-skip, or override of skipped entries (Phase 2 / Phase 3)
- Retroactive logging of past hours (Phase 3)
- History view or any way to browse past entries in the UI (Phase 4)
- Mood chart or drill-down views (Phase 4)
- Export to CSV or JSON (Phase 5)
- Settings screen or active-hours configuration
- Any form of account, sync, or cloud storage
- iOS support (Android-first throughout)

---

## Technical Context

### Module placement

- `app/(tabs)/index.tsx` — check-in screen. Thin: renders `<CheckInForm />`, handles navigation and confirmation display only.
- `features/checkin/CheckInForm.tsx` — slider mood input, activity text field, submit button (disabled when `mood === null`).
- `features/checkin/use-checkin-form.ts` — form state, calls `store/`.
- `store/checkin-store.ts` — SQLite read/write. No UI imports, no feature imports.

### Persistence

Use `expo-sqlite` (to be added as a dependency in this phase). The SQLite database is created on first launch. The `check_in_entries` table is created with all columns from the `CheckInEntry` type so no schema migration is needed in later phases.

### Patterns to follow

- File-based routing via Expo Router — new screens are files under `app/`.
- Path alias `@/` maps to the repo root — use it for all cross-module imports.
- React Compiler is enabled — do not add manual `useMemo` or `useCallback` where the compiler handles it.
- TypeScript strict mode is on — no `any`, no non-null assertions without justification.
- Platform-specific files use `.android.tsx` / `.web.ts` suffixes; avoid them unless a genuine platform split is needed.
- `ThemedText` and `ThemedView` are the base layout primitives; use them instead of raw `Text`/`View` where color-scheme awareness is needed.

### Risk level

MODERATE. The data model established in this phase is the foundation for all later phases. Changes to the SQLite schema after Phase 1 require migrations, so it must be complete and forward-compatible from the start.

[x] Reviewed
