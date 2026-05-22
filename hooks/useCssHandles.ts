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

/**
 * Applies a modifier to a given CSS handle.
 *
 * @param handle - The base CSS handle string (e.g., handles.container).
 * @param modifier - The modifier string to append.
 * @returns A new string in the format `handle--modifier`.
 */
export function applyModifiers<H extends string, M extends string>(
  handle: H,
  modifier: M
): `${H}--${M}` {
  return `${handle}--${modifier}`;
}
