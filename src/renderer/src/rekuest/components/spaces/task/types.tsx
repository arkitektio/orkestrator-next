import { AssignationEventKind, MediaStoreFragment, PostmanAssignationFragment } from "@/rekuest/api/graphql";



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

export type TimelineEvent = {
  kind: AssignationEventKind;
  message?: string | null;
  createdAt: string;
  position: number;
};

export type TimelineItem = {
  assignation: PostmanAssignationFragment;
  start: number;
  end: number;
  startTime: number;
  endTime: number;
  events: TimelineEvent[];
};

export type TimelineMethodRow = {
  id: string;
  method: string;
  summary?: string;
  items: TimelineItem[];
};

export type TimelineDependencyGroup = {
  id: string;
  dependency: string;
  summary?: string;
  items: TimelineItem[];
  methods: TimelineMethodRow[];
};
