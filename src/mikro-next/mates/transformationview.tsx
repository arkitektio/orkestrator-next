import { buildDeleteMate } from "@/mates/meta/buildDeleteMate";
import { useDeleteAffineTransformationViewMutation } from "../api/graphql";
import { withMikroNext } from "@jhnnsrs/mikro-next";

export const useDeleteAffineTransformationViewMate = buildDeleteMate(
  withMikroNext(useDeleteAffineTransformationViewMutation),
  "AffineTransformationView",
);
