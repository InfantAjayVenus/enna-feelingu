# enna-feelingu

Expo Router app for a mood check-in workflow. The UI is driven by the design system in `docs/design-assets/DESIGN.md` and `docs/design-assets/DESIGN-TOKENS.md`.

## Start

```bash
pnpm install
pnpm start
```

Useful commands:

```bash
pnpm lint
pnpm android
pnpm ios
pnpm web
```

If you change Babel, Metro, or NativeWind config, restart with cache cleared:

```bash
npx expo start --clear
```

## Design System

The project uses a layered token setup:

1. Primitive tokens in `tailwind.config.js`
2. Semantic/component tokens in `constants/theme.ts`
3. Shared base components in `components/`

### Core files

- `constants/theme.ts` exposes:
  - `Colors` for light/dark palette values
  - `Fonts` for font family fallbacks
  - `ui`, `sliderStyles`, `cardVariants`, `buttonVariants`
  - `motion` timing tokens
  - `getMoodColor(score)` and `getMoodBg(score)`
- `components/themed-text.tsx` and `components/themed-view.tsx` are the base text/surface primitives.
- `components/ui/icon-symbol.tsx` maps SF Symbols names to Material Icons on Android/web.
- `components/ui/status-icon.tsx` renders the status icons used by the design system.
- `components/motion/press-scale.tsx` applies the standard press scale feedback.
- `components/haptic-tab.tsx` adds tab press feedback and the shared 48dp hit area.

### How to use tokens

Prefer the shared tokens instead of hardcoded values:

```tsx
import { Text, View } from 'react-native';
import { Colors, ui, getMoodColor } from '@/constants/theme';

export function Example() {
  return (
    <View style={{ backgroundColor: Colors.light.background }}>
      <Text className={ui.textPrimary}>Mood</Text>
      <Text className={getMoodColor(8)}>Good</Text>
    </View>
  );
}
```

Use the shared containers for common UI patterns:

```tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PressScale } from '@/components/motion/press-scale';

export function Card() {
  return (
    <ThemedView style={{ padding: 16 }}>
      <ThemedText type="subtitle">Title</ThemedText>
      <PressScale onPress={() => {}}>
        <ThemedText type="link">Action</ThemedText>
      </PressScale>
    </ThemedView>
  );
}
```

### Motion and feedback rules

- Use `motion.fast`, `motion.normal`, and `motion.slow` for animation timing.
- Use `PressScale` for press feedback that should scale to `0.96`.
- Use `HapticTab` for tab navigation.
- Keep touch targets at or above `48dp`.

### Accessibility rules

- Do not rely on emoji alone for meaning.
- Keep contrast aligned with the light/dark palette.
- Use semantic labels and state where needed.

## App structure

```text
app/
  _layout.tsx        Root theme bridge, font loading, status bar
  (tabs)/
    _layout.tsx      Bottom tabs
    index.tsx        Home screen
    explore.tsx      Design-system sample screen
  modal.tsx          Modal example
components/
  themed-*           Shared base primitives
  ui/                Icons and collapsible UI
  motion/            Motion helpers
```

## Design references

- `docs/design-assets/DESIGN.md`
- `docs/design-assets/DESIGN-TOKENS.md`
- `docs/design-assets/DESIGN-SETUP-CHECKLIST.md`

## Notes

- The app uses Expo Router and NativeWind.
- Keep `app/_layout.tsx` as the root place for theme and font loading.
- If you add new UI primitives, prefer extending the shared token layer over duplicating styles in screens.
