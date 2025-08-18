import {
  ListRgbContextFragment,
  ListRoiFragment,
} from "@/mikro-next/api/graphql";
import { useSettings } from "@/providers/settings/SettingsContext";
import { Matrix4 } from "@math.gl/core";
import { FinalRender } from "./FInalRender";

export interface DelegatingImageRenderProps {
  context: ListRgbContextFragment;
  rois: ListRoiFragment[];
  modelMatrix?: Matrix4;
  className?: string;
  follow?: "width" | "height";
}

export const DelegatingImageRender: React.FC<DelegatingImageRenderProps> = (
  props,
) => {
  const { settings } = useSettings();
  // console.log
  return <FinalRender {...props} />;
};
