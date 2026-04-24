# enna-feelingu Design System Setup Checklist

This checklist tracks the files, configs, and runtime setup needed to apply the design system defined in `DESIGN.md` and `DESIGN-TOKENS.md` to the app.

## Current Baseline

- Expo Router is already configured.
- System dark mode is already enabled at the Expo app-config level.
- The app already has `reanimated`, `gesture-handler`, `haptics`, and vector icon dependencies.
- The app is still using the starter theme primitives in `constants/theme.ts`.
- NativeWind and Tailwind config files do not exist yet.

## Checklist

### 1. NativeWind and Tailwind setup

- [ ] Add `tailwind.config.js`.
- [ ] Add the `nativewind/preset`.
- [ ] Set `darkMode: "class"`.
- [ ] Extend theme tokens for colors, spacing, radii, font sizes, and shadows.
- [ ] Include `app/**/*`, `components/**/*`, and any feature folders in the Tailwind content globs.
- [ ] Add `global.css` with Tailwind directives.
- [ ] Import the global stylesheet from the app entry path used by Expo Router.

### 2. Babel and Metro setup

- [ ] Add `babel.config.js` if missing.
- [ ] Keep `babel-preset-expo` as the base preset.
- [ ] Add the NativeWind Babel transform.
- [ ] Add `metro.config.js`.
- [ ] Wrap Metro with NativeWind and point it at `global.css`.
- [ ] Clear the Metro cache after Babel or Metro changes.

### 3. Theme and token layer

- [ ] Replace the starter `Colors` and `Fonts` primitives in `constants/theme.ts`.
- [ ] Add semantic tokens for background, surface, text, border, mood, and status colors.
- [ ] Add component tokens for screens, cards, buttons, inputs, sliders, and status badges.
- [ ] Add helper functions for mood color and mood background mapping.
- [ ] Keep the design system aligned with the light and dark palette from the docs.

### 4. Theme sync and app shell

- [ ] Keep a root theme bridge in `app/_layout.tsx`, or replace it with a NativeWind color-scheme flow.
- [ ] Ensure the app respects system light and dark mode.
- [ ] Align the status bar with the active theme.
- [ ] Verify that navigation surfaces use the correct theme colors.

### 5. Typography

- [ ] Load `Inter` as the primary app font.
- [ ] Keep a system fallback for platforms where `Inter` is unavailable.
- [ ] Apply the documented type scale for titles, section headers, body, captions, buttons, and emoji labels.

### 6. Icons and status symbols

- [ ] Standardize icon usage on Material Icons for Android and web.
- [ ] Keep or extend the Expo Symbols fallback on iOS if needed.
- [ ] Add or update icon mappings for all required navigation and status states.

### 7. Motion and feedback

- [ ] Preserve `react-native-reanimated` for animations.
- [ ] Preserve `react-native-gesture-handler` for slider interactions.
- [ ] Use `expo-haptics` for selection feedback.
- [ ] Add `react-native-svg` if chart rendering is implemented.
- [ ] Apply the documented motion rules for slider movement, button press, navigation, and save feedback.

### 8. Asset and layout alignment

- [ ] Update splash and adaptive icon colors to match the green-based palette.
- [ ] Keep using native emojis and Material icons for v1.
- [ ] Apply the documented spacing, touch-target, card, and button sizing rules.
- [ ] Verify that screen layouts match the mockups for check-in, history, settings, export, and success states.

### 9. Accessibility checks

- [ ] Keep touch targets at or above 48dp.
- [ ] Maintain WCAG AA contrast.
- [ ] Never rely on emoji alone for meaning.
- [ ] Keep haptic feedback on key selections and confirmations.

## Implementation Order

1. Add NativeWind and Tailwind config.
2. Add Babel and Metro support.
3. Introduce the semantic token layer.
4. Wire theme sync into the app shell.
5. Load the type system and icon conventions.
6. Add chart and motion support where screens need them.
7. Tune assets, spacing, and accessibility.

