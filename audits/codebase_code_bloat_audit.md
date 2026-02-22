# Subiq Codebase — Code Bloat Audit

> Target: Full codebase (`d:/Development/App/subiq`)
> Auditor: GitHub Copilot (Beast Mode)
> Date: 2026-02-22

---

## [2026-02-22] - Critical - CB-001 - All Tab Screens + \_layout.tsx

- **Description**: The theme resolution pattern (3–4 lines computing `effectiveColorScheme` and `theme`) is copy-pasted verbatim in every screen: `app/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/activity.tsx`, `app/(tabs)/assets.tsx`, `app/(tabs)/settings.tsx`, and `app/index.tsx`. Any change to the logic (e.g. adding a new theme mode) must be replicated across six files.
- **Status**: Fixed
- **Resolution**: Extracted into `hooks/use-app-theme.ts` returning `{ theme, colorScheme }`. All screens updated to call the hook.
- **Impact**: Eliminates six instances of duplicated theme logic; enforces single-source-of-truth for theme resolution.

---

## [2026-02-22] - High - CB-002 - All Components (theme: any prop drilling)

- **Description**: Every component (`ExpenseSummary`, `SubscriptionCard`, `ActivityLogItem`, `AssetLogItem`, `SubscriptionLogItem`, `AssetCard`, `StatsCard`, `AddSubscriptionModal`, `AddAssetModal`, `AddActivityModal`, `AuthButton`, `AuthInput`, `UnifiedLogsSection`, `RecommendationEngine`, `SettingsItem`, `CurrencySelector`) receives `theme: any` as an explicit prop. This is deep prop drilling with an untyped interface. Screens must import `Colors`, resolve the scheme, and then pass the theme object manually through every component tree.
- **Status**: Fixed
- **Resolution**: All components now call `useAppTheme()` internally. The `theme` prop has been removed from all component interfaces and call sites. `theme: any` is eliminated.
- **Impact**: Removes ~60+ redundant `theme={theme}` prop usages; type-safe theme throughout.

---

## [2026-02-22] - High - CB-003 - stores/theme-store.ts + stores/currency-store.ts

- **Description**: Both Zustand store files contain identical `createJSONStorage` wrapper boilerplate with `getItem`, `setItem`, and `removeItem` using `AsyncStorage`. Any change to serialization logic must be made in two places.
- **Status**: Fixed
- **Resolution**: Extracted into `utils/storage.ts` as `appStorage`. Both stores import and reuse it.
- **Impact**: Removes ~15 lines of duplicate code; single place to modify storage behaviour.

---

## [2026-02-22] - High - CB-006 - components/assets/asset-log-item.tsx + components/dashboard/subscription-log-item.tsx

- **Description**: `AssetLogItem` and `SubscriptionLogItem` are structurally near-identical: same layout with `accentLine`, same `actionContainer` + icon + action text + date pattern, same `details` line, and 100% identical `StyleSheet` definitions. Only the data field name differs (`assetName` vs `subscriptionName`).
- **Status**: Fixed
- **Resolution**: Both components removed. Replaced by `components/ui/log-item.tsx` — a single generic component accepting `title`, `action`, `date`, `details`, `getActionColor`, and `getActionIcon`. Both original files now re-export thin wrappers using `LogItem`.
- **Impact**: Reduces ~120 lines of duplicate component + style code to a single 80-line component.

---

## [2026-02-22] - High - CB-013 - app/(tabs)/index.tsx, activity.tsx, assets.tsx

- **Description**: `MOCK_SUBSCRIPTIONS`, `MOCK_RECOMMENDATIONS`, `MOCK_ASSET_LOGS`, `MOCK_SUBSCRIPTION_LOGS`, and `MOCK_ACTIVITY`, `MOCK_ASSETS` are defined as large inline constants directly inside screen files. This pollutes screen-level scope, mixes data with presentation, and makes screens harder to read.
- **Status**: Fixed
- **Resolution**: All mock data moved to `constants/mock-data.ts` and imported by screens.
- **Impact**: Each screen loses ~50–80 lines of data declarations; mock data is now co-located and easy to replace/remove when real APIs are connected.

---

## [2026-02-22] - Medium - CB-004 - app/(tabs)/index.tsx

- **Description**: The `StyleSheet` in `app/(tabs)/index.tsx` defines 7 entries that are never referenced in any JSX: `greeting`, `notificationBtn`, `notificationDot`, `sortBar`, `sortScroll`, `sortChip`, `sortChipText`. These are dead styles from a removed UI feature.
- **Status**: Fixed
- **Resolution**: All 7 dead style definitions removed.
- **Impact**: Reduces cognitive load; removes ~25 unreferenced style lines.

---

## [2026-02-22] - Medium - CB-005 - components/ui/add-activity-modal.tsx, add-asset-modal.tsx, add-subscription-modal.tsx

- **Description**: All three modal components duplicate the form-reset sequence (multiple `setState("")` calls) in two separate places: inside `handleAdd` (after success) and inside `handleClose`. Any new field addition must be remembered in both places.
- **Status**: Fixed
- **Resolution**: Each modal now has a single `resetForm` function called by both `handleAdd` and `handleClose`.
- **Impact**: Eliminates three instances of copy-pasted reset logic; new fields only need to be reset in one place per modal.

---

## [2026-02-22] - Medium - CB-008 - components/dashboard/subscription-card.tsx, recommendation-engine.tsx

- **Description**: Hardcoded hex value `"#FFAB00"` appears in both `subscription-card.tsx` (Trial status) and `recommendation-engine.tsx` (Trial type). Additionally, `rgba(0,0,0,0.03)` and `rgba(0,0,0,0.1)` appear as inline style values bypassing the theme system.
- **Status**: Fixed
- **Resolution**: Added `warning` token to `Colors.light` and `Colors.dark` in `constants/theme.ts`. `#FFAB00` references replaced with `theme.warning`. Static `rgba` values moved to StyleSheet constants.
- **Impact**: All colors now flow through the theme; dark/light mode changes apply universally.

---

## [2026-02-22] - Medium - CB-010 - constants/theme.ts

- **Description**: `Fonts` uses `Platform.select` with `ios` and `default` keys that are byte-for-byte identical (`{ sans: "Inter", serif: "Source Serif 4", mono: "JetBrains Mono" }`). The `ios` key is entirely redundant since `default` already covers iOS when no `ios` key is found.
- **Status**: Fixed
- **Resolution**: Removed the `ios` key from `Platform.select`. `default` now handles all non-web platforms.
- **Impact**: Removes 5 lines of dead platform configuration.

---

## [2026-02-22] - Medium - CB-011 - components/assets/asset-log-item.tsx, components/dashboard/subscription-log-item.tsx

- **Description**: Both log item components use `theme.warning || theme.primary` as a color fallback for the "Maintenance Due" / "Price Changed" action states. `theme.warning` does not exist in the theme type, making `theme.warning` always `undefined` and this a dead branch — always falling to `theme.primary`.
- **Status**: Fixed
- **Resolution**: Replaced with `theme.warning` now that the `warning` token exists in the theme (see CB-008 fix). Dead `|| theme.primary` fallback removed.
- **Impact**: Correct visual differentiation for warning-level actions.

---

## [2026-02-22] - Medium - CB-015 - app/\_layout.tsx

- **Description**: Font loading check has incorrect guard order:
  ```ts
  if (!fontsLoaded) { return null; }
  if (fontError) { console.warn(...) }
  ```
  When fonts fail to load, `fontsLoaded` becomes `true` and `fontError` becomes a truthy Error. However if fonts are still loading (`!fontsLoaded`), the error warning is unreachable. The `fontError` check should come before the `!fontsLoaded` guard so errors are always surfaced.
- **Status**: Fixed
- **Resolution**: Reordered: check `fontError` first (log and continue), then early-return if `!fontsLoaded`.
- **Impact**: Font errors are always visible in the console regardless of loading state.

---

## [2026-02-22] - Low - CB-007 - app/(tabs)/index.tsx, activity.tsx, assets.tsx

- **Description**: `handleAddSubscription`, `handleAddActivity`, and `handleAddAsset` in the three tab screens are placeholder stubs containing only `console.log` + a fake `Promise<setTimeout>`. These create noise and mislead reviewers into thinking data persistence is implemented.
- **Status**: Fixed
- **Resolution**: Added `LOG:` prefixed console statements per Beast Mode convention and a `// TODO:` comment clearly marking each as an unimplemented stub. The fake promise delay kept to simulate loading state for UX purposes.
- **Impact**: Clearer intent; no functional change.

---

## [2026-02-22] - Low - CB-011b - components/assets/asset-log-item.tsx

- **Description**: `getActionIcon()` has a `default` branch returning `"information-circle"` that can never be reached because the `action` field is a discriminated union covering all possible string values.
- **Status**: Fixed
- **Resolution**: Default branch removed; TypeScript exhaustiveness is now enforced at the type level.
- **Impact**: Removes dead code path.

---
