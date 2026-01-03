/**
 * Discriminated union type for Server Action results.
 * Ensures type-safe handling of success and error states.
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
