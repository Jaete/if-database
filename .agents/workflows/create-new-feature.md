---
trigger: always_on
glob: components/**/*
description: Step-by-step guide to create a new Feature component that orchestrates state, logic, and simple components.
---

# Creating a New Feature

A **Feature** is a high-level orchestration component (e.g., `MonsterData`, `MonsterGrid`). It contains business logic, state management, event listeners/dispatchers, and coordinates multiple simple, presentational components to compose the interface.

## Prerequisites

Before starting, identify:

- **Feature Name** (PascalCase, e.g., `MonsterCatalog`, `CreatureEditor`)
- **Data models/services** it needs to interact with
- **Simple components** it will compose (e.g., `CombatInfo`, `StatBlock`)
- **Shared states** or global event listeners it requires

---

## Step 1: Create the Feature directory

Create a directory under `components/` using **PascalCase**:

```
components/FeatureName/
```

If the Feature contains sub-components that are exclusively used by this Feature and are not generic enough to be global, place them in a `sections/` subdirectory:

```
components/FeatureName/sections/
```

---

## Step 2: Create the handles file

Create `components/FeatureName/handles.ts`:

```ts
const FeatureNameHandles = [
  'container',
  'header',
  'content',
  // ... add CSS class names specific to this Feature wrapper
] as const;

export default FeatureNameHandles;
```

---

## Step 3: Create the Feature file

Create `components/FeatureName/index.tsx`:

```tsx
'use client'; // Usually client-side for state, hooks, or event listeners

import { useState, useEffect } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import type IMonster from '@/db/monsters/monsters.d';

// Import child presentational components
import StatBlock from '@/components/StatsBlock';
import CombatInfo from '@/components/CombatInfo';

import FeatureNameHandles from './handles';
import '@/styles/components/featureName.scss';

interface IProps {
  initialData: IMonster[];
}

const FeatureName = ({ initialData }: IProps) => {
  const handles = useCssHandles(FeatureNameHandles);
  const [data, setData] = useState<IMonster[]>(initialData);

  // Implement state, event dispatchers, or custom event listeners here
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      // Logic for inter-component communication
    };
    window.addEventListener('monster:update', handleUpdate);
    return () => window.removeEventListener('monster:update', handleUpdate);
  }, []);

  return (
    <div className={handles.container}>
      <header className={handles.header}>
        {/* Presentational content or sub-headers */}
      </header>
      <div className={handles.content}>
        {data.map((item) => (
          <div key={item.slug}>
            {/* Coordinate and pass data to simple components */}
            <CombatInfo combat={item.combat} />
            <StatBlock stats={item.stats} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureName;
```

**Rules:**

- Use `'use client'` if managing state, interactivity, or using DOM events.
- Manage logical state (loading, selected items, filters, form fields) here.
- Pass down data to simple, stateless child components.
- Do not let child components write back to the database or trigger fetch directly; pass callbacks or trigger events from the Feature level.

---

## Step 4: Create the SCSS file

Create `styles/components/featureName.scss` (using camelCase):

```scss
@use '../../styles/globals' as *;

.container {
  // Styles for the Feature wrapper
}

.header {
  // Styles for the Feature header
}

.content {
  // Styles for layout orchestration
}
```

---

## Checklist

- [ ] Feature is placed in `components/FeatureName/`
- [ ] It manages complex state, filters, or client actions
- [ ] It coordinates presentation by rendering simple child components
- [ ] Simple child components receive data via props and do not hold logic
- [ ] SCSS styling handles structure, alignment, and responsiveness of the feature layout
