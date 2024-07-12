import { ChoicesField } from "@/components/fields/ChoicesField";
import { SwitchField } from "@/components/fields/SwitchField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import { cn } from "@/lib/utils";
import {
  ColorMap,
  ListRgbContextFragment,
  RgbViewFragment,
  ZarrStoreFragment,
  useCreateRgbContextMutation,
  useUpdateRgbContextMutation,
} from "@/mikro-next/api/graphql";
import { ImageView, useXarray } from "@/mikro-next/providers/xarray/context";
import {
  AvailableColormap,
  XArrayProvider,
} from "@/mikro-next/providers/xarray/provider";
import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useMeasure from "react-use-measure";
import { useImageArray, useTwoDContext } from "./hooks/useArray";
import { useDeleteCache, useViewRenderFunction } from "./hooks/useViewRender";

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

export const viewHasher = (view: RgbViewFragment) => {
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
  const [imageData, setImageData] = useState<ImageBitmap | null>(null);
  const [cachedDims, setCachedDims] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const calculateImageData = async () => {
    // Sequentially render each view to ensure proper blending
    // Fetch all ImageData objects for the views

    const imageDataArray = await Promise.all(
      context.views
        .filter((v) => v.active)
        .map((view) => renderView(view, 0, 0)),
    );

    // Additively blend the ImageData objects
    if (imageDataArray.length === 0) {
      return;
    }
    const blendedImageData = additiveBlending(imageDataArray);
    let bitmap = await createImageBitmap(blendedImageData);

    setImageData(bitmap);
  };

  useEffect(() => {
    calculateImageData();
  }, context.views.map(viewHasher));

  const renderLayers = async (
    canvas: HTMLCanvasElement,
    bitmap: ImageBitmap,
    width: number,
    height: number,
  ) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
    setCachedDims({ width, height });
  };

  useEffect(() => {
    if (
      imageData &&
      layerRef.current &&
      cachedDims.height !== height &&
      cachedDims.width !== width
    ) {
      renderLayers(layerRef.current, imageData, width, height);
    }
  }, [layerRef.current, imageData, width, height]);

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
    </>
  );
};

export const TestImageDataDetail = ({
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
  const [imageData, setImageData] = useState<ImageBitmap | null>(null);

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

  const calculateImageData = async (activeViews: RgbViewFragment[]) => {
    // Sequentially render each view to ensure proper blending
    // Fetch all ImageData objects for the views
    const imageDataArray = await Promise.all(
      activeViews.filter((v) => v.active).map((view) => renderView(view, 0, 0)),
    );

    // Additively blend the ImageData objects
    if (imageDataArray.length === 0) {
      return;
    }
    const blendedImageData = additiveBlending(imageDataArray);
    let bitmap = await createImageBitmap(blendedImageData);

    setImageData(bitmap);
  };

  useEffect(() => {
    console.log("Calculating image data", activeViews.map(viewHasher));
    calculateImageData(activeViews);
  }, activeViews.map(viewHasher));

  const renderLayers = async (
    canvas: HTMLCanvasElement,
    bitmap: ImageBitmap,
    width: number,
    height: number,
  ) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
  };

  useEffect(() => {
    if (imageData && layerRef.current) {
      renderLayers(layerRef.current, imageData, width, height);
    }
  }, [layerRef.current, imageData, width, height]);

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
    </>
  );
};

export const CanvasRender = ({
  image,
  width,
  height,
}: {
  image?: ImageBitmap | null;
  width: number;
  height: number;
}) => {
  const layerRef = useRef<HTMLCanvasElement>(null);

  const renderLayers = async (
    canvas: HTMLCanvasElement,
    bitmap: ImageBitmap,
    width: number,
    height: number,
  ) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.drawImage(
        bitmap,
        0,
        0,
        bitmap.width,
        bitmap.height,
        0,
        0,
        bitmap.width,
        bitmap.height,
      );
    }
  };

  useEffect(() => {
    if (image && layerRef.current) {
      renderLayers(layerRef.current, image, width, height);
    }
  }, [layerRef.current, image, width, height]);

  return (
    <>
      <canvas
        id={"image"}
        width={width}
        height={height}
        ref={layerRef}
        className="absolute top-0 left-0"
      ></canvas>
    </>
  );
};

export const DynamicCanvasRenderer = (props: {
  image?: ImageBitmap | null;
}) => {
  const [ref, bounds] = useMeasure({
    debounce: 100,
  });

  return (
    <div ref={ref} className="w-full h-full relative">
      <CanvasRender
        image={props.image}
        width={bounds.width}
        height={bounds.height}
      />
    </div>
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

export function bitmapToBlob(bitmap: ImageBitmap) {
  return new Promise<Blob>((resolve, reject) => {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    // Draw the bitmap onto the canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }
    ctx.drawImage(bitmap, 0, 0);

    // Convert the canvas content to a blob
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Conversion to Blob failed."));
      }
    }, "image/png"); // You can specify the image format here
  });
}

export const TwoDRGBRenderDetail = ({
  context,
  className,
  follow = "width",
}: RGBDProps) => {
  const { renderView } = useViewRenderFunction();
  const { deleteCache } = useDeleteCache();
  const [imageData, setImageData] = useState<ImageBitmap | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const causeUpload = useMediaUpload();

  const [create] = useCreateRgbContextMutation();
  const [update] = useUpdateRgbContextMutation();

  const createNewView = async (data: ListRgbContextFragment) => {
    if (!imageData) {
      return;
    }

    const blob = await bitmapToBlob(imageData);
    const file = new File([blob], `context-${context.image.id}-thumbnail.png`, {
      type: "image/png",
    });

    let thumbnail = await causeUpload(file);

    create({
      variables: {
        input: {
          name: "New View",
          image: context.image.id,
          thumbnail: thumbnail,
          views: data.views.map((view) => {
            return {
              colorMap: view.colorMap,
              cMax: view.cMax || 1,
              cMin: view.cMin || 0,
              active: view.active,
              rescale: view.rescale,
            };
          }),
        },
      },
    });
  };

  const updateNewView = async (data: ListRgbContextFragment) => {
    if (!imageData) {
      return;
    }

    const blob = await bitmapToBlob(imageData);
    const file = new File([blob], `context-${context.image.id}-thumbnail.png`, {
      type: "image/png",
    });

    let thumbnail = await causeUpload(file);

    update({
      variables: {
        input: {
          id: context.id,
          thumbnail: thumbnail,
          views: data.views.map((view) => {
            return {
              colorMap: view.colorMap,
              cMax: view.cMax || 1,
              cMin: view.cMin || 0,
              active: view.active,
              rescale: view.rescale,
            };
          }),
        },
      },
    });
  };

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

  const onSubmit = (data: ListRgbContextFragment) => {
    createNewView(data);
  };

  const calculateImageData = async (activeViews: RgbViewFragment[]) => {
    // Sequentially render each view to ensure proper blending
    // Fetch all ImageData objects for the views
    setIsRendering(true);

    const imageDataArray = await Promise.all(
      activeViews.filter((v) => v.active).map((view) => renderView(view, 0, 0)),
    );

    // Additively blend the ImageData objects
    if (imageDataArray.length === 0) {
      return;
    }
    const blendedImageData = additiveBlending(imageDataArray);
    let bitmap = await createImageBitmap(blendedImageData);

    setImageData(bitmap);
    setIsRendering(false);
  };

  useEffect(() => {
    calculateImageData(activeViews);
  }, activeViews.map(viewHasher));

  console.log("Rerendering 2D offcanvas", context.views);

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
    <div>
      <div className="flex flex-row w-full h-full p-3 gap-2">
        <Card className="flex-initial p-3 flex flex-col gap-1">
          <Form {...myform}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex h-full">
              <div className="flex flex-col gap-1 h-full">
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="flex-initial p-3 data-[active=false]:opacity-50 opacity-100 transition-opacity"
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
                <div className="flex-grow"></div>
                {availableImages.map((image) => {
                  let cSize = image.store.shape?.at(0) || 0;

                  let array = new Array(cSize).fill(0);

                  return (
                    <Card key={image.id} className="p-3">
                      {array.map((x, i) => (
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
                            });
                          }}
                        >
                          Add View for {i}
                        </Button>
                      ))}
                    </Card>
                  );
                })}
                <Button type="submit" disabled={isRendering}>
                  Submit
                </Button>
                <Button onClick={() => updateNewView(myform.getValues())}>
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </Card>

        <div className={cn("flex-1 w-full overflow-hidden", className)}>
          <DynamicCanvasRenderer image={imageData} />
        </div>
      </div>
    </div>
  );
};
