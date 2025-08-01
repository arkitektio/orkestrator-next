import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroRGBView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { closest } from "color-2-name";
import {
  ColorMap,
  GetImageDocument,
  RgbViewFragment,
  useGetRgbViewLazyQuery,
  useGetRgbViewQuery,
  useUpdateRgbViewMutation,
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";
import { Button } from "@/components/ui/button";
import { useCalculateMinMaxFor } from "../render/calculations/calculateMinMax";
import { Scale3DIcon, Edit2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { enumToOptions } from "@/lib/utils";
import { RgbColorPicker } from "react-colorful";
import { useState } from "react";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";

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

// Convert baseColor array to react-colorful RGB format
export const baseColorToRGBObject = (
  baseColor: number[] | undefined | null,
) => {
  return {
    r: baseColor?.at(0) || 0,
    g: baseColor?.at(1) || 0,
    b: baseColor?.at(2) || 0,
  };
};

// Available colormap options
const colorMapOptions = enumToOptions(ColorMap).map((option) => ({
  value: option.value,
  label: option.label,
}));

const TheCard = ({ view }: Props) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const [updateRgbView] = useUpdateRgbViewMutation({
    variables: { input: { id: view.id } },
    refetchQueries: [GetImageDocument],
  });

  const [getRgbView] = useGetRgbViewLazyQuery({
    variables: { id: view.id },
    fetchPolicy: "network-only",
  });

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

  const handleColorChange = (color: { r: number; g: number; b: number }) => {
    // Extract RGB values from the color object
    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);
    const newBaseColor = [r, g, b];

    updateRgbView({
      variables: {
        input: {
          id: view.id,
          baseColor: newBaseColor,
        },
      },
    }).catch((error) => {
      console.error("Error updating base color:", error);
      alert("Failed to update base color.");
    });
  };

  return (
    <MikroRGBView.Smart object={view?.id}>
      <ViewCard view={view} className="group flex flex-row p-2 justify-between">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="flex w-full items-center gap-2">
            Channel {view.cMin}{" "}
            {view.colorMap == ColorMap.Intensity && (
              <Popover
                open={isColorPickerOpen}
                onOpenChange={setIsColorPickerOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    className="w-4 h-4 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
                    style={{ backgroundColor: baseColorToRGB(view.baseColor) }}
                    aria-label="Select base color"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <div className="space-y-3">
                    <RgbColorPicker
                      color={baseColorToRGBObject(view.baseColor)}
                      onChange={handleColorChange}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {baseColorToName(view.baseColor)}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 group-hover:opacity-100 opacity-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {colorMapOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleColorMapChange(option.value)}
                    className={
                      view.colorMap === option.value ? "bg-accent" : ""
                    }
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
        <MikroRGBView.ObjectButton
          object={view.id}
          collection="rescale"
          onDone={() => {
            getRgbView();
          }}
          ephemeral
        >
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Rescale RGB View"
          >
            <Scale3DIcon className="mr-2" />
          </Button>
        </MikroRGBView.ObjectButton>
      </ViewCard>
    </MikroRGBView.Smart>
  );
};

export default TheCard;
