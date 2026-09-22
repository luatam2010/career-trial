# Project Guidance

## User Preferences

- Bilingual site: English and Vietnamese, switchable from the navigation
- Modernised reference style: teal/green accents, soft mint backgrounds, rounded cards, dark navy headings
- Cursor-following colour effect and hover wobble/tilt on images and cards
- Pricing pop-up must include a 7-day trial, an X close button, and a blurred backdrop
- Logo click returns to the top of the Main Page

## Verified Commands

- **typecheck**: `mops check --fix && pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `mops build && pnpm build`

## Learnings

- This project uses Enhanced Migration: stable actor fields are declared type-only in main.mo and supplied by migration modules in the lexicographic chain; a new stable field needs a NEW migration module, never an inline initializer or actor-body statement.
- With [canisters.backend.migrations] check-limit = 1, mops check --fix rejects a chain with more than one pending migration against the deployed .most baseline and names the latest file to fold into.
- Motoko has no triple-quoted string literal: use a single " delimiter with \n escapes and \" for inner quotes.
- caffeineai-oql MapEntity.toEntity auto-derives rows only for flat records; a value type containing a nested record or array fails with M0230 — use toEntityManual with one explicitly return-typed .payload(name, extractor) per flat field.
- OQL manual mode over a nested Map<Principal, Map<K,V>> requires flattening to (owner, row) tuples with .ownedBy("owner") + .controllerOrScoped().
- The design system exposes heading colour as the text-heading-brand utility (NOT text-heading); @apply text-heading inside @layer base fails the Vite/PostCSS build.
- Biome rejects role="group" on a div (use fieldset), role="status" on a p (use aria-live), and role="progressbar" on a non-focusable div.
- The shadcn Dialog primitive's DialogContent hardcodes its own overlay and close button, so a blurred backdrop needs a custom portal.
- A shared Section wrapper should spread Omit<HTMLAttributes<HTMLElement>, 'children'|'className'|'id'> so data-ocid markers on pages are actually emitted.
- The translations dictionary is a flat keyed object shared across parallel page tasks; append new keys at the end of each language block rather than inserting near related keys.
- TestResult.score and EvidenceCard.rating are both 0-100 percentages from the backend (career.mo computes score = correct*100/total and stores rating = score); the test result screen derives the raw count as Math.round(score*total/100), and evidence overall-score displays clamp the rating to 0-100.
- formatPercent does not clamp, so any 0-100 display fed a value that could exceed 100 must pass through clampPercent first.
- EvidenceCard carries no principal, so every 'my evidence' path must attribute via the caller's stored displayName, never caller.toText().
- MyEvidenceCard is a view type, not stable state, so adding trialId needed no migration.
- The backend source can be ahead of the generated frontend bindings: run mops build then pnpm bindgen before the frontend consumes a new method.
- A per-row backend query in a list must live in its own child component — calling a hook inside a .map() violates the rules of hooks.
