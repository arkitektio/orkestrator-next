import {
  GenericCategoryInput,
  ListGenericCategoryFragment,
  ListStructureCategoryFragment,
  StructureCategoryInput,
} from "@/kraph/api/graphql";

export type NodeData =
  | ListGenericCategoryFragment
  | ListStructureCategoryFragment
  | StructureCategoryInput
  | GenericCategoryInput;

export type ClickContextualParams = {
  position: { x: number; y: number };
  event: React.MouseEvent;
};

export type StagingNodeParams = {
  event: React.MouseEvent;
  data: NodeData;
  id: string;
  type: string;
};
