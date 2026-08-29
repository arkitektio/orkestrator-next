import { MediaStoreFragment } from "@/rekuest/api/graphql";



export type SpaceGroupPlacement = {
  id: string;
  name: string;
  agentId: string;
  agentName: string;
  isRoot?: boolean;
  model?: {
    id: string;
    transferFunction?: string | null;
    file: MediaStoreFragment;
  } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  affineMatrix?: any;
};

export type SpaceGroup = {
  spaceId: string;
  placements: SpaceGroupPlacement[];
};


// ── Timeline types ───────────────────────────────────────────────────
// Canonical definitions live in the shared timeline core; re-exported here
// so existing spaces importers keep working.

export type {
  TimelineEvent,
  TimelineItem,
  TimelineMethodRow,
  TimelineDependencyGroup,
} from "@/rekuest/lib/taskTimeline";
