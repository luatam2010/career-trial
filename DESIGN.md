# Design Brief

## Direction

**Career Trial — "Mint Signal"** — a calm, confident career-orientation platform that turns career exploration into a hands-on trial, styled as a modernised version of the team's teal/mint reference. Extended for the trial-test flow: a five-question knowledge test, an auto-scored result panel, and the resulting evidence card.

## Tone

Refined modern SaaS with an educational warmth: airy mint panels, deep navy type, and one vivid teal accent used with conviction — never a timid, evenly-distributed palette.

## Differentiation

A living mint surface: a teal glow follows the cursor across the page while cards and imagery tilt and wobble on hover, so the site feels responsive rather than static — the reference's flat calm, made kinetic.

## Color Palette

| Token            | OKLCH (light)      | Hex approx | Role                                     |
| ---------------- | ------------------ | ---------- | ---------------------------------------- |
| background       | 0.985 0.006 165    | #F7FAF9    | Page canvas, faint mint-tinted off-white |
| foreground       | 0.22 0.035 255     | #1B2436    | Body text, near-navy                     |
| card             | 1 0 0              | #FFFFFF    | Cards, popovers, nav surface             |
| primary          | 0.56 0.115 172     | #0E9B7C    | Brand teal: CTAs, links, icons, prices   |
| primary-deep     | 0.44 0.085 176     | #2E7D6E    | Hover/pressed teal, role labels          |
| mint             | 0.955 0.028 168    | #E8F5EE    | Large section panels, avatar fills       |
| mint-deep        | 0.9 0.045 170      | #CFE8E0    | Number chips, tag pills, selection       |
| heading          | 0.24 0.05 260      | #0F1B2D    | H1–H4 dark navy headings                 |
| cream            | 0.97 0.038 92      | #FDF6E3    | "Prices not final" notice bar            |
| cream-foreground | 0.34 0.06 62       | #6B4E1E    | Notice text, dark brown                  |
| muted-foreground | 0.5 0.022 250      | #6B7280    | Secondary/body gray                      |
| border           | 0.91 0.008 250     | #E5E7EB    | Thin light-gray card borders             |
| success          | 0.6 0.13 158       | #12A06B    | Teal checkmarks, completed states        |
| destructive      | 0.55 0.2 26        | #D2453F    | Errors, destructive actions              |
| ring             | 0.56 0.115 172     | #0E9B7C    | Focus rings (teal)                       |
| answer-selected  | 0.93 0.045 172     | #D8F0E8    | Chosen quiz answer fill                  |
| answer-correct   | 0.94 0.05 158      | #DCF3E4    | Correct answer fill (success hue)        |
| answer-incorrect | 0.94 0.035 26      | #FBE4E2    | Wrong answer fill (destructive hue)      |

Quiz states derive from existing hues — teal for selected, `success` for correct, `destructive` for incorrect — so no parallel palette is introduced.

Dark theme inverts lightness (bg `0.155 0.022 255`, card `0.2 0.024 255`, primary `0.72 0.13 170`) keeping hue stable.

## Typography

- **Display: Space Grotesk** — geometric grotesque for H1–H4, prices, nav wordmark; heavy weights, tight tracking.
- **Body: Figtree** — clean humanist sans for paragraphs, labels, forms; bilingual-safe for Vietnamese diacritics.
- **Mono: Geist Mono** — number chips, price figures, step indices, answer letters, question counter, score figures.
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, eyebrow `text-xs font-semibold uppercase tracking-[0.18em]`, body `text-base md:text-lg leading-relaxed`, price `font-display text-4xl font-bold`, score `score-figure text-6xl md:text-7xl`.

## Elevation & Depth

Three-tier: flat mint panels for section ground, white cards with `border-border` + `shadow-card`, and `shadow-elevated` reserved for hover/featured pricing — depth comes from layered surfaces, never heavy drop shadows.

## Structural Zones

| Zone    | Background        | Border          | Notes                                                        |
| ------- | ----------------- | --------------- | ------------------------------------------------------------ |
| Header  | `bg-card/85` blur | `border-b`      | Sticky, translucent, logo returns to top; language switcher  |
| Content | `bg-background`   | —               | Alternates with `surface-mint` panels and `bg-muted/30` bands |
| Footer  | `bg-muted/40`     | `border-t`      | Muted ground, teal link hover                                |
| Notice  | `surface-cream`   | `cream-border`  | Pill/bar for "prices not final" messaging                    |

## Spacing & Rhythm

Sections `py-16 md:py-24`; container `px-4 md:px-8` with `max-w-7xl`; card padding `p-6 md:p-8`; grid gaps `gap-6 md:gap-8`; micro-spacing in 4/8/12px steps.

## Component Patterns

- **Buttons**: primary = solid teal `bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold shadow-card`, hover deepens to `primary-deep` + lift; secondary = white `border-border` with teal text.
- **Cards**: `bg-card rounded-2xl border border-border shadow-card p-6`, `wobble-hover`/`tilt-hover` on interactive cards.
- **Section panel**: `surface-mint rounded-3xl p-8 md:p-12` for large grouped content.
- **Number chip**: `bg-mint-deep text-primary font-mono rounded-lg w-9 h-9 grid place-items-center text-sm font-bold` (pale mint + teal text).
- **Tag pill**: outlined `border border-mint-deep bg-mint text-mint-foreground rounded-full px-3 py-1 text-xs font-medium`.
- **Notice badge**: `surface-cream rounded-full px-4 py-2 text-sm font-medium` for "not final" notices.
- **Feature bullet**: teal check icon (`text-success`) + `text-muted-foreground` label.
- **Pricing card**: numbered header, uppercase eyebrow category label, `font-display` price, checklist, featured tier gets `shadow-elevated` + `border-primary/40`.
- **Team/avatar card**: circular `bg-mint` monogram, navy name, teal role label.
- **Quiz question card**: `bg-card rounded-2xl border border-border shadow-card p-6 md:p-8` with eyebrow question index, `font-display` prompt, and a stacked `flex flex-col gap-3` answer list.
- **Answer option** (`.answer-option`): full-width flex row, 1.5px `answer-border`, `answer-surface`, mono letter marker in a rounded square. States: hover lifts 1px with teal-tinted `answer-hover`; `aria-pressed="true"`/`data-state="selected"` → `answer-selected` fill + teal border; `data-state="correct"` → `answer-correct`; `data-state="incorrect"` → `answer-incorrect`. Geometry never changes between states — only colour, so the card cannot reflow.
- **Progress rail**: `.progress-rail` track with `.progress-rail-fill` gradient bar (animated width) plus five `.progress-step` dots — `data-state="done" | "current"` — for the N-of-5 sequence, with a mono `N / 5` counter.
- **Unanswered nudge**: `.quiz-nudge` cream bar (reuses `--cream`/`--cream-border`) prompting for skipped questions before submit.
- **Result summary panel**: `surface-mint rounded-3xl p-8 md:p-12` holding a `.score-medallion` — circular, radial-lit, `--score-ring` border — with a `font-display` `.score-figure` (tabular numerals) and a mono `%`/points caption.
- **Per-aspect score bar**: `.aspect-track` + `.aspect-fill` gradient bar with aspect label, mono numeric value, and low/high end labels; reuse for both the result screen and the evidence card.
- **Student name chip**: `.student-chip` mint pill with a `.student-chip-monogram` teal initials disc and `.student-chip-name` (ellipsised) — marks the signed-in author on the result screen and evidence card.
- **Evidence card (auto-generated)**: the same result format as the result panel — name chip, trial name, completion percent, overall score, per-aspect bars — replacing any manual self-rating.

## Motion

- **Cursor glow**: fixed radial teal bloom tracking `--cursor-x/--cursor-y` (JS-updated), 0.5s opacity fade, `cursor-glow` utility.
- **Hover wobble/tilt**: `wobble-hover` (0.9s keyframe oscillation) on images/avatars, `tilt-hover` (perspective rotateX/rotateY) on cards; transform-only.
- **Scroll reveal**: `reveal` → `is-visible` fade-up 24px, 0.7s ease, staggered via IntersectionObserver.
- **Quiz state change**: answer colour/border 0.22s ease, hover 1px lift; progress rail width 0.45s, step dot scale 0.3s.
- **Score reveal**: `animate-score-pop` (0.6s overshoot settle) on the medallion, aspect bars grow via width 0.6s.
- **Ambient**: `animate-float-soft` (5s) for decorative badges/orbs.
- **Reduced motion**: glow hidden, wobble/tilt/answer-lift/step-scale disabled, reveals shown statically, all animation/transition durations collapsed via `prefers-reduced-motion`.

## Constraints

- Tokens only — no raw hex/rgb in components, no arbitrary `bg-[#...]` classes.
- Teal accent used sparingly for highlights, CTAs, and active states; mint carries the bulk of surface area.
- Light theme is primary; dark theme is a coherent tuned counterpart (not a naive inversion).
- Motion is transform/opacity only and always has a reduced-motion fallback.
- Bilingual EN/VI copy must fit the same layout without truncation.
- Answer options keep identical geometry across all five states — colour alone signals state, so nothing reflows.
- Test results are always auto-generated; no student self-rating control appears in the design.

## Signature Detail

The **cursor-following teal glow over mint panels** — the page quietly lights up wherever the pointer moves, making a static reference layout feel alive. In the test flow it pays off twice: the score medallion is a radial-lit mint disc that pops in on submit, so the result reads as a reward rather than a form readout.
