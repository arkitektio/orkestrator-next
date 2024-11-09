import {
  ListRgbContextFragment,
  ListRoiFragment,
  PixelViewFragment,
} from "@/mikro-next/api/graphql";
import { useSettings } from "@/providers/settings/SettingsContext";
import { VivRenderer } from "./VivRenderer";
import { RGBD } from "./TwoDThree";
import { Matrix4 } from "@math.gl/core";

export interface DelegatingPixelViewRenderProps {
  view: PixelViewFragment;
  modelMatrix?: Matrix4;
  className?: string;
  follow?: "width" | "height";
}

export const DelegatingPixelViewRender: React.FC<
  DelegatingPixelViewRenderProps
> = (props) => {
  const { settings } = useSettings();

  return <RGBD {...props} />;
};
