import { RunEventFragment } from "../api/graphql";

export type RunState = {
  events?: (RunEventFragment | null)[];
  t: number;
};
