import { Edge, Node } from "@xyflow/react";

import {
  BeamSplitterElementFragment,
  CcdElementFragment,
  DetectorElementFragment,
  FilterElementFragment,
  LaserElementFragment,
  LensElementFragment,
  LightEdgeFragment,
  MirrorElementFragment,
  ObjectiveElementFragment,
  OtherElementFragment,
  OtherSourceElementFragment,
  PinholeElementFragment,
  SampleElementFragment,
} from "@/mikro-next/api/graphql";

export type SampleElementNode = Node<SampleElementFragment, "SampleElement">;
export type PinholeElementNode = Node<PinholeElementFragment, "PinholeElement">;
export type LaserElementNode = Node<LaserElementFragment, "LaserElement">;
export type CCDElementNode = Node<CcdElementFragment, "CCDElement">;
export type OtherElementNode = Node<OtherElementFragment, "OtherElement">;
export type OtherSourceElementNode = Node<
  OtherSourceElementFragment,
  "OtherSourceElement"
>;
export type FilterElementNode = Node<FilterElementFragment, "FilterElement">;
export type DetectorElementNode = Node<
  DetectorElementFragment,
  "DetectorElement"
>;
export type LensElementNode = Node<LensElementFragment, "LensElement">;
export type BeamSplitterElementNode = Node<
  BeamSplitterElementFragment,
  "BeamSplitterElement"
>;
export type ObjectiveElementNode = Node<
  ObjectiveElementFragment,
  "ObjectiveElement"
>;
export type MirrorElementNode = Node<MirrorElementFragment, "MirrorElement">;

export type LightEdge = Edge<LightEdgeFragment, "LightEdge">;

export type MyEdge = LightEdge;

export type EdgeData = MyEdge["data"];

export type MyNode =
  | SampleElementNode
  | DetectorElementNode
  | CCDElementNode
  | LensElementNode
  | BeamSplitterElementNode
  | MirrorElementNode
  | LaserElementNode
  | OtherElementNode
  | OtherSourceElementNode
  | PinholeElementNode
  | FilterElementNode
  | ObjectiveElementNode;

export type NodeData = MyNode["data"];
