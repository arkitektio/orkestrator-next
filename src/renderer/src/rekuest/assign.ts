import { AssignInput } from "./api/graphql";

/**
 * `AssignInput` still carries one required flag (`capture`). This fills a
 * conservative default so call sites only need to specify it when they
 * actually want the task captured.
 *
 * The old `cached` / `ephemeral` / `log` flags were removed from the API —
 * `ephemeral` in particular is superseded by the probe path (`useProbe`),
 * which is genuinely zero-persistence.
 */
export const buildAssignInput = (
  input: Omit<AssignInput, "capture"> & Partial<Pick<AssignInput, "capture">>,
): AssignInput => ({
  capture: false,
  ...input,
});
