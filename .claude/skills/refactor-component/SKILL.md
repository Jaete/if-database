---
name: refactor-component
description: Manually-invoked only. Migrates one existing IF Database component to the atomic-design / CSS-Handles conventions documented in CLAUDE.md and the new-component skill.
disable-model-invocation: true
argument-hint: '[ComponentName|all]'
arguments: [target]
---

# refactor-component

Migrates an **existing** component in `components/` to match the conventions the `/new-component` skill scaffolds (see `CLAUDE.md` for the full rules). This skill never auto-invokes — it only runs when explicitly called via `/refactor-component`, one component at a time, deliberately.

## Usage

```
/refactor-component <ComponentName>
/refactor-component all
```

## Process

### Single component (`$target` is a specific name)

1. Read the component's current files and audit against the rubric below. **Report the deviations found before changing anything.**
2. Apply the structural/stylistic fixes only. Do not change what the component does or how it behaves — this is a refactor, not a rewrite.
3. **If you discover a functional bug while auditing** (wrong prop passed, crash path, logic error — not a styling/structure issue), **stop and flag it to the user explicitly, then wait for direction.** Do not silently fix business logic as a side effect of a structural refactor. (See the flagged bug at the bottom of this file for a known example likely to surface.)
4. After fixing, re-check the file against the rubric and report what changed.

### No argument, or `all`

Don't silently rewrite every component in one pass. Instead:

1. Run a fresh scan for rubric violations (see below) — the seeded worklist in this file is a **starting point from a past audit, not a guarantee of current or complete state**. Re-verify each seeded item still applies; also grep freshly for inline `style={{`, raw hex colors in `.scss`, inline `<svg`, and folders missing `index.tsx`/`handles.ts`, since new components may have been added since this list was written.
2. Present the findings **ranked by severity** (structural breakage > convention violations affecting multiple consumers > widespread mechanical issues > cosmetic naming).
3. Ask the user which component(s) to tackle first. Process one at a time with a review checkpoint between each — never batch-apply fixes across many components unattended.

## Audit rubric (mirrors `/new-component`'s rules)

- [ ] `index.tsx` + `handles.ts` both present (not a flat file, not a differently-named entry point)
- [ ] Props interface named `IProps`, not inline-typed or differently named
- [ ] Every `className` goes through `handles.xxx` — no raw literal strings, no handle-plus-literal concatenation
- [ ] No inline `style={{...}}` — moved to the component's `.scss` via a handle
- [ ] `styles/components/<name>.scss` uses only tokens/mixins from `styles/config/` — no hardcoded hex, raw px, or rgba. In particular: `#ffffff`/near-white text → `$color-text`; grays like `#808080` → `$color-text-muted`; ad hoc dim grays → `$color-text-subtle`; hardcoded border grays → `$color-border`/`$color-border-strong` (see CLAUDE.md § Design Tokens for the full semantic list, added after this component was first written)
- [ ] Font weights passed as raw numbers/strings (`600`, `'bold'`) → `$font-weight-*` tokens
- [ ] Custom interactive elements missing a focus state → add `@include focus-ring()`
- [ ] No inline `<svg>` — extracted to `components/Icons/` with barrel export
- [ ] `'use client'` declared explicitly if the component uses hooks/browser APIs (don't leave it relying on an inherited boundary)
- [ ] If nested under a parent as a domain sub-component: passes the exclusivity litmus test (not imported elsewhere, contains parent-specific logic) — otherwise promote it to a flat top-level component with the parent prefix dropped
- [ ] Handle names and component naming don't leak from a different, unrelated domain (e.g. a `creature*`-prefixed handle on a citizen component)
- [ ] Atomic level (atom/molecule/organism) reflects actual behavior (does it own state/effects, or is it pure props-in/JSX-out?)

## Seeded worklist (from a full-codebase audit; re-verify before acting — see above)

Ranked by severity:

1. **`components/EvolutionTreeModal/MonsterSearch.tsx`** — zero CSS handles, fully inline-styled, hardcoded hex colors, hover state mutates `style` directly via mouse handlers. Worst offender.
2. **`components/CitizenDrawer/CitizenData.tsx`** — no `index.tsx` (file is named `CitizenData.tsx` directly under `CitizenDrawer/`), reuses `creature*`-prefixed handles copy-pasted from creature code, hardcodes `` `${handles.creatureData} citizenData` `` (a raw literal string appended to a handle), several inline `style={{}}` spots.
3. **`components/CreatureDrawer/` + its sub-components** (currently under a `sections/` folder) — cross-imported by `CitizenGrid`, contains zero Creature-specific logic. Promote to a generic top-level `components/Drawer/`, each sub-piece as its own folder, no `sections/` wrapper.
4. **`components/CreatureEditForm/sections/FormField.tsx`** — cross-imported by `CitizenEditForm`. Promote to top-level `components/FormField/`.
5. **`components/CreatureEditForm/sections/ArrayItemWrapper.tsx`** — check whether it's also cross-imported by `CitizenEditForm` before deciding whether it's genuinely exclusive or needs the same promotion as FormField.
6. **`components/AuthGate.tsx`** — flat file instead of `AuthGate/index.tsx` + `handles.ts`, inline `{ children: React.ReactNode }` instead of `IProps`.
7. **Duplicated inline SVGs** (~15-20 instances across `CreatureCard`, `CitizenCard`, `CreatureGrid`, `CitizenGrid`, `CreatureEditForm`, `CitizenEditForm`, `EvolutionTreeModal` — several byte-identical, e.g. eye/pencil/trash icons repeated in both Card twins) — extract to `components/Icons/`.
8. **Hardcoded hex/px values** across roughly 10 `styles/components/*.scss` files (`evolutionTreeModal`, `creatureCard`, `citizenCard`, `alertModal`, `citizenGrid`, `creatureGrid`, `loginModal`, `creatureEditForm`, `citizenEditForm`, `creatureDrawer`) — these predate the semantic color layer (`$color-text`, `$color-text-muted`, `$color-border`, etc.) added to `styles/config/_colors.scss`; migrate the hardcoded `#ffffff`/gray/border values to the matching semantic token rather than just tokenizing them as new one-off primitives.
9. **`styles/components/creatureDrawer.scss`** holds styling for 7 unrelated components (`CreatureData`, `CreatureInfo`, `StatsBlock`, `CombatInfo`, `DropsBlock`, `SensesBlock`, `AbilitiesBlock`) instead of each owning its own file — untangle carefully, this is the highest-regression-risk item since many components currently depend on rules landing in this one file.
10. **`components/CreatureCard/handles.ts`** — legacy `mc*` handle prefix (leftover from a pre-rename "MonsterCard"). Cosmetic rename.
11. **`components/CreatureInfo/index.tsx`** — internally names its component `CombatInfo` (matches the real, separate `CombatInfo` component's name). Verify whether this file is actually used anywhere before assuming it's dead code to delete vs. a real component to rename.

## Flagged, not a worklist item

While auditing `CitizenGrid` / `CitizenEditForm` (items 2–5 above), you will likely notice `CitizenGrid`'s direct-edit path renders `<CitizenEditForm mode="edit" onClose={...} />` **without** a `citizen` prop, unlike `CreatureGrid`'s equivalent path which does pass `creature={directEditCreature}`. This looks like a real crash bug (`citizenToFormData(citizen!)` running against `undefined`), not a styling/structure issue. Per the hard rule above: **flag this to the user and wait for direction — do not fix it silently as part of a structural refactor pass.**
