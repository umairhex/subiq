# SUBIQ Backend Integration - Findings & Architecture

## Overview

Migrated the SUBIQ app from fully mocked/hardcoded data to a real Supabase backend with TanStack Query for server state management.

## Architecture Decisions

### 1. Supabase Client (`lib/supabase.ts`)

- Singleton pattern with `Database` type generic for full type safety
- Uses AsyncStorage for session persistence across app restarts
- AppState listener auto-refreshes tokens when app returns to foreground
- `detectSessionInUrl: false` because deep links aren't used for auth

### 2. Auth Flow (`stores/auth-store.ts` + `hooks/use-auth.ts`)

- Zustand store (non-persisted) tracks `session`, `user`, `isLoading`, `isInitialized`
- `initialize()` method called once in root layout: calls `getSession()` and subscribes to `onAuthStateChange`
- `useProtectedRoute()` hook in `_layout.tsx` redirects based on session state
- `useAuth()` hook provides `signUp`, `signIn`, `signOut`, `resetPassword`, `updatePassword` actions

### 3. TanStack Query (`providers/query-provider.tsx`)

- `QueryClient` with 5-minute stale time and 2 retries
- Wrapped at root level inside `AppQueryProvider`
- Each data hook (`useSubscriptions`, `useAssets`, etc.) uses `useQuery` with `enabled: !!user` to prevent unauthenticated fetches
- Mutations auto-invalidate related query keys (e.g., creating a subscription invalidates `['subscriptions']`, `['subscription_logs']`, and `['expense_summary']`)

### 4. Data Transforms (`utils/transforms.ts`)

- Database uses `snake_case`, component interfaces use `camelCase`
- Transform functions (`toSubscription`, `toAsset`, `toActivity`, etc.) bridge the gap
- Computed fields like `daysLeft` (subscriptions) and `status` (assets/warranty) are derived at transform time

### 5. Database Schema (`database/001_init.sql`)

- 7 tables: `profiles`, `subscriptions`, `assets`, `activities`, `subscription_logs`, `asset_logs`, `recommendations`
- Row Level Security on every table - users only access their own data
- Auto-trigger creates profile on signup via `handle_new_user()`
- `updated_at` auto-set via trigger on profiles, subscriptions, assets
- `get_expense_summary` RPC function computes monthly/yearly totals server-side

## Files Created

| File                           | Purpose                                 |
| ------------------------------ | --------------------------------------- |
| `lib/supabase.ts`              | Supabase client singleton               |
| `types/database.ts`            | TypeScript types matching DB schema     |
| `stores/auth-store.ts`         | Auth session state management           |
| `providers/query-provider.tsx` | TanStack Query provider                 |
| `hooks/use-auth.ts`            | Auth actions (sign in/out/up, password) |
| `hooks/use-subscriptions.ts`   | Subscription CRUD + logs                |
| `hooks/use-assets.ts`          | Asset CRUD + logs                       |
| `hooks/use-activities.ts`      | Activity CRUD                           |
| `hooks/use-profile.ts`         | Profile read/update                     |
| `hooks/use-dashboard.ts`       | Expense summary + recommendations       |
| `utils/transforms.ts`          | Snake_case → camelCase mappers          |
| `database/001_init.sql`        | Full PostgreSQL schema with RLS         |

## Files Modified

| File                      | Changes                                                    |
| ------------------------- | ---------------------------------------------------------- |
| `app/_layout.tsx`         | Added QueryProvider, auth initialization, route protection |
| `app/index.tsx`           | Real Supabase auth (signUp/signIn) instead of setTimeout   |
| `app/(tabs)/index.tsx`    | Dynamic data from hooks, real subscription creation        |
| `app/(tabs)/activity.tsx` | Dynamic activities + computed usage intelligence           |
| `app/(tabs)/assets.tsx`   | Dynamic assets, working search bar, real asset creation    |
| `app/(tabs)/settings.tsx` | Real profile data, real logout via Supabase                |
| `app/edit-profile.tsx`    | Profile fetched from DB, real update mutation              |
| `app/change-password.tsx` | Real password update via Supabase Auth                     |
| `app/forgot-password.tsx` | Real password reset email via Supabase Auth                |

## What Was Removed

- All `MOCK_*` imports from screens (constants/mock-data.ts is now unused)
- All `setTimeout` simulations in auth and form handlers
- All hardcoded values ("John Doe", "john.doe@example.com", "$76.97", etc.)

## Setup Required

1. Create a Supabase project at https://supabase.com
2. Run `database/001_init.sql` in the Supabase SQL Editor
3. Update `.env` with your project URL and anon key:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Pending Improvements

- Social auth (Google/Apple) buttons exist but aren't wired to Supabase OAuth yet
- Notifications settings item is visual-only (no push notification system)
- Export Data and Privacy Policy settings items have no handlers
- Recommendation generation is manual (could be automated via Edge Functions)
- No offline support / optimistic updates for mutations
- `constants/mock-data.ts` can be deleted now that all screens use real data
