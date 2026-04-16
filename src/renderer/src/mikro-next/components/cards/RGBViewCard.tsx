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

import { Slider } from "@/components/ui/slider";
import { useDebounce } from "@/hooks/use-debounce";
import { enumToOptions } from "@/lib/utils";
import { MikroRGBView } from "@/linkers";

import {
  ChevronDown,
  Scale3DIcon,
  Eye,
  EyeOff,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useEffect, useState } from "react";
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
}

export const baseColorToRGB = (baseColor: number[] | undefined | null) => {
  const r = baseColor?.at(0) || 0;
  const g = baseColor?.at(1) || 0;
  const b = baseColor?.at(2) || 0;
  return `rgb(${r}, ${g}, ${b})`;
};

export const baseColorToName = (baseColor: number[] | undefined | null) => {
  const rgb = baseColorToRGB(baseColor);
  return rgb;
};

export const baseColorToRGBObject = (
  baseColor: number[] | undefined | null,
) => {
  return {
    r: baseColor?.at(0) || 0,
    g: baseColor?.at(1) || 0,
    b: baseColor?.at(2) || 0,
  };
};

const colorMapOptions = enumToOptions(ColorMap).map((option) => ({
  value: option.value,
  label: option.label,
}));

const TheCard = ({ view }: Props) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getImageMinMax = () => {
    const dtype = view.image?.store?.dtype;
    if (!dtype) return { min: 0, max: 65535 };

    switch (dtype) {
      case "uint8":
        return { min: 0, max: 255 };
      case "uint16":
        return { min: 0, max: 65535 };
      case "uint32":
        return { min: 0, max: 4294967295 };
      case "int8":
        return { min: 0, max: 127 };
      case "int16":
        return { min: 0, max: 32767 };
      case "int32":
        return { min: 0, max: 2147483647 };
      case "float32":
      case "float64":
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
      });
    }
  }, [
    debouncedContrastValues,
    view.contrastLimitMin,
    view.contrastLimitMax,
    view.id,
    updateRgbView,
    imageMin,
    imageMax,
  ]);

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
    });
  };

  const handleColorChange = (color: { r: number; g: number; b: number }) => {
    const r = Math.round(color.r);
    const g = Math.round(color.g);
    const b = Math.round(color.b);
    updateRgbView({
      variables: {
        input: {
          id: view.id,
          baseColor: [r, g, b],
        },
      },
    }).catch((error) => {
      console.error("Error updating base color:", error);
    });
  };

  const gradientStyle = useMemo(() => {
    const rgb = baseColorToRGBObject(view.baseColor);
    return {
      background: `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.02) 100%)`,
    };
  }, [view.baseColor]);

  return (
    <ViewCard
      view={view}
      className={`group overflow-hidden transition-all duration-200 ${
        view.active ? "shadow-sm" : "opacity-50"
      }`}
      style={gradientStyle}
    >
      <div className="px-2 py-1.5" style={gradientStyle}>
        {/* Compact single row: color dot, label, actions */}
        <div className="flex items-center gap-2 w-full">
          {/* Color indicator dot */}
          <span
            className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-black/10"
            style={{ backgroundColor: baseColorToRGB(view.baseColor) }}
          />

          {/* Channel label + colormap */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-xs font-medium truncate">
              Ch {view.cMin}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-[10px] text-muted-foreground hover:text-foreground truncate transition-colors">
                  {view.colorMap === ColorMap.Intensity
                    ? "Intensity"
                    : view.colorMap}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                {colorMapOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleColorMapChange(option.value)}
                    className={
                      view.colorMap === option.value
                        ? "bg-accent font-medium"
                        : ""
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: compact action icons */}
          <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <MikroRGBView.ObjectButton
              object={view}
              collection="rescale"
              onDone={() => getRgbView()}
              className="flex-shrink-0"
              ephemeral
            >
              <button
                className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Rescale"
              >
                <Scale3DIcon className="h-3 w-3" />
              </button>
            </MikroRGBView.ObjectButton>
            <button
              onClick={handleToggleActive}
              className={`h-6 w-6 flex items-center justify-center rounded transition-colors ${
                view.active
                  ? "text-foreground hover:text-foreground/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Toggle visibility"
            >
              {view.active ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable settings: contrast slider */}
        <Collapsible
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1.5 mt-1 text-muted-foreground hover:text-foreground transition-colors w-full">
              <SlidersHorizontal className="h-2.5 w-2.5" />
              <span className="text-[10px]">
                {contrastValues[0].toFixed(0)}–{contrastValues[1].toFixed(0)}
              </span>
              <ChevronDown
                className={`h-2.5 w-2.5 ml-auto transition-transform duration-200 ${
                  isSettingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <Slider
              value={contrastValues}
              onValueChange={handleContrastChange}
              min={imageMin}
              max={imageMax}
              step={1}
              className="w-full mt-1.5 mb-0.5"
            />
            {view.colorMap === ColorMap.Intensity && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground">Base Color</span>
                <RgbColorPicker
                  color={baseColorToRGBObject(view.baseColor)}
                  onChange={handleColorChange}
                  style={{ width: "100%", height: 80 }}
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ViewCard>
  );
};

export default TheCard;
