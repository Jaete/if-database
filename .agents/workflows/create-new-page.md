---
trigger: always_on
glob: app/**/page.tsx
description: Step-by-step guide to create a new Route Page in the App Router following the data fetching and layout pattern.
---

# Creating a New Page

A **Page** is a Next.js route entry point. Its primary job is **data fetching, server-side parameter parsing, database connection, and layout composition**. It should not contain styling files, complex UI logic, or raw HTML wrappers (other than high-level semantic tags like `<main>`). Instead, it acts as a container that instantiates and orchestrates **Features**.

## Prerequisites

Before starting, identify:

- **Route URL** and path (e.g., `/creatures` -> `app/creatures/page.tsx`, `/creatures/edit/[slug]` -> `app/creatures/edit/[slug]/page.tsx`)
- **Required parameters** (e.g., dynamic `slug`)
- **Database queries** and the service methods required
- **Feature components** to render on this page

---

## Step 1: Create the Page file

Create `page.tsx` in the target route directory (e.g., `app/creatures/page.tsx`):

```tsx
import { connectDB } from '@/lib/db';
import { getSomeData } from '@/services/some.service';
import { notFound } from 'next/navigation';

// Import Feature components
import SomeFeature from '@/components/SomeFeature';

interface IProps {
  params: Promise<{ slug?: string }>;
}

export default async function PageName({ params }: IProps) {
  // 1. Resolve parameters if route is dynamic
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 2. Establish database connection
  await connectDB();

  // 3. Fetch server data
  const rawData = await getSomeData(slug);
  if (!rawData) {
    notFound();
  }

  // 4. Serialize Mongoose documents for client features
  const serializedData = JSON.parse(JSON.stringify(rawData));

  // 5. Compose the layout using high-level Feature components
  return (
    <main>
      <SomeFeature initialData={serializedData} />
    </main>
  );
}
```

**Rules:**

- Page components are **server components** (no `'use client'` directive).
- Always call `await connectDB()` before fetching from Mongoose.
- Await params explicitly using `const { slug } = await params;` as required by Next.js 16/React 19.
- Use `JSON.parse(JSON.stringify(data))` to fully serialize Mongoose query results. This avoids Next.js server-to-client boundary serialization warnings.
- **Never import SCSS stylesheets directly in pages.** Component styling must live inside their respective component SCSS files under `styles/components/`.
- Keep HTML tags minimal (e.g., only `<main>`, `<section>`).

---

## Step 2: Handle Route Metadatas (Optional)

If page SEO optimization is required, export a `generateMetadata` function:

```tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const creature = await getCreatureBySlug(slug);

  if (!creature) return { title: 'Criatura não encontrado | IF Database' };

  return {
    title: `${creature.name} | IF Database`,
    description: creature.description || `Ficha completa de ${creature.name}.`,
  };
}
```

---

## Checklist

- [ ] Page is defined as an `async function`
- [ ] DB connection is established via `await connectDB()`
- [ ] Routing parameters are awaited (`const { slug } = await params`)
- [ ] Mongoose documents are serialized via `JSON.parse(JSON.stringify(...))` before passing to features
- [ ] No local CSS/SCSS imports are present in the page file
- [ ] Layout is composed of high-level Features rather than raw styled tags
- [ ] Return `notFound()` or handle errors gracefully on missing data
