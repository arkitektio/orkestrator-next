import { DESIRED_EDGE_LENGTH, NODE_DIAMETER } from "./nodeSize";

// A tension layout, and nothing else: stress majorization places every node so
// that the distance drawn between two of them matches the distance through the
// graph. Every transformation is a spring at its rest length, every space is
// pushed to where all of its springs are least unhappy.
//
// That is the honest picture of this data. What registers into what is a web —
// a calibration reaching in, a stage frame a hundred tiles share — and the
// left-to-right layering this used to draw imposed an order the schema does not
// have.
//
// Stress ignores node sizes, which is exactly why every node is the same circle
// (see nodeSize.ts): one rest length comfortably above one diameter, and
// nothing can land on anything. DisCo wraps it so a depth-bounded walk that
// leaves an island packs it against the rest rather than stranding it. Verified
// headlessly at this rest length: zero overlaps, and stable across runs.
export const LAYOUT_OPTIONS = {
  "elk.algorithm": "disco",
  "elk.disco.componentCompaction.strategy": "POLYOMINO",
  "elk.disco.componentCompaction.componentLayoutAlgorithm": "stress",
  "elk.stress.desiredEdgeLength": String(DESIRED_EDGE_LENGTH),
  "elk.spacing.nodeNode": String(NODE_DIAMETER / 2),
};
