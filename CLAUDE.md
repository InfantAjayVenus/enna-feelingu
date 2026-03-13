# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # Start Expo dev server (scan QR with Expo Go or dev build)
pnpm android        # Start with Android target
pnpm ios            # Start with iOS target
pnpm web            # Start with web target
pnpm lint           # Run ESLint via expo lint
pnpm reset-project  # Move starter code to app-example/, reset app/ to blank
```

Package manager is **pnpm** with hoisted node linker (required for Metro bundler compatibility).

## Architecture

**Expo Router file-based routing** — routes are defined by the file system under `app/`.

```
app/
  _layout.tsx          # Root Stack navigator + ThemeProvider
  modal.tsx            # Modal screen (presented over tabs)
  (tabs)/
    _layout.tsx        # Bottom tab bar (haptic feedback, icon symbols)
    index.tsx          # Home tab
    explore.tsx        # Explore tab
```

**Path alias**: `@/` maps to the repo root (e.g., `@/components/themed-text`).

**Platform-specific files**: Expo resolves `.ios.tsx` / `.web.ts` suffixes at build time. For example:
- `hooks/use-color-scheme.ts` — native (re-exports `react-native`)
- `hooks/use-color-scheme.web.ts` — web-specific implementation

**Theme system** (`constants/theme.ts`):
- `Colors` — light/dark palette used throughout the app
- `Fonts` — platform-specific font stacks (iOS system fonts, web system-ui stack)
- Consumed via `hooks/use-theme-color.ts` → `useThemeColor(props, colorName)`

**Shared components** (`components/`):
- `ThemedText` / `ThemedView` — base primitives that auto-resolve light/dark colors
- `HapticTab` — tab button with haptic feedback on press
- `IconSymbol` / `IconSymbol.ios` — platform-split icon component (SF Symbols on iOS, MaterialIcons otherwise)
- `ParallaxScrollView` — scrollable view with an animated parallax header
- `ui/Collapsible` — expandable accordion section

## Key Config

- **New Architecture enabled** (`newArchEnabled: true` in app.json)
- **React Compiler enabled** (`experiments.reactCompiler: true`) — avoid manual `useMemo`/`useCallback` where the compiler can handle it
- **Typed routes enabled** (`experiments.typedRoutes: true`) — `expo-router` routes are statically typed
- **TypeScript strict mode** on
- App scheme: `ennafeelingu`
