import { Edge, Node } from "@xyflow/react";
import { SectionFragment } from "../../api/graphql";

// A single morphology section, tinted with the CSS color resolved from its
// compartment (see `utils.ts`), laid out as a React Flow node.
export type SectionNodeData = SectionFragment & { color: string };

export type SectionNode = Node<SectionNodeData, "section">;
export type SectionEdge = Edge<{ location: number }, "parent">;
