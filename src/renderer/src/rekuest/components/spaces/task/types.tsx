import { MediaStoreFragment } from "@/rekuest/api/graphql";
import * as THREE from "three";



export type SpaceGroupPlacement = {
  id: string;
  name: string;
  agentId: string;
  agentName: string;
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
