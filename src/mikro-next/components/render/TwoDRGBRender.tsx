import { SaveParentSize } from "@/components/layout/SaveParentSize";
import { cn } from "@/lib/utils";
import {
  ColorMap,
  ListRgbContextFragment,
  RgbContext,
  RgbViewFragment,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { ImageView, useXarray } from "@/mikro-next/providers/xarray/context";
import {
  AvailableColormap,
  XArrayProvider,
} from "@/mikro-next/providers/xarray/provider";
import { useView } from "@/providers/view/ViewContext";
import { vi } from "date-fns/locale";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

export interface RGBDProps {
  context: ListRgbContextFragment;
  className?: string;
  follow?: "width" | "height";
}

export type CLims = {
  cmin: number | undefined;
  cmax: number | undefined;
};

export const Canvas: React.FC<{
  width: number;
  height: number;
  view: RgbViewFragment;
}> = ({ width, height, view }) => {
  const layerRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [imageView, setImageView] = useState<ImageView | undefined>();
  const { getSelectionAsImageView, renderImageView } = useXarray();

  const downloadImage = async (view: RgbViewFragment) => {
    try {
      let imageView = await getSelectionAsImageView(view.image.store, [
        view.cMin || 0,
        0,
        0,
        ":",
        ":",
      ]);
      console.log("Got image view", imageView);
      setImageView((image) => imageView);
    } catch (e) {
      console.error(e);
    }
  };

  const renderImage = async (
    imageView: ImageView,
    colormap: AvailableColormap,
    cmin?: number | null,
    cmax?: number | null,
  ) => {
    try {
      let image = await renderImageView(imageView, colormap, cmin, cmax, 1);
      setImageData(image);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (imageView) {
      renderImage(
        imageView,
        colorMapToColormap(view.colorMap),
        view.contrastLimitMin,
        view.contrastLimitMax,
      );
    } else if (imageView) {
      renderImage(imageView, colorMapToColormap(view.colorMap));
    } else {
      console.log("No image view to render");
    }
  }, [imageView, view]);

  useEffect(() => {
    console.log("Loading image view...", view);
    downloadImage(view);
  }, [view]);

  useEffect(() => {
    if (layerRef.current && imageData) {
      let ctx = layerRef?.current?.getContext("2d");
      if (!ctx) {
        console.log("No context");
        return;
      }
      ctx.putImageData(imageData, 0, 0);
      console.log("Drawn image");
    }
  }, [layerRef.current, imageData, height, width]);

  return (
    <canvas
      id={view.id}
      width={width}
      height={height}
      ref={layerRef}
      className="absolute top-0 left-0"
    ></canvas>
  );
};

export const colorMapToColormap = (colorMap: ColorMap): AvailableColormap => {
  switch (colorMap) {
    case ColorMap.Red:
      return "freesurface-red";
    case ColorMap.Green:
      return "greens";
    case ColorMap.Blue:
      return "freesurface-blue";
    case ColorMap.Inferno:
      return "hot";

    default:
      return "viridis";
  }
};

export const TwoDRGBRender = ({
  context,
  className,
  follow = "width",
}: RGBDProps) => {
  if (!context.views || context.views.length === 0) {
    return null;
  }

  console.log("Rerendering 2D offcanvas", context.views);

  const [ref, bounds] = useMeasure({
    debounce: 100,
  });

  console.log(bounds);

  return (
    <XArrayProvider>
      <div ref={ref} className={cn("w-full h-full relative", className)}>
        {context.views.map((view) => (
          <Canvas view={view} width={bounds.width} height={bounds.height} />
        ))}
      </div>
    </XArrayProvider>
  );
};
