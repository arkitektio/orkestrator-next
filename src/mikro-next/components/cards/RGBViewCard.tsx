import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroRGBView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { closest } from "color-2-name";
import { ColorMap, GetImageDocument, RgbViewFragment, useUpdateRgbViewMutation } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";
import { Button } from "@/components/ui/button";
import { useCalculateMinMaxFor } from "../render/calculations/calculateMinMax";
import { Scale3DIcon, Edit2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { enumToOptions } from "@/lib/utils";

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

// Available colormap options
const colorMapOptions = enumToOptions(ColorMap).map((option) => ({
  value: option.value,
  label: option.label,
}));

const TheCard = ({ view }: Props) => {

  const [updateRgbView]= useUpdateRgbViewMutation({ variables: { input: { id: view.id } }, refetchQueries: [GetImageDocument] });

  const calculate = useCalculateMinMaxFor(view);

  const handleColorMapChange = (newColorMap: ColorMap) => {
    updateRgbView({
      variables: {
        input: {
          id: view.id,
          colorMap: newColorMap,
        },
      },
    }).catch((error) => {
      console.error("Error updating colormap:", error);
      alert("Failed to update colormap.");
    });
  };

  return (
    <MikroRGBView.Smart object={view?.id}>
      <ViewCard view={view} className="flex flex-row p-2 justify-between" >
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="flex w-full items-center gap-2">
            Channel {view.cMin}{" "}
            {view.colorMap == ColorMap.Intensity && (
              <div
                className="w-2 h-2 rounded rounded-full"
                style={{ backgroundColor: baseColorToRGB(view.baseColor) }}
              ></div>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {view.colorMap == ColorMap.Intensity ? (
              <p className="text-xs text-foreground-muted">
                {baseColorToName(view.baseColor)}
              </p>
            ) : (
              <p className="text-xs text-foreground-muted">{view.colorMap}</p>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {colorMapOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleColorMapChange(option.value)}
                    className={view.colorMap === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
