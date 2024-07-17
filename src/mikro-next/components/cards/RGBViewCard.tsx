import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroRGBView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { closest } from "color-2-name";
import { ColorMap, RgbViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: RgbViewFragment;
  mates?: MateFinder[];
}

export const baseColorToRGB = (baseColor: number[] | undefined | null) => {
  let r = baseColor?.at(0) || 0;
  let g = baseColor?.at(1) || 0;
  let b = baseColor?.at(2) || 0;
  return `rgb(${r}, ${g}, ${b})`;
};

export const baseColorToName = (baseColor: number[] | undefined | null) => {
  const rgb = baseColorToRGB(baseColor);
  return closest(rgb).name;
};

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroRGBView.Smart object={view?.id}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle className="flex w-full">
            Channel {view.cMin}{" "}
            {view.colorMap == ColorMap.Intensity && (
              <div
                className="w-2 h-2 rounded rounded-full ml-auto"
                style={{ backgroundColor: baseColorToRGB(view.baseColor) }}
              ></div>
            )}
          </CardTitle>
          {view.colorMap == ColorMap.Intensity ? (
            <p className="text-xs text-foreground-muted">
              {baseColorToName(view.baseColor)}
            </p>
          ) : (
            <p className="text-xs text-foreground-muted">{view.colorMap}</p>
          )}
        </CardHeader>
      </ViewCard>
    </MikroRGBView.Smart>
  );
};

export default TheCard;
