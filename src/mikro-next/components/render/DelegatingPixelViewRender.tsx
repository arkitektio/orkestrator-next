import {
  PixelViewFragment
} from "@/mikro-next/api/graphql";
import { useSettings } from "@/providers/settings/SettingsContext";
import { Matrix4 } from "@math.gl/core";
import { RGBD } from "./TwoDThree";

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
