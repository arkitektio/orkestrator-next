import { buildDeleteMate } from "@/mates/meta/buildDeleteMate";
import { useDeleteAffineTransformationViewMutation } from "../api/graphql";

export const useDeleteAffineTransformationViewMate = buildDeleteMate(
  useDeleteAffineTransformationViewMutation,
  "AffineTransformationView",
);
