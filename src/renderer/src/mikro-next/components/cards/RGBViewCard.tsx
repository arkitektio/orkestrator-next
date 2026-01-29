import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/use-debounce";
import { enumToOptions } from "@/lib/utils";
import { MikroRGBView } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { Edit2, Scale3DIcon, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { RgbColorPicker } from "react-colorful";
import {
  ColorMap,
  GetImageDocument,
  RgbViewFragment,
  useGetRgbViewLazyQuery,
  useUpdateRgbViewMutation,
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: RgbViewFragment;
  mates?: MateFinder[];
}

export const baseColorToRGB = (baseColor: number[] | undefined | null) => {
  const r = baseColor?.at(0) || 0;
  const g = baseColor?.at(1) || 0;
  const b = baseColor?.at(2) || 0;
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
  const [isContrastExpanded, setIsContrastExpanded] = useState(false);

  // Helper function to calculate min/max values from image dtype
  const getImageMinMax = () => {
    const dtype = view.image?.store?.dtype;
    if (!dtype) return { min: 0, max: 65535 }; // Default fallback

    switch (dtype) {
      case 'uint8':
        return { min: 0, max: 255 };
      case 'uint16':
        return { min: 0, max: 65535 };
      case 'uint32':
        return { min: 0, max: 4294967295 };
      case 'int8':
        return { min: 0, max: 127 };
      case 'int16':
        return { min: 0, max: 32767 };
      case 'int32':
        return { min: 0, max: 2147483647 };
      case 'float32':
      case 'float64':
        return { min: 0, max: 1 };
      default:
        return { min: 0, max: 65535 };
    }
  };

  const { min: imageMin, max: imageMax } = getImageMinMax();

  const [contrastValues, setContrastValues] = useState<[number, number]>([
    view.contrastLimitMin ?? imageMin,
    view.contrastLimitMax ?? imageMax,
  ]);

  const [updateRgbView] = useUpdateRgbViewMutation({
    variables: { input: { id: view.id } },
    refetchQueries: [GetImageDocument],
  });

  const debouncedContrastValues = useDebounce(contrastValues, 300);

  const [getRgbView] = useGetRgbViewLazyQuery({
    variables: { id: view.id },
    fetchPolicy: "network-only",
  });

  // Handle debounced contrast updates
  useEffect(() => {
    const currentMin = view.contrastLimitMin ?? imageMin;
    const currentMax = view.contrastLimitMax ?? imageMax;

    if (
      debouncedContrastValues[0] !== currentMin ||
      debouncedContrastValues[1] !== currentMax
    ) {
      updateRgbView({
        variables: {
          input: {
            id: view.id,
            contrastLimitMin: debouncedContrastValues[0],
            contrastLimitMax: debouncedContrastValues[1],
          },
        },
      }).catch((error) => {
        console.error("Error updating contrast limits:", error);
        alert("Failed to update contrast limits.");
      });
    }
  }, [debouncedContrastValues, view.contrastLimitMin, view.contrastLimitMax, view.id, updateRgbView, imageMin, imageMax]);

  const handleContrastChange = (values: number[]) => {
    setContrastValues([values[0], values[1]]);
  };

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

  const handleToggleActive = () => {
    updateRgbView({
      variables: {
        input: {
          id: view.id,
          active: !view.active,
        },
      },
    }).catch((error) => {
      console.error("Error toggling active state:", error);
      alert("Failed to toggle active state.");
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
    <ViewCard view={view} className="group flex flex-rowjustify-between">
      <CardHeader className="flex flex-col justify-between w-full">
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
          <MikroRGBView.ObjectButton
            object={view.id}
            collection="rescale"
            onDone={() => {
              getRgbView();
            }}
            className="flex-shrink-0"
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
          <Button
            onClick={() => handleToggleActive()}
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Toggle View Visibility"
          >
            {view.active ? "👁️" : "🚫"}
          </Button>
        </CardTitle>
        <div className="flex items-center gap-2 w-full">
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

        {/* Collapsible Contrast Slider */}
        <Collapsible
          open={isContrastExpanded}
          onOpenChange={setIsContrastExpanded}
          className="space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Contrast
                </span>
                <span className="text-xs text-muted-foreground">
                  {contrastValues[0].toFixed(0)} - {contrastValues[1].toFixed(0)}
                </span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isContrastExpanded ? "rotate-180" : ""
                  }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <Slider
              value={contrastValues}
              onValueChange={handleContrastChange}
              min={imageMin}
              max={imageMax}
              step={1}
              className="w-full"
            />
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </ViewCard>
  );
};

export default TheCard;
