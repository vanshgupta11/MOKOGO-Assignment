# MOKOGO — Listings Screen (React Native / Expo)

A single-screen React Native app that displays flatmate room listings with
combinable filters, search, sort, and an empty state — built as part of the
MOKOGO screening task.

## Tech Stack

- React Native (Expo)
- TypeScript
- Local static data (`data.ts`) — no backend

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npx expo start

# 3. Scan the QR code with Expo Go (Android/iOS),
#    or press "i" / "a" to launch an iOS/Android simulator
```

No environment variables, auth, or backend setup are required. The app runs
entirely on the sample data bundled in `data.ts`.

## Features Implemented

### Must-haves

| Feature | Status |
|---|---|
| Scrollable list of listing cards (title, locality/city, rent, room type, preferred gender, furnished tag) | ✅ |
| City filter | ✅ |
| Rent range filter (max-rent input) | ✅ |
| Preferred gender filter (bonus) | ✅ |
| Filters combine together | ✅ |
| Empty state when no listings match | ✅ |

### Nice-to-haves

| Feature | Status |
|---|---|
| Text search (title or locality) | ✅ |
| TypeScript types for the listing model | ❌ (not implemented — see trade-offs) |
| Sort control (rent low → high) | ✅ |
| Simulated loading state | ✅ |

All must-haves and 3/4 nice-to-haves from the brief are implemented. Basic
styling has also been applied to the list, cards, and filter controls,
beyond what the brief required.

## Approach & State Management

- All screen state (`city`, `maxRent`, `gender`, `search`, `sortAsc`,
  `loading`) is handled with local `useState` hooks — no external state
  library (Redux, Zustand, etc.) was used.
- **Reasoning:** this is a single, self-contained screen with a handful of
  independent filter values and no cross-screen or persisted state. Local
  state keeps the code easy to read and avoids introducing dependencies and
  boilerplate that wouldn't earn their keep at this scale. I'd reach for
  something like Zustand or React Context only if filters needed to be
  shared across multiple screens, or if the filter logic grew significantly
  more complex.
- Filtering and sorting are derived with a single `useMemo`, recomputing
  only when a relevant input changes, rather than storing filtered results
  in state. This avoids state-synchronization bugs (e.g. forgetting to
  re-filter after a filter value changes).

## Trade-offs & Assumptions

- **No TypeScript types for the listing model.** The listing objects are
  consumed as plain JS objects from `data.ts` rather than through a typed
  `Listing` interface. This was a deliberate cut given the time budget: it
  doesn't affect runtime behavior, only compile-time safety (e.g. catching a
  typo'd field name like `perferredGender`). With more time, I'd add a
  `Listing`/`RoomType`/`PreferredGender` type and apply it to `data.ts`, the
  filter state, and the `renderItem` callback.
- **Rent filter is a numeric text input, not a slider.** The brief allows
  either ("Rent range (or a max-rent slider)"). A text input was faster to
  implement correctly and is easier to verify during a quick screen
  recording; a slider (e.g. `@react-native-community/slider`) would be a
  straightforward swap if a more polished interaction is preferred.
- **Gender filter treats a listing's `"Any"` as compatible with every
  filter selection.** E.g., filtering by "Male" will still show listings
  where `preferredGender: "Any"`, since those listings are open to any
  gender. This felt like the intended real-world behavior rather than a
  strict equality check.
- **Loading state is simulated with a fixed 1-second timeout** rather than
  an actual async call, since there's no backend in scope for this task.
- **No debounce on the search input.** With only 10 sample records this has
  no visible cost, but with a larger dataset I'd debounce the search input
  (e.g. 200–300ms) to avoid re-filtering on every keystroke.

## What I'd Improve With More Time

1. **TypeScript types for the listing model** — define `Listing`,
   `RoomType`, and `PreferredGender`, and apply them to `data.ts`, filter
   state, and rendering, so the compiler catches shape mismatches instead of
   relying on manual review.
2. **Extract components** — pull `ListingCard` and `FilterBar` out of
   `index.tsx` into their own files for readability and reuse, since the
   current version keeps everything in one file for simplicity of review.
3. **Debounced search** and a "clear all filters" action.
4. **Accessibility** — labels/roles on filter controls, minimum touch
   target sizes, and screen-reader support for the empty state.
5. **Unit tests** for the filtering/sorting logic (e.g. Jest), since that's
   the part of the app most likely to regress silently.
6. **Persist filter state** (e.g. via `AsyncStorage`) so filters survive an
   app reload, if that matched real product behavior.

## Project Structure

```
.
├── index.tsx     # Main (and only) screen: filters, search, sort, list, empty/loading states
├── data.ts       # Sample listing data
└── README.md
```