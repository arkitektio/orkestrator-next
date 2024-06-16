import { cn } from "@/lib/utils";
import { ZarrStoreFragment } from "@/mikro-next/api/graphql";
import { ImageView, useXarray } from "@/mikro-next/providers/xarray/context";
import {
  AvailableColormap,
  XArrayProvider,
} from "@/mikro-next/providers/xarray/provider";
import { useView } from "@/providers/view/ViewContext";
import React, { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

export interface TwoDProps {
  store: ZarrStoreFragment;
  className?: string;
  colormap: AvailableColormap;
  follow?: "width" | "height";
}

export type CLims = {
  cmin: number | undefined;
  cmax: number | undefined;
};

export const Canvas: React.FC<{
  width: number;
  height: number;
  store: ZarrStoreFragment;
  colormap: AvailableColormap;
  c: number;
  t: number;
  z: number;
  clims?: CLims | undefined;
}> = ({ width, height, colormap, store, clims, c, t, z }) => {
  const layerRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<ImageBitmap | null>(null);
  const [imageView, setImageView] = useState<ImageView | undefined>();
  const { getSelectionAsImageView, renderImageView } = useXarray();

  const downloadImage = async (
    c: number,
    t: number,
    z: number,
    store: ZarrStoreFragment,
  ) => {
    try {
      let imageView = await getSelectionAsImageView(store, [c, t, z, ":", ":"]);
      console.log("Got image view", imageView);
      setImageView((image) => imageView);
    } catch (e) {
      console.error(e);
    }
  };

  const renderImage = async (
    imageView: ImageView,
    colormap: AvailableColormap,
    cmin?: number,
    cmax?: number,
  ) => {
    try {
      let image = await renderImageView(imageView, colormap, cmin, cmax);
      let bitmap = await createImageBitmap(image);
      setImageData(bitmap);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (imageView) {
      renderImage(imageView, colormap, clims?.cmin, clims?.cmax);
    } else if (imageView) {
      renderImage(imageView, colormap);
    }
  }, [imageView, colormap, clims]);

  useEffect(() => {
    console.log("Loading image slice...", store, c, t, z);
    downloadImage(c, t, z, store);
  }, [store, c, t, z]);

  useEffect(() => {
    if (layerRef.current && imageData) {
      let ctx = layerRef?.current?.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(
        imageData,
        0,
        0,
        imageData.width,
        imageData.height,
        0,
        0,
        width,
        height,
      );
    }
  }, [layerRef.current, imageData, height, width]);

  return (
    <canvas
      id="c"
      width={width}
      height={height}
      ref={layerRef}
      className="absolute top-0 left-0"
    ></canvas>
  );
};

export const TwoDViewCanvas = ({
  store,
  colormap,
  className,
  follow = "width",
}: TwoDProps) => {
  console.log("Rerendering 2D offcanvas", store);

  const [ref, bounds] = useMeasure({
    debounce: 100,
  });

  console.log(bounds);

  const { activeView } = useView();

  return (
    <XArrayProvider>
      <div ref={ref} className={cn("w-full h-full relative", className)}>
        <Canvas
          colormap={colormap}
          store={store}
          width={bounds.width}
          height={bounds.height}
          c={activeView.cMin || 0}
          t={activeView.tMin || 0}
          z={activeView.zMin || 0}
        />
      </div>
    </XArrayProvider>
  );
};

export const TwoDOffcanvas = ({
  store,
  colormap,
  className,
  follow = "width",
}: TwoDProps) => {
  if (!store.shape) {
    return null;
  }

  console.log("Rerendering 2D offcanvas", store);

  const [ref, bounds] = useMeasure({
    debounce: 100,
  });

  console.log(bounds);

  return (
    <XArrayProvider>
      <div ref={ref} className={cn("w-full h-full relative", className)}>
        <Canvas
          colormap={colormap}
          store={store}
          width={bounds.width}
          height={bounds.height}
          c={0}
          t={0}
          z={0}
        />
      </div>
    </XArrayProvider>
  );
};
