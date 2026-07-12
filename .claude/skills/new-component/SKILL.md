---
name: new-component
description: Use when creating a new atom, molecule, or organism component under components/ in the IF Database project, following atomic design and the project's CSS Handles convention. Trigger on requests like "create a new component", "add a new atom/molecule/organism", "scaffold a component for X".
argument-hint: '[ComponentName] [atom|molecule|organism]'
arguments: [name, level]
---

# new-component

Creates a new component in IF Database following atomic design and this project's CSS Handles pattern. `CLAUDE.md` at the repo root documents the full architecture this skill implements — read it first if you haven't already this session.

## Usage

```
/new-component <ComponentName> [atom|molecule|organism]
```

Examples:

- `/new-component Button atom`
- `/new-component StatBadge molecule`
- `/new-component QuestLog organism`

`$name` / `$1` is the component name and `$level` / `$2` is the atomic level. If named substitution didn't populate (both may also arrive as one `$ARGUMENTS` string), parse `$ARGUMENTS` positionally instead.

## Step 1 — Determine the atomic level

If the level wasn't given, ask the user. Use this **behavioral** rule, not a folder or visual-complexity guess:

| Level    | Rule                                                                                                                                       | Existing examples                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| atom     | Indivisible, zero dependency on other project components                                                                                   | _(none yet — the first one sets precedent, e.g. Button/Badge/Icon)_ |
| molecule | Composes atoms/other molecules; pure props-in/JSX-out; at most minimal local UI state (hover, an open/closed toggle, an image-loaded flag) | StatsBlock, CombatInfo, CreatureCard, TabBar, Modal                 |
| organism | Owns real state/effects/async orchestration; composes molecules/atoms                                                                      | CreatureGrid, CreatureDrawer, CreatureEditForm, LoginModal          |

A component with a lot of JSX but no owned state is still a molecule. A component with `useState`/`useEffect`/data fetching is an organism even if visually simple.

## Step 2 — Determine location

Default: flat, top-level `components/<ComponentName>/`.

Only nest under a parent (`components/<ParentOrganism>/<ComponentName>/`) if this component is genuinely exclusive to that organism's domain and will never be reused elsewhere. Apply the litmus test before nesting:

- Would anything outside `<ParentOrganism>/` ever plausibly import this? → flat, not nested.
- Does it contain zero logic specific to the parent's domain (i.e. it would work identically for any other organism)? → flat, not nested.

If nested, drop the parent's name as a prefix from the component's own name — the folder path already carries that context (e.g. `CreatureEditForm/StatRow/`, not `CreatureEditForm/CreatureStatRow/`). There is no `sections/` wrapper folder — the sub-component folder sits directly inside the parent's own folder.

When in doubt, default to flat top-level: flat is easy to nest later, but wrongly-nested components accumulate silently. (`CLAUDE.md`'s "Domain nesting" section documents two components in this codebase that need un-nesting for exactly this reason.)

## Step 3 — Create `handles.ts`

```ts
const ComponentNameHandles = [
  'container',
  'title',
  // ... every class name this component's JSX will reference
] as const;

export default ComponentNameHandles;
```

- camelCase handle names, `readonly` via `as const`, default export, variable named `<ComponentName>Handles`.
- Pick names that won't collide with another component's handles once bundled — CSS Handles in this project provide **no runtime scoping** (see `CLAUDE.md`). Prefer component-specific names over generic ones like `container`/`title` when this component's stylesheet will load alongside others that reuse those same words.

## Step 4 — Create `index.tsx`

```tsx
import { useCssHandles } from '@/hooks/useCssHandles';
import ComponentNameHandles from './handles';
import '@/styles/components/componentName.scss';

interface IProps {
  // props this component receives
}

const ComponentName = ({} /* destructured props */ : IProps) => {
  const handles = useCssHandles(ComponentNameHandles);

  return <div className={handles.container}>{/* content */}</div>;
};

export default ComponentName;
```

Rules:

- `const` arrow function, `export default` — never a class, never `React.FC`.
- Props interface always named `IProps`, defined inline here (this project doesn't split into a separate `.types.ts`).
- Add `'use client'` as the first line whenever this component uses hooks, refs, or browser APIs — do this explicitly even though most of the app already runs client-side (see `CLAUDE.md` § Client Boundary). Don't skip it just because it currently "works" without it.
- `className` always via `handles.xxx` — never a raw string, never a handle concatenated with a raw literal (e.g. `` `${handles.foo} bar` `` — if you need `bar`, add it as a handle instead).
- Import order: React/Next → types → hooks → child components → handles → styles (styles import last).

## Step 5 — Extract a hook if there's real logic

If this component has non-trivial state, effects, refs, or event handlers, move that out of `index.tsx` into `use<ComponentName>.ts` in the same folder — this is a **new** convention in this codebase (no existing component does this yet), aimed at keeping `index.tsx` purely presentational:

```ts
import { useState } from 'react';

interface UseComponentNameParams {
  // only what the logic needs
}

export function useComponentName(params: UseComponentNameParams) {
  const [isOpen, setIsOpen] = useState(false);
  // state, effects, handlers...

  return {
    // state + handlers the View consumes
  };
}
```

`index.tsx` then only calls the hook and renders what it returns. Skip this step entirely for purely presentational components — don't create a hook file with nothing in it.

## Step 6 — Extract any SVG icons

Never leave an inline `<svg>` in this component's JSX. Create `components/Icons/<Name>Icon.tsx`:

```tsx
import type { SVGProps } from 'react';

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChevronDownIcon;
```

And add it to the barrel `components/Icons/index.ts` (`export { default as ChevronDownIcon } from './ChevronDownIcon';`). Import icons directly from `@/components/Icons` in whatever component uses them — icons don't get registered anywhere else.

If `components/Icons/` doesn't exist yet, create it now.

## Step 7 — Create the SCSS file

`styles/components/<componentName>.scss` (camelCase filename, matching the component name):

```scss
@use '../../styles/globals' as *;
// nested one level deeper (e.g. components/Parent/Child/)? use '../../../styles/globals' as *;

.container {
  @include flex-col-start();
  gap: $spacing-3;
  background: $surface; // elevation 1 — pair with @include elevation(1) if it needs a shadow too
  border-radius: $radius-md;
  border: 1px solid $color-border;

  @include light {
    // light-mode override — dark is the default, don't wrap dark styles in @include dark
    border-color: $color-border-inverse;
  }

  @include mobile {
    // responsive override — desktop is the default, don't wrap desktop styles in @include desktop
  }
}

.title {
  @include cinzel-lg($color-text, $font-weight-semibold);
}

.actionButton {
  @include focus-ring(

  ); // any custom interactive element needs this, not just inputs
}
```

Never hardcode a hex color, a raw px font-size, or raw px spacing/margin. **Reach for a semantic token before a primitive, and a primitive before inventing a one-off value.** Everything comes from `styles/config/`:

- **Semantic text/border (reach for these first):** `$color-text`, `$color-text-muted`, `$color-text-subtle`, `$color-border`, `$color-border-strong` (dark-mode defaults) — and their `-inverse` counterparts for use inside `@include light { }` blocks. There is no dedicated semantic token for background yet beyond `$color-bg`/the surface ladder below — use those.
- **Semantic state tints (for alerts/badges):** `$success-bg`/`$success-border`, `$warning-bg`/`$warning-border`, `$error-bg`/`$error-border`, `$info-bg`/`$info-border`.
- **Surfaces (an elevation ladder — pair the step with the matching `elevation($level)` mixin of the same rank):** `$surface`(1) / `$surface-raised`(2) / `$surface-elevated`(3) / `$surface-float`(4).
- **Primitives (fall back to these only when no semantic token fits):** `$primary-*` (functional gold — buttons/links/focus), `$gold-*` (decorative gold — only inside the premium mixins below, don't reach for it directly in component code), `$neutral-*` (100–1000 dark, 2000–2900 light), `$success`/`$info`/`$warning`/`$error`, `$overlay`, `$accent-overlay*`, `$glow-*`.
- **Typography:** `cinzel-*` / `mono-*` / `main-*` mixins × `xs`–`3xl`, plus `caption(...)` and `stat-value(...)`. Pass weight as `$font-weight-light`/`-regular`/`-medium`/`-semibold`/`-bold` — never a raw number or a string like `'bold'`.
- **Spacing/radius:** `$spacing-1`–`$spacing-20`, `$radius-sm`–`$radius-full`
- **Flex:** `flex-center`, `flex-col-*`, `flex-row-*`
- **Responsive/theme:** `desktop`/`mobile`, `dark`/`light` (dark + desktop are the unwrapped defaults)
- **Premium decorative mixins** (ornamental only — gold accents, not layout): `gold-border`, `gold-decorative-line`, `gold-gradient-text`, `premium-input-focus`, `gold-glow`, `premium-card`, `corner-ornament`, `elevation`, `noise-texture`
- **Accessibility:** `focus-ring($color: $primary-100)` on any custom interactive element (buttons, cards, custom controls) — not just form inputs
- **Animation:** keyframes via `fade-in`, `slide-up`, `scale-in` mixins

If a token you need doesn't exist yet, add it to the right `styles/config/_*.scss` partial following the existing naming convention before using it — don't invent a one-off local value.

## What this project does NOT have (don't invent steps for these)

No CMS, so: no `sections.json`/schema registration, no `$componentKey`, no `components/index.tsx` default-export map to update. No GraphQL layer, so no fragments/resolvers. No CSS Modules, so no `.module.scss`, no per-component style scoping beyond naming discipline. No separate `.types.ts` file — `IProps` lives inline in `index.tsx`. Data arrives via props from whatever Page or organism renders this component; there's no `usePDP`/`usePLP`-style data hook to reach for.

## Checklist before finishing

- [ ] Atomic level decided using the behavioral rule (not folder/visual guesswork)
- [ ] Location decided — flat by default; nested only if it passes the domain-exclusivity litmus test, with the parent's name dropped from its own
- [ ] `handles.ts` — `readonly` tuple, default export, collision-aware names
- [ ] `index.tsx` — `IProps` inline, `export default`, `'use client'` if it uses hooks/browser APIs, `handles.xxx` for every className, correct import order
- [ ] `use<ComponentName>.ts` created only if there's real logic to extract
- [ ] No inline `<svg>` — extracted to `components/Icons/` with barrel export
- [ ] `styles/components/<componentName>.scss` — correct `@use` path, zero hardcoded colors/px, tokens/mixins only, `@include light`/`@include mobile` overrides where relevant
- [ ] Text/border colors use a semantic token (`$color-text`, `$color-border`, ...) before falling back to a primitive — never a raw hex
- [ ] Custom interactive elements (not plain `<button>`/`<a>` relying on browser defaults) have `@include focus-ring()`
- [ ] No raw literal class names mixed with handles

## When done

Report to the user:

1. Every file created, with its path.
2. If this component could have reused an existing atom/molecule instead of duplicating markup or logic, say which one.
