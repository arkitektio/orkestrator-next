import { buildDeleteMate } from "@/mates/meta/buildDeleteMate";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { useDeleteAffineTransformationViewMutation } from "../api/graphql";

export const useDeleteAffineTransformationViewMate = buildDeleteMate(
  withMikroNext(useDeleteAffineTransformationViewMutation),
  "AffineTransformationView",
);
