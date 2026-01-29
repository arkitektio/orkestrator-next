import { useTrackRiver } from "../context";

export const useLatestNodeEvent = (node: string) => {
  const { runState } = useTrackRiver();

  return runState?.events?.find((e) => e?.source === node);
};
