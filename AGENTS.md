# Agent Guidelines for enna-feelingu

## Essential Commands
- `pnpm start` - Start Expo dev server (same as `expo start`)
- `pnpm android` - Start with Android target (`expo start --android`)
- `pnpm ios` - Start with iOS target (`expo start --ios`)
- `pnpm web` - Start with web target (`expo start --web`)
- `pnpm lint` - Run ESLint via expo lint
- `pnpm reset-project` - Move starter code to app-example/, reset app/ to blank
- `npx expo start --clear` - Start dev server with cache cleared (after changing Babel/Metro/NativeWind config)

## Key Architecture Notes
- **Expo Router**: File-based routing under `app/` directory
- **Path alias**: `@/` maps to repo root (e.g., `@/components/themed-text`)
- **Platform-specific files**: `.ios.tsx`/`.web.ts` suffixes resolved at build time
- **Theme system**: Use `hooks/use-theme-color.ts` → `useThemeColor(props, colorName)`
- **Shared components**: `ThemedText`, `ThemedView`, `HapticTab`, `IconSymbol`, `ParallaxScrollView`, `ui/Collapsible`
- **Root layout**: Keep `app/_layout.tsx` as the root place for theme and font loading
- **UI primitives**: When adding new UI primitives, prefer extending the shared token layer over duplicating styles

## Critical Configuration
- **Package manager**: pnpm with hoisted node linker (required for Metro)
- **New Architecture**: Enabled (`newArchEnabled: true` in app.json)
- **React Compiler**: Enabled (`experiments.reactCompiler: true`) - avoid manual `useMemo`/`useCallback`
- **Typed routes**: Enabled (`experiments.typedRoutes: true`) - statically typed expo-router routes
- **TypeScript strict mode**: on
- **App scheme**: `ennafeelingu`

## Module Boundaries (see .claude/BOUNDARIES.md)
- `app/` - Screens, navigation, routing (depends on features/*, store/)
- `features/*` - Domain-specific UI/logic (depends on store/)
- `store/` - Pure data layer (no UI/feature knowledge)
- **Rules**: No circular dependencies, app screens delegate to features, duplicate code over coupling violations

## Gotchas
- Avoid manual `useMemo`/`useCallback` - React Compiler handles it
- Trust executable configs over docs when they conflict
- Metro bundler requires hoisted node linker (pnpm default)
- No test framework configured yet - follow TDD principles by writing testable code

## Test-Driven Development (TDD)
- Write testable, pure functions in store/ and features/ modules first
- Keep UI components in app/ thin and focused on rendering
- Follow RED-GREEN-REFACTOR cycle:
  1. RED: Write a failing test expectation (even if just as a comment/TODO)
  2. GREEN: Implement minimum code to satisfy the requirement
  3. REFACTOR: Improve code structure while maintaining behavior
- Since no test runner is configured, document test intentions clearly in code

## How to investigate

Read the highest-value sources first:
- `README*`, root manifests, workspace config, lockfiles
- build, test, lint, formatter, typecheck, and codegen config
- CI workflows and pre-commit / task runner config
- existing instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`)
- repo-local OpenCode config such as `opencode.json`

If architecture is still unclear after reading config and docs, inspect a small number of representative code files to find the real entrypoints, package boundaries, and execution flow. Prefer reading the files that explain how the system is wired together over random leaf files.

Prefer executable sources of truth over prose. If docs conflict with config or scripts, trust the executable source and only keep what you can verify.

## What to extract

Look for the highest-signal facts for an agent working in this repo:
- exact developer commands, especially non-obvious ones
- how to run a single test, a single package, or a focused verification step
- required command order when it matters, such as `lint -> typecheck -> test`
- monorepo or multi-package boundaries, ownership of major directories, and the real app/library entrypoints
- framework or toolchain quirks: generated code, migrations, codegen, build artifacts, special env loading, dev servers, infra deploy flow
- repo-specific style or workflow conventions that differ from defaults
- testing quirks: fixtures, integration test prerequisites, snapshot workflows, required services, flaky or expensive suites
- important constraints from existing instruction files worth preserving

## Questions

Only ask the user questions if the repo cannot answer something important. Use the `question` tool for one short batch at most.

Good questions:
- undocumented team conventions
- branch / PR / release expectations
- missing setup or test prerequisites that are known but not written down

Do not ask about anything the repo already makes clear.

## Writing rules

Include only high-signal, repo-specific guidance such as:
- exact commands and shortcuts the agent would otherwise guess wrong
- architecture notes that are not obvious from filenames
- conventions that differ from language or framework defaults
- setup requirements, environment quirks, and operational gotchas
- references to existing instruction sources that matter

Exclude:
- generic software advice
- long tutorials or exhaustive file trees
- obvious language conventions
- speculative claims or anything you could not verify
- content better stored in another file referenced via `opencode.json` `instructions`

When in doubt, omit.

Prefer short sections and bullets. If the repo is simple, keep the file simple. If the repo is large, summarize the few structural facts that actually change how an agent should work.