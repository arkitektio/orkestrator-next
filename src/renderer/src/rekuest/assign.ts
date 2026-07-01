import { AssignInput } from "./api/graphql";

/**
 * `AssignInput` gained four required flags (`cached`, `capture`, `ephemeral`,
 * `log`) in the rekuest API update. This fills conservative defaults so call
 * sites only need to specify the flags they actually care about.
 */
export const buildAssignInput = (
  input: Omit<AssignInput, "cached" | "capture" | "ephemeral" | "log"> &
    Partial<Pick<AssignInput, "cached" | "capture" | "ephemeral" | "log">>,
): AssignInput => ({
  cached: false,
  capture: false,
  ephemeral: false,
  log: false,
  ...input,
});
