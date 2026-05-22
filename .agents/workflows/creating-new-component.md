---
trigger: always_on
glob: components/**/*
description: Step-by-step guide to create a new simple Component following the project's CSS Handles pattern and architecture conventions.
---

# Creating a New Component

A **Component** is a simple, presentational unit. It receives data via props from a parent Feature and renders UI. It holds **no business logic, no data fetching, no complex state**. All logic lives in the Feature that owns it.

## Prerequisites

Before starting, identify:

- **Component name** (PascalCase, e.g., `StatBlock`, `DropsBlock`)
- **Parent Feature** that will provide data to this component
- **Props interface** — what data it receives
- **CSS handle names** — the class names it needs

---

## Step 1: Create the component directory

Create a new directory under `components/` using **PascalCase**:

```
components/ComponentName/
```

---

## Step 2: Create the handles file

Create `components/ComponentName/handles.ts`:

```ts
const ComponentNameHandles = [
  'container',
  'title',
  // ... add all CSS class names this component needs
] as const;

export default ComponentNameHandles;
```

**Rules:**

- Handle names use **camelCase** (e.g., `cardImage`, `attrLabel`)
- The array must be `as const` for TypeScript autocomplete
- Export as `default`
- Variable name follows the pattern `ComponentNameHandles`

---

## Step 3: Create the component file

Create `components/ComponentName/index.tsx`:

```tsx
import { useCssHandles } from '@/hooks/useCssHandles';
import ComponentNameHandles from './handles';

interface IProps {
  // Define the data this component receives from its parent Feature
}

const ComponentName = ({} /* destructured props */ : IProps) => {
  const handles = useCssHandles(ComponentNameHandles);

  return (
    <div className={handles.container}>
      {/* Render UI using handles for classNames */}
    </div>
  );
};

export default ComponentName;
```

**Rules:**

- Use `const` arrow function with `export default ComponentName`
- Props interface is always named `IProps`
- Import types with `import type` or `import { type X }`
- Use `handles.xxx` for all `className` attributes — never hardcode class strings
- **No data fetching** — components only receive data via props
- **No complex state** — only minimal UI state (e.g., hover, toggle) if absolutely needed
- If client interactivity is needed, add `'use client'` at the top

**Import order:**

1. React / Next.js imports
2. Type imports (`import type ...`)
3. Hooks (`useCssHandles`)
4. Child components (if any)
5. Handles (`./handles`)
6. Styles (`@/styles/components/...`)

---

## Step 4: Create the SCSS file

Create `styles/components/componentName.scss` (note: **camelCase** filename):

```scss
@use '../../styles/globals' as *;

.container {
  // Use design system tokens:
  // Colors:      $primary-100, $neutral-200, etc.
  // Spacing:     $spacing-1 through $spacing-20
  // Radius:      $radius-sm, $radius-md, $radius-lg, $radius-xl, $radius-full
  // Typography:  @include cinzel-md($color, $weight);
  //              @include main-sm($color, $weight);
  //              @include mono-xs($color, $weight);
  // Layout:      @include flex-center(); @include flex-col-start(); etc.

  // Dark mode is the DEFAULT. Add light overrides:
  @include light {
    // light mode color overrides
  }

  // Mobile overrides (desktop is default):
  @include mobile {
    // mobile-specific adjustments
  }
}
```

**Rules:**

- Class selectors match handle names exactly (`.container`, `.title`, etc.)
- Always import the design system: `@use '../../styles/globals' as *;`
- Dark mode is the default — use `@include light { ... }` for light overrides
- Desktop is the default — use `@include mobile { ... }` for responsive overrides
- Use spacing tokens (`$spacing-*`), never raw `px` or `rem` values for padding/margins
- Use typography mixins instead of raw `font-family` / `font-size` declarations
- BEM modifiers use `&--modifier` syntax: `&--active { ... }`

---

## Step 5: Import the SCSS in the component

Add the SCSS import to `index.tsx`. This import goes **last**, after handles:

```tsx
import '@/styles/components/componentName.scss';
```

> **Note:** Only the component that "owns" the styles imports the SCSS file. If a component shares styles with its parent Feature (e.g., `.statSection`, `.infoRow`), those styles live in the Feature's SCSS file and the component does NOT import its own.

---

## Step 6: Use the component in a Feature

The parent Feature imports and uses the component, passing data via props:

```tsx
import ComponentName from '@/components/ComponentName';

// Inside the Feature's render:
<ComponentName data={someData} />;
```

---

## Checklist

Before considering the component done:

- [ ] `handles.ts` exports a `readonly` tuple as `default`
- [ ] `index.tsx` uses `useCssHandles` and `handles.xxx` for all classNames
- [ ] Props interface is named `IProps`
- [ ] Component uses `const` arrow function with `export default`
- [ ] SCSS file is in `styles/components/` with camelCase filename
- [ ] SCSS imports `@use '../../styles/globals' as *;`
- [ ] SCSS uses design tokens (colors, spacing, typography mixins)
- [ ] SCSS has `@include light { ... }` overrides where appropriate
- [ ] SCSS has `@include mobile { ... }` overrides where appropriate
- [ ] No data fetching or business logic in the component
- [ ] UI text is in Brazilian Portuguese (pt-BR)
