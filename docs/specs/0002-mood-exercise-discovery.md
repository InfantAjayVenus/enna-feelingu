# Discovery: Mood-Triggered Exercise Suggestions (enna-feelingu)

## Why

Logging a low mood is useful for the record, but it does nothing to help the user in the moment. When someone rates their hour a 1, 2, 3, or 4, the app knows they are struggling — and that is exactly the moment a small, practical nudge could make a difference. The feature closes the gap between "I feel bad" and "here is something concrete I can do right now."

## Who

The same single user who owns the app. No sharing, no therapist dashboard, no external visibility. The exercise suggestion is a private, in-the-moment prompt for the person holding the phone.

## Success Criteria

- After submitting a negative mood (1–4), the user is offered a coping exercise without any extra taps or navigation.
- The user can complete or dismiss the exercise suggestion in a few seconds — it does not interrupt the check-in flow in a way that feels punishing.
- The app ships with a small library of pre-defined exercises that cover distinct techniques (not five variations of the same thing) — all doable anywhere, anytime, with no equipment.
- A user who wants a custom exercise can add one via settings, and it becomes eligible to be shown alongside the built-in ones.

## Problem Statement

Mood tracking tells you how you felt. It does not help you feel better. When enna-feelingu records a low score, the user is left with the data but no path forward. A lightweight, immediately available coping exercise — suggested at the right moment, easy to dismiss, never mandatory — bridges the gap between awareness and action.

## Hypotheses

- H1: Showing the suggestion immediately after saving (inline, not a follow-up notification) is the right moment. If users consistently tap "Got it" without reading the exercise, the timing may need revisiting.
- H2: Choosing for the user (one random exercise, no picker) reduces cognitive load at a moment of distress. If users frequently want a different exercise, a "try another" option may be worth adding.
- H3: A concise text-step format is sufficient for v1. If users request animated or guided experiences early, a visual format becomes a priority for a follow-on phase.
- H4: A fixed 1–4 threshold is the right trigger. If users who score a 5 (neutral) also want suggestions, a configurable threshold may be worth adding later.

## Out of Scope

- An exercise picker shown during the check-in distress moment (the app chooses for the user)
- Animated visuals, expanding circles, or other motion-based exercise guides (text steps only for v1 and v2)
- Step-level timers or countdown clocks (Phase 3 only)
- Tracking whether the user completed an exercise (no logging, no history, no export)
- Rating exercises (no thumbs up/down, no feedback loop)
- Configurable mood threshold (the 1–4 trigger is fixed; no user setting)
- Follow-up notifications about exercises
- Suggesting exercises for neutral (5) or positive (6–10) moods
- Editing or deleting built-in exercises
- Reordering exercises in the library

---

## Milestone Map

### Phase 1 — Inline Suggestion with Built-In Library (Walking Skeleton)

**What this delivers:** After the user saves a check-in with a mood score of 1–4, a suggestion screen appears immediately. It shows one randomly chosen exercise from the built-in library. The user reads the steps and dismisses with a single "Got it" tap. No tracking, no choice — just the nudge.

**Why first:** This is the complete core loop in its simplest form. It proves the trigger, the presentation, and the dismissal before adding custom exercises or animated guides.

**Acceptance Criteria**

- AC1.1: When the user saves a check-in with a mood score of 1, 2, 3, or 4, the app immediately presents an exercise suggestion screen. This screen appears before the user returns to the home or history view.
- AC1.2: When the user saves a check-in with a mood score of 5–10, no exercise suggestion screen is shown. The check-in flow completes normally.
- AC1.3: The suggestion screen displays one exercise chosen at random from the available pool (built-in exercises, plus any custom exercises the user has added). A different exercise may appear on the next trigger.
- AC1.4: The exercise is displayed as a name and a short, scannable list of steps. Each step is a single sentence or short phrase. There is no wall of text.
- AC1.5: The suggestion screen has a single "Got it" button. Tapping it dismisses the screen and returns the user to the normal post-check-in destination (home or history view).
- AC1.6: The app ships with a minimum of three built-in exercises. Box breathing must be one of them. All built-in exercises must be doable anywhere, anytime, with no equipment or other people required.
- AC1.7: Each built-in exercise is stored as a name and an ordered list of steps — the same data structure that custom exercises will use.
- AC1.8: No record of the user having seen or dismissed a suggestion is saved. The suggestion screen is fire-and-forget.

<!-- -------- bee-comment -------- -->
> **@developer**: (OQ2) In Phase 1, should the single suggested exercise be random, or always the same?
> **@bee**: Updated AC1.3 to specify random selection from the full available pool (built-ins + custom). This future-proofs the pool as custom exercises are added in Phase 2.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

<!-- -------- bee-comment -------- -->
> **@developer**: (OQ1) Exercises should be ones the user could do anywhere, anytime without any dependency.
> **@bee**: Added the "anywhere, anytime, no equipment" constraint to AC1.6 as a ship criterion for the built-in library.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

---

### Phase 2 — Custom Exercise Management

**What this delivers:** The user can add their own exercises via settings. Custom exercises are stored locally and become eligible to appear in the random suggestion pool alongside the built-ins. The moment-of-distress experience is unchanged — the app still picks one exercise randomly; no picker is shown.

**Why second:** Phase 1 validates the trigger and the text-step format. Phase 2 gives the user a way to contribute their own techniques without adding cognitive load at the moment the suggestion appears.

<!-- -------- bee-comment -------- -->
> **@developer**: I don't think this phase is needed. We're trying to help the user in distress, asking them to make a choice actually makes it hard for them. Let's just show one exercise at a given moment.
> **@bee**: Agreed on removing the in-moment picker entirely. Phase 2 is now purely about custom exercise management via settings — no library browsing during a check-in. The distress-moment experience stays as "one random exercise, Got it." The picker (AC2.1–AC2.4) and the choice-at-distress-moment are removed from scope.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Acceptance Criteria**

- AC2.1: The user can reach a "manage exercises" screen from within settings — no more than two taps from anywhere in the app.
- AC2.2: On the manage screen, the user can create a new custom exercise by providing: a name (required) and one or more steps (at least one step required). Steps are entered as an ordered list — the user can add, remove, and reorder steps.
- AC2.3: Saving a custom exercise immediately adds it to the pool eligible for random suggestion.
- AC2.4: The user can edit or delete a custom exercise they have created. Built-in exercises cannot be edited or deleted.
- AC2.5: If the user attempts to save a custom exercise with no steps, the app shows a validation error and does not save.
- AC2.6: Custom exercises persist across app restarts and are stored locally on the device.

---

### Phase 3 — Exercise-Specific Interactive Guide (Future)

**What this delivers:** Built-in exercises gain an exercise-specific interactive layer — timers, animated cues, and step labels designed around the precise cadence of each technique. Box breathing, for example, shows a 4-second countdown for inhale, then 4 for hold, then 4 for exhale, then 4 for hold — cycling until the user taps "Done." Other exercises get equivalently tailored experiences.

**Why third:** Text steps are sufficient to validate the feature. The interactive guide adds polish and reduces the cognitive effort of following along — but it is not needed to prove the value. Each exercise's interactive experience is a small product design project in itself.

<!-- -------- bee-comment -------- -->
> **@developer**: we can also build custom experiences for each exercise — for example, box breathing: show a timer running for 4 seconds prompting the user to inhale till 0, reset to 4 prompting hold, and so on.
> **@bee**: Expanded Phase 3 to specify exercise-specific interactive experiences rather than a generic animation layer. Each built-in exercise defines its own cadence (step name + duration + loop behavior). The box breathing example is captured as the reference model. Custom exercises remain text-only in Phase 3.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Acceptance Criteria** (to be detailed during Phase 3 planning)

- AC3.1: Each built-in exercise can define an interactive experience as a sequence of named steps, each with a duration in seconds and an optional loop count or "until dismissed" flag.
- AC3.2: Box breathing defines four steps — inhale (4s), hold (4s), exhale (4s), hold (4s) — looping continuously until the user taps "Done."
- AC3.3: During an interactive step, the user sees the step name (e.g. "Inhale"), a countdown timer, and a visual indicator (shape, progress ring, or equivalent) driven by the timer.
- AC3.4: The interactive guide is presented alongside or instead of the text steps — not hidden behind an extra tap.
- AC3.5: Custom exercises remain text-only in Phase 3 unless a duration field is added to the custom exercise creation flow (deferred decision).

---

## Module Structure

This feature integrates into the existing greenfield module structure:

- `features/exercises/` — owns: ExerciseSuggestion, CustomExerciseForm, built-in exercise definitions (including Phase 3 interactive specs per exercise). Depends on: `store/` (for custom exercise persistence).
- `features/checkin/` — triggers the suggestion screen after a negative mood save. Depends on: `features/exercises/`.
- `features/settings/` — entry point for reaching the manage exercises screen.
- `store/` — persists custom exercises alongside other local data.

---

## Open Questions

- OQ1: Which specific exercises should ship in the built-in library beyond box breathing?
  **Answer**: Exercises must be doable anywhere, anytime, with no equipment. Suggested candidates: box breathing (confirmed), 5-4-3-2-1 grounding, diaphragmatic breathing, progressive muscle relaxation (seated version), cold water reset (if no equipment needed — may be excluded). Final list to be confirmed during Phase 1 implementation.
- OQ2: In Phase 1, should the single suggested exercise be random, or always the same?
  **Answer**: Random.
- OQ3: Should the exercise suggestion screen have a "show me something else" option?
  **Answer**: No — no library or picker is exposed during a check-in at any phase. The app always chooses for the user.

---

## Revised Assessment

Size: FEATURE (two meaningful phases; Phase 3 is a polish pass per exercise)
Greenfield: no (integrates into existing check-in flow and module structure)
Risk: LOW-MODERATE — the trigger and dismissal are simple; the main risk is Phase 3 interactive timers requiring careful UX design per exercise.

[x] Reviewed
