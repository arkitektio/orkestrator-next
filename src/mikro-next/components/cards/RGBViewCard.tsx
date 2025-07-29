import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroRGBView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { closest } from "color-2-name";
import { ColorMap, GetImageDocument, RgbViewFragment, useUpdateRgbViewMutation } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";
import { Button } from "@/components/ui/button";
import { useCalculateMinMaxFor } from "../render/calculations/calculateMinMax";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Scale3DIcon } from "lucide-react";

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

  const [updateRgbView]= useUpdateRgbViewMutation({ variables: { input: { id: view.id } }, refetchQueries: [GetImageDocument] });

  const calculate = useCalculateMinMaxFor(view);

  return (
    <MikroRGBView.Smart object={view?.id}>
      <ViewCard view={view} className="flex flex-row p-2 justify-between" >
        <CardHeader className="flex flex-col gap-1">
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

          {view.contrastLimitMin || view.contrastLimitMax ? (
            <p className="text-xs text-foreground-muted">
              Contrast: {view.contrastLimitMin} - {view.contrastLimitMax}
            </p>
          ) : null}

          
        </CardHeader>
        <Button onClick={() => {
            const abortSignal = new AbortController().signal;
            calculate(abortSignal).then((result) => {;
              updateRgbView({
                variables: {
                  input: {
                    id: view.id,
                    contrastLimitMin: result.min,
                    contrastLimitMax: result.max,
                  },
                },
              })
            }).catch((error) => {
              console.error("Error calculating min/max:", error);
              alert("Failed to calculate min/max values.");
            });
          }} variant={"outline"} size="icon" className="ml-2 h-8 w-8">
            <Scale3DIcon className="mr-2" />
          </Button>
      </ViewCard>
    </MikroRGBView.Smart>
  );
};

export default TheCard;
