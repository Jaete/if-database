# IF Database

## Project Overview

**IF Database** ("Bestiário de Terralém") is a Next.js 16 (App Router) RPG creature/citizen bestiary application. It uses **MongoDB** via **Mongoose**, **SCSS** for styling, and a custom **CSS Handles** naming convention for class names. The UI language is **Brazilian Portuguese (pt-BR)**.

`.forum-frontend/` is a separate, unrelated application living in this same repo — out of scope for everything below.

`reference.md` at the repo root is a borrowed convention doc from an unrelated VTEX/FastStore project. It was used as loose inspiration for the atomic-design vocabulary below, not as a literal spec — this project has no CMS, no CSS Modules, and no GraphQL layer, so the FastStore-specific parts of that doc do not apply here.

---

## Technology Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Database:** MongoDB via Mongoose 9
- **Styling:** SCSS (Sass) — no CSS-in-JS, no Tailwind, no CSS Modules
- **Font strategy:** Cinzel (serif, headings), Consolas (monospace), Segoe UI/Roboto (body). `next/font` also loads Geist/Geist Mono in `app/layout.tsx`, but no typography mixin currently consumes those variables — the mixins hardcode their own `font-family` stacks.
- **Linting:** ESLint (flat config + next/core-web-vitals + prettier)
- **Formatting:** Prettier (single quotes, trailing commas `es5`, 2-space tabs, 80 print width, semicolons)
- **Commits:** Conventional Commits via commitlint (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`)
- **React Compiler:** Enabled (`reactCompiler: true` in `next.config.ts`)

---

## Directory Structure

```
app/                    → Next.js App Router pages, layouts, API routes
  layout.tsx            → Root layout — wraps everything in AuthProvider > AuthGate (see Client Boundary below)
  globals.css           → Minimal global CSS reset
  api/                  → Route handlers (auth, citizens, monsters, evolution-trees, markdown parsing)
  citizens/, monsters/  → Route segments (page.tsx + a *PageClient.tsx orchestrator)
  context/              → React Context providers (AuthContext, CitizensContext, MonstersContext, TabContext)

components/             → All UI components (PascalCase dirs) — see Component Architecture below

hooks/
  useCssHandles.ts       → CSS Handles hook + applyModifiers utility

styles/
  _globals.scss         → Barrel file that @forward's all config partials + global resets
  config/                → Design tokens (see Design Tokens below)
  components/            → Per-component global SCSS (camelCase filenames)

db/                     → Mongoose models, schemas, and TypeScript interfaces, one folder per entity
  <entity>/
    <entity>.d.ts         → TypeScript interfaces
    schema.ts             → Mongoose Schema
    <entity>.ts           → Mongoose Model (singleton pattern)

services/               → CRUD business logic (`entityName.service.ts`), plain async function exports
lib/                    → Utility modules (db.ts connection cache, cors.ts, time.ts)
scripts/                → CLI/seed scripts (run via tsx)
```

There is also `.agents/rules/rules.md` and `.agents/workflows/*.md` — pre-existing Windsurf-style rule files. Claude Code does not read these; this `CLAUDE.md` is the canonical doc for Claude Code. They've been left in place in case another tool in the workflow still consumes them, but treat this file as authoritative if the two ever disagree.

---

## Component Architecture — Atomic Design

Components follow **atomic design** vocabulary (atom / molecule / organism). This replaces the older "Feature vs Component" 2-tier framing that used to live in `.agents/rules/rules.md`. Folders stay **flat** — there is no physical `atoms/`, `molecules/`, or `organisms/ directory. The atomic level is a classification that determines composition rules and whether a component gets a companion hook, not a folder location.

Classification is **behavioral, not folder-based**: a component earns "organism" by _owning_ state/effects/data-orchestration, not merely by being visually complex or living somewhere that used to be called a "Feature".

- **atom** — indivisible, zero dependency on other project components. None exist yet in this codebase (everything so far is at least a molecule) — this tier is groundwork for future primitives like `Button`, `Badge`, `Icon`.
- **molecule** — pure props-in/JSX-out, at most _minimal_ local UI state (hover, an open/closed toggle, image-loaded flag). Examples: `StatsBlock`, `CombatInfo`, `DropsBlock`, `SensesBlock`, `AbilitiesBlock`, `CreatureCard`, `CitizenCard`, `TabBar`, `ContextMenu`, `Modal` (the base), `AlertModal`, `ConfirmModal`, `LevelProgressionModal`, `MainMenu`.
- **organism** — owns real state/effects/async orchestration, composes molecules and/or atoms. Examples: `CreatureGrid`, `CitizenGrid`, `CreatureData`, `CreatureDrawer`, `CreatureEditForm`, `CitizenEditForm`, `LoginModal`, `EvolutionTreeModal`.
- **Page** (`app/*/page.tsx`) sits above organisms — always a server component, fetches data, orchestrates organisms. This is atomic design's own top rung; no renaming needed here.

### Structure pattern

Every component folder:

```
components/ComponentName/
  index.tsx             → Implementation — presentation, always
  handles.ts            → CSS Handles definition
  useComponentName.ts    → * Optional: non-trivial state/effects/handlers extracted out (new convention, see below)
```

`*` = only when needed. Don't create a hook file for a component with no real logic.

### Domain nesting (sub-components exclusive to one organism)

There is **no `sections/` wrapper folder** for this. When a sub-component is genuinely specific to one organism's domain and not reusable elsewhere, nest it as its own ordinary component folder one level deeper: `components/<Organism>/<SubComponent>/` with the same `index.tsx` + `handles.ts` (+ optional hook) inside, name with the domain prefix dropped.

Nesting is **only** justified when the piece is truly exclusive. The litmus test: if it's imported from outside its parent folder, or contains zero parent-specific logic, it isn't exclusive — it's a generic molecule and belongs flat at top-level `components/<Name>/` instead.

This codebase currently has counter-examples left over from the old `sections/` convention that fail this test and should be promoted (tracked for the `/refactor-component` skill, not fixed automatically):

- `CreatureDrawer/sections/{DrawerContent,DrawerHeader,DrawerController}` — cross-imported by `CitizenGrid`, contains zero Creature-specific logic. Belongs at top-level `components/Drawer/`.
- `CreatureEditForm/sections/FormField.tsx` — cross-imported by `CitizenEditForm`. Belongs at top-level `components/FormField/`.

### Component conventions

- `const ComponentName = (props: IProps) => {...}; export default ComponentName;` — function components only, never classes, never `React.FC`.
- Props interface is **always** named `IProps` (not `ComponentNameProps`), defined inline in `index.tsx` (no separate `.types.ts` split file).
- Types imported with `import type` or `import { type X }`.
- Declare `'use client'` explicitly on any component using hooks, refs, or browser APIs — **even though** almost the entire tree already runs client-side (see Client Boundary below). Don't rely on the inherited boundary for new code; several existing components already do and it's a fragility, not a pattern to copy.
- Inter-component communication uses `window.dispatchEvent(new CustomEvent(...))` / `window.addEventListener(...)` (e.g. drawer open/close events) rather than prop-drilling or a global store.

**Import order:** React/Next → types → hooks → child components → handles → styles.

### Icons

Extract inline `<svg>` into `components/Icons/<Name>Icon.tsx`, typed `SVGProps<SVGSVGElement>`, using `stroke="currentColor"`/`fill="currentColor"` to inherit color, `aria-hidden="true"` by default, spreading `{...props}`. Add a barrel `components/Icons/index.ts` exporting each one. Import icons directly from `../Icons`, not through `components/index`.

This is a **new** convention — there is currently no `components/Icons/` folder, and ~15-20 inline SVGs exist across the codebase (several byte-for-byte duplicated, e.g. the eye/pencil/trash icons in both `CreatureCard` and `CitizenCard`). Apply this to new components going forward; migrating the existing inline ones is `/refactor-component` work, not automatic.

---

## CSS Handles Pattern

This project uses a custom `useCssHandles` hook (`hooks/useCssHandles.ts`), inspired by VTEX IO's CSS Handles but **not equivalent to it**: it is a no-op identity mapper — `useCssHandles(['container'])` returns `{ container: 'container' }`. There is **no runtime scoping, hashing, or isolation**. Every class name is a plain global string once SCSS is bundled.

This means collision-avoidance is entirely manual discipline, and it already leaks in places (e.g. a citizen-related component reusing `creature`-prefixed handle names because it was copy-pasted). Pick handle names that won't collide with another component's, and never assume two components can safely share a generic handle name like `container` across different stylesheets without checking.

1. **`handles.ts`** — a `readonly` tuple of camelCase strings, exported default, named `<ComponentName>Handles`:

   ```ts
   const ComponentNameHandles = ['container', 'title', 'content'] as const;
   export default ComponentNameHandles;
   ```

2. **`index.tsx`**:

   ```tsx
   import { useCssHandles } from '@/hooks/useCssHandles';
   import ComponentNameHandles from './handles';

   const ComponentName = () => {
     const handles = useCssHandles(ComponentNameHandles);
     return <div className={handles.container}>...</div>;
   };

   export default ComponentName;
   ```

3. **BEM modifiers** — `applyModifiers(handle, modifier)` or a manual template literal:

   ```tsx
   className={`${handles.drawer}${isOpen ? ` ${handles.drawer}--open` : ''}`}
   ```

   Never append a raw literal class name alongside a handle (e.g. `` `${handles.creatureData} citizenData` ``) — if you need an extra class, add it as a proper handle instead.

4. **SCSS** — `styles/components/<name>.scss` uses the handle names directly as selectors (`.container { ... }`).

---

## Styling Rules

### SCSS Architecture

- **Never use CSS Modules (`.module.scss`)** — use the CSS Handles convention with global SCSS files in `styles/components/`.
- Every component SCSS file starts with `@use '../../styles/globals' as *;` (adjust relative depth for nested components).
- Filenames in `styles/components/` are **camelCase** (e.g. `creatureCard.scss`).
- The owning component imports its SCSS directly: `import '@/styles/components/creatureCard.scss';`. If a sub-component shares styles with its parent (rather than owning distinct ones), it does not add its own import — the parent's stylesheet covers it.
- **Never** hardcode hex colors, raw px font-sizes, or raw px spacing/margins — always go through the tokens/mixins below.

### Design Tokens

**Always prefer a semantic token over a primitive, and a primitive over a hardcoded value.** The semantic layer below was added specifically because, before it existed, almost every component hardcoded `#ffffff` for text and ad hoc grays for borders — there was no dark-mode-appropriate "primary text" color in the palette at all (the dark neutral ramp topped out at `$neutral-1000` `#808080`, a muted tone, not a readable primary-text tone). If you're about to write a hex value or reach for a raw `$neutral-*`/`$gold-*` step for text or a border, check the semantic list first.

**Colors** (`styles/config/_colors.scss`):

```scss
// Primitives — the brand palette. Two distinct gold scales exist on purpose:
// $primary-* is the functional/interactive gold (buttons, links, focus rings),
// $gold-* is the decorative/ornamental gold used only by the "premium" mixins
// below (borders, glows, gradient text). Don't mix the two roles.
$primary-100 (#9c841c) … $primary-400 (#463900)     // functional gold, dark → darker
$gold-100 (#d4a843) … $gold-600 (#5c4204)            // decorative/ornamental gold
$neutral-100 (#0a0a0a) … $neutral-1000 (#808080)     // dark-mode neutrals
$neutral-2000 (#f5f5f5) … $neutral-2900 (#d2c8b4)    // light-mode / parchment neutrals
$success (#4caf50) / $info (#2196f3) / $warning (#ff9800) / $error (#f44336)

// Semantic — surfaces (an elevation ladder; pair each step with the matching
// `elevation($level)` mixin of the same rank so shadow depth and surface
// brightness always move together):
$overlay                                             // elevation 0 — dim/backdrop
$surface / $surface-raised / $surface-elevated / $surface-float   // elevation 1-4
$accent-overlay / $accent-overlay-hover
$glow-gold / $glow-gold-strong / $glow-primary

// Semantic — text & borders (dark mode is the default; "-inverse" variants
// are for use inside `@include light { }` overrides):
$color-bg                    // page background
$color-text                  // primary text on dark surfaces (off-white, not pure #fff)
$color-text-muted            // secondary text
$color-text-subtle           // least-emphasis text (captions, disabled)
$color-border / $color-border-strong

$color-bg-inverse / $color-text-inverse / $color-text-muted-inverse / $color-border-inverse

// Semantic — state tints, for alert/badge backgrounds & borders (same
// tinted-overlay pattern as $accent-overlay, applied to each state color):
$success-bg / $success-border
$warning-bg / $warning-border
$error-bg / $error-border
$info-bg / $info-border
```

### Theming (CSS custom properties)

`styles/_globals.scss` generates a small set of CSS custom properties (`--color-bg`, `--color-surface`, `--color-text`, `--color-border`, `--color-primary`) at `:root`, derived from the `$color-*` Sass tokens above, with a `@include light { :root { ... } }` block re-assigning them to the light-mode values. This exists **only** so plain `.css` files that can't `@use` Sass (like `app/globals.css`) have something real to reference via `var(--color-text)` etc. — it fixed a previously-dead `var(--neutral-100)` reference that resolved to nothing.

Component `.scss` files should keep using the `$color-*` Sass variables directly (with `@include light { }` overrides), exactly as documented under CSS Handles / Styling Rules below — don't switch component styling to `var(--color-*)` just because the custom properties exist; the Sass tokens are still the source of truth and the custom-property block is generated from them, not the other way around.

**Typography** (`styles/config/_typography.scss`) — three font families, each with the same size scale and mixin signature `@mixin family-size($color, $weight, $line-height: 1.5, $spacing: 0, $align: left)`:

| Family                 | Mixin prefix | Use case                                         |
| ---------------------- | ------------ | ------------------------------------------------ |
| Cinzel (serif)         | `cinzel-*`   | Headings, creature/citizen names, section titles |
| Consolas (monospace)   | `mono-*`     | Code, technical/stat data                        |
| Segoe UI/Roboto (sans) | `main-*`     | Body text, labels, descriptions                  |

Sizes: `xs`(12px) `sm`(14px) `md`(16px) `lg`(18px) `xl`(20px) `2xl`(24px) `3xl`(32px).

Extended mixins: `caption($color, $weight)` (10px, uppercase, letter-spacing) and `stat-value($color, $weight: bold)` (22px, monospace, centered — for RPG stat displays).

**Font-weight tokens:** `$font-weight-light`(300) `$font-weight-regular`(400) `$font-weight-medium`(500) `$font-weight-semibold`(600) `$font-weight-bold`(700) — pass one of these as the `$weight` argument instead of a raw number or a string like `'bold'`, so weight usage stays consistent across call sites.

**Spacing & radius** (`styles/config/_spacing.scss`): `$spacing-1` (0.25rem) through `$spacing-20` (5rem), 0.25rem increments. `$radius-sm` / `$radius-md` / `$radius-lg` / `$radius-xl` / `$radius-full`.

**Flex layout** (`styles/config/_flex.scss`): `flex-center`, `flex-col-center`, `flex-col-start`, `flex-col-end`, `flex-row-center`, `flex-row-start`, `flex-row-end`, `flex-col-between`, `flex-row-between`.

**Responsive & theme** (`styles/config/_mixins.scss`):

- `@include desktop { }` → `min-width: 750px` (the default; no media query needed for desktop styles themselves)
- `@include mobile { }` → `max-width: 749px` (override)
- `@include dark { }` → `prefers-color-scheme: dark`
- `@include light { }` → `prefers-color-scheme: light` (override — **dark is the default**, write dark styles unwrapped and put light overrides in `@include light`)

**"Premium" decorative mixins** (`styles/config/_mixins.scss` — previously undocumented, already used across the codebase, use these instead of hand-rolling gold/glow/elevation effects):

```scss
@include gold-border($width: 1px, $opacity: 0.4)
  // gradient gold border via ::before mask
  @include gold-decorative-line($width: 48px, $height: 2px)
  // gold underline via ::after
  @include gold-gradient-text // gold gradient text-fill
  @include premium-input-focus // gold focus ring for inputs
  @include gold-glow($intensity: 1) // gold box-shadow glow
  @include premium-card($padding: $spacing-5)
  // card surface + border + hover glow
  @include corner-ornament($size: 8px, $color: $gold-100, $opacity: 0.3)
  // ◆ corner decoration via ::before
  @include elevation($level: 0-4) // box-shadow elevation scale
  @include noise-texture($opacity: 0.03); // fixed noise overlay via ::after
```

**Accessibility mixin** (also in `_mixins.scss`, not decorative — use on any custom interactive element): `@include focus-ring($color: $primary-100)` sets a `:focus-visible` outline (keyboard nav only, never shows on mouse click). Prefer this over `premium-input-focus` for anything that isn't a text input.

**Animation** (`styles/config/_animations.scss`): keyframes `fadeIn`/`fadeOut`/`slideUp`/`slideDown`/`scaleIn`/`shimmer`/`spin`, plus mixins `fade-in($duration)`, `slide-up($duration)`, `scale-in($duration)`.

---

## Client Boundary

`app/layout.tsx` (a server component) wraps the entire app: `<AuthProvider><AuthGate>{children}</AuthGate></AuthProvider>`. `AuthGate` (`components/AuthGate.tsx`) is a `'use client'` component — meaning the very first client boundary in the tree sits right at the root, and almost everything below it is already part of the client bundle.

This is why several existing components (`Modal`, `CreatureData`, `CreatureCard`, `CitizenCard`, `CreatureEditForm`) use hooks without declaring their own `'use client'` and still work — they inherit the boundary. **Don't rely on this for new components** — declare `'use client'` explicitly wherever hooks/browser APIs are used, so components stay correct even if the boundary structure ever changes.

---

## Database Layer

- Use `connectDB()` from `@/lib/db` — caches the connection globally. Always `await connectDB()` before Mongoose operations in server components/route handlers.
- Models use the singleton pattern: `models.Creature || model<ICreature>('Creature', CreatureSchema)`.
- Type definitions live in `.d.ts` files; sub-interfaces are exported individually (`IStats`, `ICombat`, `IAbilities`, `IActions`, `ISenses`, `IDrops`, etc.); the main interface extends `Document`.
- Services (`services/*.service.ts`) are plain `async function` exports (not classes), standard CRUD shape: `create`, `getAll`, `getBySlug`, `update`, `delete`.
- Note: `db/monsters/` (a live Mongoose model) and `db/creatures/creatures.d.ts` (a parallel type-only file) both exist and get reconciled in places like `CreatureData` via `'in'`-narrowing casts across `ICreature`/`IMonster`. Understand which one a given piece of code means before editing it.

---

## Page Patterns

```tsx
import { connectDB } from '@/lib/db';
import { getSomeData } from '@/services/some.service';
import { notFound } from 'next/navigation';
import SomeOrganism from '@/components/SomeOrganism';

export default async function PageName({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const { slug } = await params; // Next.js 16: params is a Promise
  await connectDB();
  const rawData = await getSomeData(slug);
  if (!rawData) notFound();

  const serializedData = JSON.parse(JSON.stringify(rawData)); // strip Mongoose document wrapper
  return (
    <main>
      <SomeOrganism initialData={serializedData} />
    </main>
  );
}
```

- Pages are always server components (no `'use client'`), never import SCSS directly, and keep HTML to minimal semantic wrappers (`<main>`, `<section>`) — all real layout/logic lives in the organisms they render.
- `generateMetadata` follows the same await-params-then-connectDB shape when SEO is needed.

---

## Import Conventions

- `@/*` path alias for project-root imports (see `tsconfig.json`).
- Relative imports only within the same component folder (or to a sibling/parent in a nested domain component).
- Services use relative imports to `../db/`, not `@/db/`.

---

## Known Naming Quirks

Small, verified leftovers — useful context before touching these files, not yet fixed:

- `components/CreatureCard/handles.ts` uses a legacy `mc*` handle prefix, left over from before the component was renamed from "MonsterCard".
- `components/CreatureInfo/index.tsx` internally names its component `CombatInfo` (a copy-paste leftover from the actual `CombatInfo` component) — verify actual usage before assuming it's dead code.

---

## Language

- All UI text is in **Brazilian Portuguese (pt-BR)**.
- Comments and identifiers are in **English**.
- RPG stat labels use Portuguese abbreviations: FOR, DES, CON, INT, SAB, CAR.

---

## Related Skills

- `/new-component` — scaffolds a new atom/molecule/organism following everything above.
- `/refactor-component` — migrates an existing component to this pattern. Manual-invocation only (never auto-triggers); run it deliberately, one component at a time.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
