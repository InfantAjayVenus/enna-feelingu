# enna-feelingu Curriculum

## Tech Stack
React Native · Expo SDK 54 · Expo Router · TypeScript (strict) · SQLite · React Compiler

## Learner Profile
Experienced React/web developer, new to React Native and mobile.

---

## Module 1: Orientation — React Native for Web Developers
Goal: Kill the mental overhead of the unfamiliar runtime. App running on device, project structure fully mapped.

- [ ] Step 1.1: Run the app on device via Expo Go — understand the Metro bundler hot-reload loop
- [ ] Step 1.2: Map Expo Router to Next.js — file-based routes, `_layout.tsx`, route groups, Stack vs Tab navigator
- [ ] Step 1.3: StyleSheet vs CSS — no cascade, no units (dp), `StyleSheet.create` vs inline styles
- [ ] Step 1.4: The View / Text / ScrollView trifecta — web element equivalents
- [ ] Step 1.5: Flexbox on mobile — `flexDirection: 'column'` default, density-independent pixels
- [ ] Step 1.6: Safe area — `SafeAreaView`, `useSafeAreaInsets()`, vs CSS `env(safe-area-inset-*)`
- [ ] Step 1.7: `Platform.select` and `Platform.OS` — compile-time vs runtime splits
- [ ] Step 1.8: Typed routes and the `@/` alias — Expo Router static types, `tsconfig.json` path mapping
- [ ] Step 1.9: React Compiler caveat — no manual `useMemo`/`useCallback`; the one legitimate exception

---

## Module 2: Data Model & Local Persistence
Goal: Core types defined, SQLite wired up, working save/read round-trip visible in UI.

- [ ] Step 2.1: Design the `CheckInEntry` type — `id`, `timestamp`, `mood`, `activity`, `skipped`, `autoSkipped`, `overriddenByEntryId`
- [ ] Step 2.2: SQLite vs AsyncStorage — why SQLite wins for time-series with queries and export
- [ ] Step 2.3: Open the database and run migrations — `SQLite.openDatabaseSync`, `CREATE TABLE IF NOT EXISTS` with all columns up front
- [ ] Step 2.4: Write `saveEntry` in `store/checkin-store.ts` — parameterised INSERT, no string interpolation
- [ ] Step 2.5: Write `getEntries` — typed query, `rowToEntry` mapper
- [ ] Step 2.6: Wire a test read/write in the Home tab — "Save test entry" button + list
- [ ] Step 2.7: Refactor to `SQLiteProvider` and `useSQLiteContext()` — idiomatic Expo pattern
- [ ] Step 2.8: Async vs sync DB access — when each is appropriate
- [ ] Step 2.9: UUID generation — `crypto.randomUUID()` in Hermes

---

## Module 3: Check-In Form (Phase 1 Core Loop)
Goal: Full Phase 1 check-in screen — slider mood input with gradient, activity text field, disabled-until-valid submit, save confirmation. Home tab is the first screen the user sees.

- [ ] Step 3.1: Module structure — `features/checkin/` + `store/` separation; why business logic lives outside `app/`
- [ ] Step 3.2: `CheckInForm` component skeleton in `features/checkin/CheckInForm.tsx` — renders in `app/(tabs)/index.tsx`
- [ ] Step 3.3: `use-checkin-form.ts` custom hook — `CheckInFormState` (`mood: number | null`, `activity: string`), `setMood`, `setActivity`, `submit`
- [ ] Step 3.4: Mood slider — `Slider` from `@react-native-community/slider`, integer snapping (`step={1}`, `minimumValue={1}`, `maximumValue={10}`)
- [ ] Step 3.5: Slider gradient track — `minimumTrackTintColor` red, `maximumTrackTintColor` green; dynamic emoji that updates as user drags
- [ ] Step 3.6: `TextInput` for activity — optional free-text field, `placeholder="what I did this hour"`, `KeyboardAvoidingView`
- [ ] Step 3.7: Disabled submit button — button inactive when `mood === null`; no inline error, no toast until submit
- [ ] Step 3.8: Save handler — generate UUID, build `CheckInEntry` with `skipped: false`, `autoSkipped: false`, `overriddenByEntryId: null`; call `saveEntry`; show confirmation
- [ ] Step 3.9: Confirmation feedback — success message or screen transition; save must never be a silent no-op
- [ ] Step 3.10: Persistence smoke-test — close and reopen app; verify entry survives force-close

---

## Module 4: Notification Scheduling (Phase 2)
Goal: Hourly notifications fire during the user's active window. Tap opens check-in screen.

- [ ] Step 4.1: Permissions mental model — one-time OS grant, deep-link to Settings on denial
- [ ] Step 4.2: Request permission at the right moment — Settings tab, "Enable hourly reminders" toggle
- [ ] Step 4.3: Schedule trigger-based notifications — `CalendarTrigger`, one per active hour per day, iOS 64-limit
- [ ] Step 4.4: Cancel and reschedule — `cancelAllScheduledNotificationsAsync`, `AsyncStorage` for last-scheduled timestamp
- [ ] Step 4.5: Handle notification tap while backgrounded — `addNotificationResponseReceivedListener`, cold-start tap
- [ ] Step 4.6: Handle notification arrival in foreground — `addNotificationReceivedListener`, `setNotificationHandler`
- [ ] Step 4.7: Auto-skip after 25 minutes — silent notification 25 min after hourly, response listener triggers carry-forward
- [ ] Step 4.8: Skip and carry-forward — `skipped: true`, `autoSkipped` flag, `overriddenByEntryId` linking
- [ ] Step 4.9: Notification content — `title`, `body`, `data` payload (`type`, `hour`)
- [ ] Step 4.10: Test on device — why scheduled triggers need a dev build on Android (not Expo Go)

---

## Module 5: History View & Mood Chart (Phase 4)
Goal: Monthly → weekly → daily drill-down rendered. Mood sparkline chart visible on day view.

- [ ] Step 5.1: Create the History tab — `app/(tabs)/history.tsx`, tab bar entry
- [ ] Step 5.2: Query helpers — `getMonthSummaries()`, `getWeekSummaries()`, `getDayEntries()` using SQLite `strftime`
- [ ] Step 5.3: Monthly list with `FlatList` — `keyExtractor`, `getItemLayout`, no nested ScrollView
- [ ] Step 5.4: Navigation month → week → day — dynamic route segments `[year]/[month]/[day].tsx`, `useLocalSearchParams`
- [ ] Step 5.5: Retroactive logging UI — empty hour "+" button, `saveEntry` with past `timestamp` (Phase 3 feature)
- [ ] Step 5.6: Mood sparkline — `VictoryLine`, fixed `domain={{ y: [1, 10] }}`, Skia canvas rendering
- [ ] Step 5.7: FlatList performance — `removeClippedSubviews`, `maxToRenderPerBatch`, no FlatList inside ScrollView
- [ ] Step 5.8: Empty state and loading state — `ActivityIndicator`, illustrated empty state
- [ ] Step 5.9: Pull-to-refresh — `RefreshControl`, native gesture on iOS vs Android

---

## Module 6: Export (CSV / JSON) (Phase 5)
Goal: Time-windowed export produces a shareable file via the native share sheet.

- [ ] Step 6.1: Create the Export modal — `app/export.tsx` as Stack modal, time-window picker + format buttons
- [ ] Step 6.2: Date picker — platform-native date picker, no `<input type="date">`
- [ ] Step 6.3: Query the export dataset — async `getEntries({ from, to })`
- [ ] Step 6.4: Serialise to CSV — pure `toCsv()` function, escape commas, column headers
- [ ] Step 6.5: Serialise to JSON — `JSON.stringify` with metadata wrapper for forward compatibility
- [ ] Step 6.6: Write to file system — `FileSystem.writeAsStringAsync`, `cacheDirectory` vs `documentDirectory`
- [ ] Step 6.7: Invoke native share sheet — `Sharing.shareAsync(fileUri)`, OS owns the UI
- [ ] Step 6.8: Handle share cancellation — `try/catch`, reset `exporting` state
- [ ] Step 6.9: Permissions — no permission needed for `cacheDirectory`; contrast with `expo-media-library`

---

## Module 7: Polish — Animations, Accessibility & Production Readiness
Goal: Production-quality finish. Dev build running on device with all native modules.

- [ ] Step 7.1: Animate slider selection — `useSharedValue` + `Animated.spring` scale on emoji as value changes
- [ ] Step 7.2: Haptic feedback — `Haptics.notificationAsync` on save, `impactAsync` on mood drag
- [ ] Step 7.3: Accessibility — `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`; VoiceOver vs TalkBack
- [ ] Step 7.4: Dark mode audit — replace all hardcoded colours with `useThemeColor` calls
- [ ] Step 7.5: Build a dev client — `expo run:android`, why some native modules need it
- [ ] Step 7.6: Error boundaries — `ErrorBoundary` around `SQLiteProvider`, graceful crash screen
- [ ] Step 7.7: OTA updates — `expo-updates`, JS changes vs native changes, the deployment split
