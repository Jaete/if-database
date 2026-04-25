import { useMemo } from 'react';

/**
 * Hook to manage CSS handles and provide TypeScript autocomplete.
 *
 * @param handles - Array of strings (handles) to be used as class names.
 * @returns An object where each key is a handle and its value is the handle name.
 *
 * @example
 * const handles = useCssHandles(['container', 'title'] as const);
 * <div className={handles.container}>...</div>
 */
export function useCssHandles<T extends string>(
  handles: readonly T[]
): Record<T, string> {
  return useMemo(() => {
    const result: Record<T, string> = {} as Record<T, string>;
    for (const handle of handles) {
      result[handle] = handle;
    }
    return result;
  }, [handles]);
}
