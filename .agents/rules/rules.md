---
trigger: always_on
---

# IF Database — Workspace Rules

## Project Overview

This is a **Next.js 16** (App Router) RPG monster bestiary/database application called **IF Database**. It uses **MongoDB** via **Mongoose**, **SCSS** for styling, and a custom **CSS Handles** pattern for class name management. The UI language is **Brazilian Portuguese (pt-BR)**.

---

## Technology Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Database:** MongoDB via Mongoose 9
- **Styling:** SCSS (Sass) — no CSS-in-JS, no Tailwind, no CSS Modules for components
- **Font strategy:** Cinzel (serif, headings), Consolas (monospace), Segoe UI/Roboto (body)
- **Linting:** ESLint (flat config + next/core-web-vitals + prettier)
- **Formatting:** Prettier (single quotes, trailing commas `es5`, 2-space tabs, 80 print width, semicolons)
- **Commits:** Conventional Commits via commitlint (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`)
- **React Compiler:** Enabled (`reactCompiler: true` in `next.config.ts`)

---

## Directory Structure

```
app/                    → Next.js App Router pages and layouts
  globals.css           → Minimal global CSS reset
  layout.tsx            → Root layout (RootLayout)
  page.tsx              → Home page
  monsters/             → Monsters feature route group
    page.tsx            → Monsters list page (server component)
    edit/[slug]/page.tsx → Monster edit page (server component)

components/             → Reusable React components (PascalCase dirs)
  ComponentName/
    index.tsx           → Component implementation
    handles.ts          → CSS Handles array (readonly tuple)
    sections/           → Optional: sub-components of a compound component

hooks/                  → Custom React hooks
  useCssHandles.ts      → CSS Handles hook + applyModifiers utility

styles/                 → SCSS design system
  _globals.scss         → Barrel file that @forward's all config partials
  config/
    _colors.scss        → Color tokens ($primary-*, $neutral-*, $success, $warning, $error)
    _typography.scss    → Typography mixins (mono-*, cinzel-*, main-*)
    _flex.scss          → Flexbox layout mixins (flex-center, flex-col-start, etc.)
    _spacing.scss       → Spacing tokens ($spacing-1 to $spacing-20) and radius tokens
    _mixins.scss        → Responsive breakpoints (desktop, mobile) and theme mixins (dark, light)
  components/           → Component-level SCSS files (camelCase filenames)

db/                     → Database models and schemas
  monsters/
    monsters.d.ts       → TypeScript interfaces (IMonster, IStats, ICombat, etc.)
    schema.ts           → Mongoose Schema definition
    monsters.ts         → Mongoose Model (singleton pattern)

services/               → Business logic / data access layer
  monster.service.ts    → CRUD functions for monsters

lib/                    → Utility modules
  db.ts                 → MongoDB connection with global caching

scripts/                → CLI scripts
  initializeDb.ts       → Database seeding script
  monster-data.ts       → Seed data
```

---

## Component Architecture

### The Hierarchy Pattern: Page → Feature → Component

We strictly separate our user interface elements into three distinct layers:

1. **Pages (`app/` route pages)**
   - Always server-side components (no `'use client'`).
   - Establish database connection: `await connectDB()`.
   - Fetch raw data from Mongoose services and serialize it: `JSON.parse(JSON.stringify(data))`.
   - Render and orchestrate **Features** (e.g., `<MonsterGrid initialData={monsters} />`).
   - **Rule:** Pages do not define CSS layouts or render raw styled HTML. They act only as data providers and feature orchestrators.

2. **Features (`components/FeatureName/`)**
   - High-level interface blocks (e.g., `MonsterGrid`, `MonsterData`).
   - Can be client components (`'use client'`) to manage interactive states, events, and UI logic.
   - Coordinate layout structure using SCSS handles.
   - **Rule:** They hold all UI/business logic and pass data down to simple child components.

3. **Components (`components/ComponentName/`)**
   - Simple presentational units (e.g., `StatsBlock`, `CombatInfo`, `DropsBlock`).
   - **Rule:** They must be stateless or have minimal UI state (e.g., hover/toggle). They receive data entirely via `props` and render it. No business logic, no data fetching, no global state.

### Structure Pattern

Every Feature and Component follows this structure:

```
components/ComponentName/
  index.tsx             → Implementation code
  handles.ts            → CSS Handles definition
```

### CSS Handles Pattern

This project uses a custom `useCssHandles` hook (inspired by VTEX IO) instead of CSS Modules. **Always follow this pattern:**

1. **`handles.ts`** — Export a `readonly` tuple of string handles as `default`:

   ```ts
   const ComponentNameHandles = ['container', 'title', 'content'] as const;

   export default ComponentNameHandles;
   ```

2. **`index.tsx`** — Import the hook and handles, use `handles.xxx` for classNames:

   ```tsx
   import { useCssHandles } from '@/hooks/useCssHandles';
   import ComponentNameHandles from './handles';

   const ComponentName = () => {
     const handles = useCssHandles(ComponentNameHandles);
     return <div className={handles.container}>...</div>;
   };

   export default ComponentName;
   ```

3. **BEM modifiers** — Use `applyModifiers(handle, modifier)` or manual template literals for state:

   ```tsx
   className={`${handles.drawer}${isOpen ? ` ${handles.drawer}--open` : ''}`}
   ```

4. **SCSS** — The corresponding SCSS file in `styles/components/` uses the handle names directly as class selectors:
   ```scss
   .container { ... }
   .title { ... }
   ```

### Component Conventions

- Use **`const` arrow functions** with `export default ComponentName`
- Props interface named `IProps`
- Types imported with `import type` or `import { type X }`
- Client components must have `'use client'` directive at the top
- Server components (pages) are `async function` with `export default`
- Compound components use a `sections/` subdirectory (e.g., `CreatureDrawer/sections/`)
- Inter-component communication via `window.dispatchEvent(new CustomEvent(...))` and `window.addEventListener(...)` for drawer open/close events

---

## Styling Rules

### SCSS Architecture

- **Never use CSS Modules (`.module.scss`) for components** — use the CSS Handles pattern with global SCSS files in `styles/components/`
- **Import the design system** in each component SCSS file with: `@use '../../styles/globals' as *;` (or appropriate relative path)
- Component SCSS files in `styles/components/` use **camelCase** filenames (e.g., `monsterCard.scss`, `creatureDrawer.scss`)
- Component TSX files import SCSS directly: `import '@/styles/components/monsterCard.scss';`

### Color Palette

The project uses a **dark-first** design with light mode overrides:

- **Primary (gold):** `$primary-100` (#9c841c) → `$primary-400` (#463900)
- **Neutral dark:** `$neutral-100` (#0f0f0f) → `$neutral-1000` (#808080)
- **Neutral light:** `$neutral-2000` (#fcfcfc) → `$neutral-2900` (#e1dec8) — warm parchment tones
- **Semantic:** `$success` (#4caf50), `$warning` (#ff9800), `$error` (#f44336)

### Theme Strategy

- **Dark mode is the default** — styles are written for dark mode first
- Light mode uses `@include light { ... }` overrides (from `_mixins.scss`)
- This maps to `@media (prefers-color-scheme: light)`

### Responsive Design

- **Desktop:** `@include desktop { ... }` → `min-width: 750px`
- **Mobile:** `@include mobile { ... }` → `max-width: 749px`
- Mobile-first is NOT used — desktop is the default, mobile has overrides

### Typography Mixins

Use the typography mixins from `_typography.scss`. Signature: `@mixin font-size($color, $weight, $line-height, $spacing, $align)`:

| Family                 | Mixin prefix | Use case                                |
| ---------------------- | ------------ | --------------------------------------- |
| Cinzel (serif)         | `cinzel-*`   | Headings, monster names, section titles |
| Consolas (monospace)   | `mono-*`     | Code, technical data                    |
| Segoe UI/Roboto (sans) | `main-*`     | Body text, labels, descriptions         |

Sizes: `xs` (12px), `sm` (14px), `md` (16px), `lg` (18px), `xl` (20px), `2xl` (24px), `3xl` (32px)

### Spacing Tokens

Use `$spacing-1` (0.25rem) through `$spacing-20` (5rem) in increments of 0.25rem. Border radius: `$radius-sm` through `$radius-full`.

### Layout Mixins

Use flex mixins from `_flex.scss`: `flex-center`, `flex-col-start`, `flex-col-center`, `flex-row-center`, `flex-row-between`, etc.

---

## Database Layer

### Connection

- Use `connectDB()` from `@/lib/db` — it caches the connection globally
- Always call `await connectDB()` in server components / server actions before DB operations

### Models

- Mongoose models use the singleton pattern: `models.Monster || model<IMonster>('Monster', MonsterSchema)`
- Type definitions in `.d.ts` files with `interface` declarations
- All sub-interfaces are exported: `IStats`, `ICombat`, `IAbilities`, `IActions`, `ISenses`, `IDrops`
- Main interface extends `Document`: `export default interface IMonster extends Document { ... }`

### Services

- Services are plain `async function` exports (not classes)
- Located in `services/` directory
- Named as `entityName.service.ts`
- Standard CRUD pattern: `create`, `getAll`, `getBySlug`, `update`, `delete`

---

## Page Patterns

### Server Components (Pages)

```tsx
import { connectDB } from '@/lib/db';
import { getAllMonsters } from '@/services/monster.service';
import { notFound } from 'next/navigation';

export default async function PageName() {
  await connectDB();
  const data = await getData();
  if (!data) notFound();

  // Serialize Mongoose documents for client components
  const plainData = JSON.parse(JSON.stringify(data));

  return <ClientComponent data={plainData} />;
}
```

### Dynamic Routes

- Params are `Promise<{ slug: string }>` (Next.js 16 pattern)
- Await params: `const { slug } = await params;`

---

## Import Conventions

- Use `@/` path alias for project-root imports (configured in `tsconfig.json`)
- Relative imports only for sibling files within the same component folder
- Services use relative imports to `../db/` (not `@/db/`)
- Import order: React/Next → types → hooks → components → handles → styles

---

## Language

- All UI text is in **Brazilian Portuguese (pt-BR)**
- Comments and variable names are in **English**
- Labels for RPG stats use Portuguese abbreviations (FOR, DES, CON, INT, SAB, CAR)
