import { SaveParentSize } from "@/components/layout/SaveParentSize";
import { cn } from "@/lib/utils";
import {
  ColorMap,
  ListRgbContextFragment,
  RgbContext,
  RgbContextFragment,
  RgbViewFragment,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { ImageView, useXarray } from "@/mikro-next/providers/xarray/context";
import {
  AvailableColormap,
  XArrayProvider,
} from "@/mikro-next/providers/xarray/provider";
import { useView } from "@/providers/view/ViewContext";
import { ar, vi } from "date-fns/locale";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { useImageArray, useTwoDContext, useViewRender } from "./hooks/useArray";
import { context } from "react-three-fiber";
import { useDeleteCache, useViewRenderFunction } from "./hooks/useViewRender";
import { useFieldArray, useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StringField } from "@/components/fields/StringField";
import { Form } from "@/components/ui/form";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { SwitchField } from "@/components/fields/SwitchField";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export const TestArray = (props: { view: RgbViewFragment }) => {
  const array = useImageArray(props.view);

  return <div>{array?.max}</div>;
};

export const TestImageData = ({
  context,
  width,
  height,
}: {
  context: ListRgbContextFragment;
  width: number;
  height: number;
}) => {
  const layerRef = useRef<HTMLCanvasElement>(null);
  const imageData = useTwoDContext({ context: context, t: 0, z: 0 });

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
      id={context.id}
      width={width}
      height={height}
      ref={layerRef}
      className="absolute top-0 left-0"
    ></canvas>
  );
};

export const additiveBlending = (imageDataArray: ImageData[]) => {
  const newImageData = new ImageData(
    imageDataArray[0].width,
    imageDataArray[0].height,
  );

  for (let i = 0; i < imageDataArray[0].data.length; i++) {
    let sum = 0;
    for (let j = 0; j < imageDataArray.length; j++) {
      sum = sum + imageDataArray[j].data[i];
    }
    newImageData.data[i] = Math.min(sum, 255);
  }

  return newImageData;
};

const colorMapOptions = Object.values(ColorMap).map((x) => ({
  value: x,
  label: x,
}));

export const ContextForm = ({
  context,
  onSubmit,
}: {
  context: ListRgbContextFragment;
  onSubmit: (data: ListRgbContextFragment) => void;
}) => {
  const myform = useForm<ListRgbContextFragment>({
    defaultValues: context,
  });

  const { register, control, handleSubmit, watch, formState } = myform;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "views", // unique name for your Field Array
    },
  );

  return (
    <Form {...myform}>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div>
          <div className="flex flex-col gap-1">
            {fields.map((field, index) => {
              const isActive = watch(`views.${index}.active`);
              return (
                <Card
                  key={field.id}
                  className="p-3 data-[active=false]:opacity-50 opacity-100 transition-opacity"
                  data-active={isActive}
                >
                  <ChoicesField
                    name={`views.${index}.colorMap`}
                    options={colorMapOptions}
                    label="Color Map"
                  />

                  <SwitchField
                    name={`views.${index}.rescale`}
                    label="Rescale"
                  />
                  <SwitchField name={`views.${index}.active`} label="Active" />
                </Card>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              append({
                colorMap: ColorMap.Viridis,
                cMax: 1,
                cMin: 0,
                ...fields.at(0),
              });
            }}
          >
            Add View
          </button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

const viewHasher = (view: RgbViewFragment) => {
  return `${view.colorMap}-${view.active}-${view.rescale}`;
};

export const TestImageDataBlending = ({
  context,
  width,
  height,
}: {
  context: ListRgbContextFragment;
  width: number;
  height: number;
}) => {
  const layerRef = useRef<HTMLCanvasElement>(null);
  const { renderView } = useViewRenderFunction();
  const { deleteCache } = useDeleteCache();

  const myform = useForm<ListRgbContextFragment>({
    defaultValues: context,
  });

  const { register, control, handleSubmit, watch, formState } = myform;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "views", // unique name for your Field Array
    },
  );

  const activeViews = watch("views");

  const renderLayers = async () => {
    if (layerRef.current) {
      const ctx = layerRef.current.getContext("2d");
      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Sequentially render each view to ensure proper blending
        // Fetch all ImageData objects for the views
        const imageDataArray = await Promise.all(
          activeViews
            .filter((v) => v.active)
            .map((view) => renderView(view, 0, 0)),
        );

        // Additively blend the ImageData objects
        if (imageDataArray.length === 0) {
          return;
        }
        const blendedImageData = additiveBlending(imageDataArray);

        console.log("Blended image data", blendedImageData.data.slice(0, 40));
        let bitmap = await createImageBitmap(blendedImageData);

        ctx.drawImage(
          bitmap,
          0,
          0,
          bitmap.width,
          bitmap.height,
          0,
          0,
          width,
          height,
        );
      }
    }
  };

  useEffect(() => {
    renderLayers();
  }, [layerRef.current, activeViews.map(viewHasher), width, height]);

  let availableImages = activeViews.reduce(
    (acc, val) => {
      if (!acc.find((x) => x.id === val.image.id)) {
        acc.push(val.image);
      }
      return acc;
    },
    [] as { id: string; store: ZarrStoreFragment }[],
  );

  console.log("Available images", availableImages);

  return (
    <>
      <canvas
        onClick={() => deleteCache()}
        id={context.id}
        width={width}
        height={height}
        ref={layerRef}
        className="absolute top-0 left-0"
      ></canvas>
      <Card className="absolute top-1 left-1 p-3 flex flex-col gap-1">
        <Form {...myform}>
          <form onSubmit={handleSubmit((c) => console.log(e))} className="">
            <ScrollArea>
              <div className="flex flex-col gap-1">
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="p-3 data-[active=false]:opacity-50 opacity-100 transition-opacity"
                    data-active={watch(`views.${index}.active`)}
                  >
                    <ChoicesField
                      name={`views.${index}.colorMap`}
                      options={colorMapOptions}
                      label="Color Map"
                    />
                    <SwitchField
                      name={`views.${index}.active`}
                      label="Active"
                    />
                    <SwitchField
                      name={`views.${index}.rescale`}
                      label="Rescale"
                    />
                    {fields.length > 1 && (
                      <Button onClick={() => remove(index)}>Remove</Button>
                    )}
                  </Card>
                ))}
              </div>
              {availableImages.map((image) => {
                let cSize = image.store.shape?.at(0) || 0;

                let array = new Array(cSize).fill(0);

                return (
                  <Card key={image.id} className="p-3">
                    {array.map((i, x) => (
                      <Button
                        type="button"
                        onClick={() => {
                          append({
                            id: "FAKE_ID",
                            colorMap: ColorMap.Viridis,
                            cMax: i + 1,
                            cMin: i,
                            active: false,
                            rescale: false,
                            image: image,
                            fullColour: "rgb(0,0,0)",
                            context: context,
                          });
                        }}
                      >
                        Add View for {i}
                      </Button>
                    ))}
                  </Card>
                );
              })}
            </ScrollArea>
          </form>
        </Form>
      </Card>
    </>
  );
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
        <TestImageDataBlending
          context={context}
          width={bounds.width}
          height={bounds.height}
        />
      </div>
    </XArrayProvider>
  );
};
