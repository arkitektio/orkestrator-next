import { Arkitekt, useMikro } from "@/arkitekt/Arkitekt";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Fakts } from "@/lib/fakts";
import { cn } from "@/lib/utils";
import {
  ColorMap,
  ListRgbContextFragment,
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  RgbViewFragment,
  ZarrStoreFragment,
} from "@/mikro-next/api/graphql";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import {
  AdditiveColormap3DExtensions,
  AdditiveColormapExtension,
  ColorPalette3DExtensions,
  getChannelStats,
  LensExtension,
  PictureInPictureViewer,
  RENDERING_MODES,
  VivViewer,
  VolumeViewer,
  ZarrPixelSource,
} from "@hms-dbmi/viv";
import { Matrix4 } from "@math.gl/core";
import { AwsClient } from "aws4fetch";
import { Layers } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BiCuboid } from "react-icons/bi";
import useMeasure from "react-use-measure";
import { openGroup, ZarrArray } from "zarr";
import { LRUIndexedDBCache } from "./VivCache";
import { VivS3Store } from "./VivStore";
import DeckGL from "deck.gl";
import { PolygonLayer } from "@deck.gl/layers";

export function isInterleaved(shape: number[]) {
  const lastDimSize = shape[shape.length - 1];
  return lastDimSize === 3 || lastDimSize === 4;
}

export function prevPowerOf2(x: number) {
  return 2 ** Math.floor(Math.log2(x));
}

export function guessTileSize(arr: ZarrArray) {
  const interleaved = isInterleaved(arr.shape);
  const [yChunk, xChunk] = arr.chunks.slice(interleaved ? -3 : -2);
  const size = Math.min(yChunk, xChunk);
  // deck.gl requirement for power-of-two tile size.
  return prevPowerOf2(size);
}

const cache = new LRUIndexedDBCache("s3-cache-db", "items", 1000);

const createPixelSource = async (
  image: { id: string; store: ZarrStoreFragment },
  endpointUrl: string,
  aws: AwsClient,
  cache: LRUIndexedDBCache,
) => {
  let path = endpointUrl + "/" + image.store.bucket + "/" + image.store.key;

  let store = new VivS3Store(path, aws, cache);
  let group = await openGroup(store, "", "r");
  let array = (await group.getItem("data")) as ZarrArray;
  let labels = ["c", "t", "z", "y", "x"];
  const tileSize = guessTileSize(array);

  return new ZarrPixelSource(array, labels, tileSize);
};

const mikroLoader = async (
  client: ApolloClient<NormalizedCache>,
  fakts: Fakts,
  context: ListRgbContextFragment,
) => {
  let endpoint_url = (fakts?.datalayer as any)?.endpoint_url;
  if (endpoint_url === undefined) {
    throw Error("No datalayer found");
  }

  let x = await client?.mutate<
    RequestAccessMutation,
    RequestAccessMutationVariables
  >({
    mutation: RequestAccessDocument,
    variables: { store: context.image.store.id },
  });
  let data = x?.data;

  if (!data?.requestAccess) {
    throw Error("No credentials loaded");
  }

  let credentials = data.requestAccess;

  let aws = new AwsClient({
    accessKeyId: credentials.accessKey,
    secretAccessKey: credentials.secretKey,
    sessionToken: credentials.sessionToken,
    service: "s3",
  });

  let sources: ZarrPixelSource<any>[] = [];

  let primary = await createPixelSource(
    context.image,
    endpoint_url,
    aws,
    cache,
  );

  sources.push(primary);

  for (let view of context.image.derivedScaleViews) {
    console.log("Adding view", view);
    let source = await createPixelSource(view.image, endpoint_url, aws, cache);
    sources.push(source);
  }

  return {
    data: sources,
    metadata: {},
  };
};

const viewState = {
  zoom: 2,
  target: [0, 0, 0],
  camera: [0, 0, 0],
  rotation: [0, 0, 0],
  mode: "3d",
};

export function get3DExtension(colormap, renderingMode) {
  const extensions = colormap
    ? AdditiveColormap3DExtensions
    : ColorPalette3DExtensions;
  if (renderingMode === RENDERING_MODES.MAX_INTENSITY_PROJECTION) {
    return new extensions.MaximumIntensityProjectionExtension();
  }
  if (renderingMode === RENDERING_MODES.MIN_INTENSITY_PROJECTION) {
    return new extensions.MinimumIntensityProjectionExtension();
  }
  if (renderingMode === RENDERING_MODES.ADDITIVE) {
    return new extensions.AdditiveBlendExtension();
  }
  throw new Error(`${renderingMode} rendering mode not supported`);
}

const mapToRgbColor = (view: RgbViewFragment) => {
  switch (view.colorMap) {
    case ColorMap.Red:
      return [255, 0, 0];
    case ColorMap.Green:
      return [0, 255, 0];
    case ColorMap.Blue:
      return [0, 0, 255];
    default:
      return (view.baseColor || [255, 255, 255]).slice(0, 3);
  }
};

const dtypeToMax = (
  dtype:
    | "Uint8"
    | "Uint16"
    | "Uint32"
    | "Float32"
    | "Float64"
    | "Int8"
    | "Int16"
    | "Int32",
) => {
  switch (dtype) {
    case "Uint8":
      return 255;
    case "Uint16":
      return 65535;
    case "Uint32":
      return 4294967295;
    case "Float32":
      return 1;
    case "Float64":
      return 1;
    case "Int8":
      return 127;
    case "Int16":
      return 32767;
    case "Int32":
      return 2147483647;
    default:
      return 1;
  }
};

const isImageRenderable = (image: { store: ZarrStoreFragment }) => {
  let shape_size = (image.store?.shape || []).reduce((a, b) => a * b, 1);
  console.log("shape_size", shape_size);
  return shape_size < 1000 * 1000 * 200;
};
export function getPhysicalSizeScalingMatrix(x, y, z) {
  const ratio = [x, y, z];
  return new Matrix4().scale(ratio);
}

const rectangles = [
  {
    coordinates: [
      [100, 40.1], // top-left corner
      [400, 400], // top-right corner
      [800, 800], // bottom-right corner
      [1400, 1400], // bottom-left corner
    ],
  },
];

export const VivRenderer = ({
  context,
  modelMatrix,
}: {
  context: ListRgbContextFragment;
  modelMatrix?: Matrix4;
}) => {
  const client = useMikro();
  const fakts = Arkitekt.useFakts();

  const [viewport, setViewport] = useState(null);
  const [autoContrast, setAutoContrast] = useState(true);

  const [threeD, setThreeD] = useState(false);
  const [source, setSource] = useState<ZarrPixelSource<any>[] | null>(null);
  const [resolution, setResolution] = useState(
    Math.max(0, context.image.derivedScaleViews.length),
  ); // 0 is the highest resolution

  const [autoContrastLimits, setAutoContrastLimits] = useState<
    number[][] | undefined
  >(undefined);

  const [t, setT] = useState(0);
  const [z, setZ] = useState(0);

  const onViewPortLoaded = async (viewport) => {
    const channelStates = await Promise.all(
      viewport.data.map((loader) => getChannelStats(loader)),
    );

    console.log("channelStates", channelStates);

    const limits = channelStates.map((stats) => stats.contrastLimits);

    console.log("limits", limits);
    setAutoContrastLimits(limits);
  };

  useEffect(() => {
    if (viewport) {
      console.log(viewport);
      onViewPortLoaded(viewport);
    }
  }, [viewport]);

  useEffect(() => {
    mikroLoader(client, fakts, context)
      .then((source) => {
        console.log("source", source);
        setSource(source.data);
      })
      .catch((e) => {
        alert(e);
      });
  }, [context]);

  const [ref, bounds] = useMeasure({
    debounce: 100,
  });

  const roiLayer = useMemo(() => {
    // Define the Deck.gl layer for rectangles
    const rectangleLayer = new PolygonLayer({
      id: "rectangle-layer",
      data: rectangles,
      getPolygon: (d) => d.coordinates,
      getFillColor: [0, 0, 255, 80],
      getLineColor: [0, 0, 255],
      getLineWidth: 500,
      lineWidthMinPixels: 1,
    });
    return rectangleLayer;
  }, [rectangles]);

  const singleChannel = context.views.length === 1;

  const maxType = dtypeToMax(source?.at(0)?.dtype || "Float32");

  const selections = useMemo(() => {
    return context.views.map((v) => {
      return { z: z, t: t, c: v.cMin };
    });
  }, [context.views, t, z]);

  return (
    <>
      <div
        className="w-full h-full relative bg-black overflow-hidden"
        ref={ref}
      >
        {source != null && bounds.width > 0 && (
          <>
            {threeD ? (
              <VolumeViewer
                contrastLimits={
                  autoContrast
                    ? autoContrastLimits ||
                      context.views.map((v) => [0, maxType])
                    : context.views.map((v) => [0, maxType])
                }
                loader={source}
                channelsVisible={context.views.map((v) => v.active)}
                height={bounds.height}
                selections={selections}
                modelMatrix={
                  modelMatrix || getPhysicalSizeScalingMatrix(1, 1, 1)
                }
                overview={true}
                resolution={resolution}
                overviewOn={true}
                colormap={singleChannel ? "viridis" : undefined}
                extensions={[
                  get3DExtension(
                    singleChannel ? "viridis" : undefined,
                    RENDERING_MODES.ADDITIVE,
                  ),
                ]}
                width={bounds.width}
                colors={context.views.map(mapToRgbColor)}
                viewStates={[viewState]}
              />
            ) : (
              <PictureInPictureViewer
                contrastLimits={
                  autoContrast
                    ? autoContrastLimits ||
                      context.views.map((v) => [0, maxType])
                    : context.views.map((v) => [0, maxType])
                }
                loader={source}
                channelsVisible={context.views.map((v) => v.active)}
                height={bounds.height}
                selections={selections}
                overview={true}
                modelMatrix={getPhysicalSizeScalingMatrix(1, 1, 1)}
                overviewOn={false}
                extensions={[
                  singleChannel
                    ? new AdditiveColormapExtension()
                    : new LensExtension(),
                ]}
                colormap={singleChannel ? "viridis" : undefined}
                width={bounds.width}
                colors={context.views.map(mapToRgbColor)}
                viewStates={[viewState]}
                onViewportLoad={(viewport) => {
                  setViewport(viewport);
                }}
                onHover={(hover) => {
                  console.log(hover);
                }}
              />
            )}
          </>
        )}
        <div className="absolute bottom-0 right-0 p-3 w-full flex flex-row gap-2">
          {!autoContrastLimits && <>Loading</>}
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => setThreeD(!threeD)}
            className="flex-initial  w-6 h-6 p-1"
          >
            {threeD ? <BiCuboid /> : <Layers />}
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => setAutoContrast(!autoContrast)}
            className="flex-initial  w-6 h-6 p-1"
          >
            Auto
          </Button>
          {threeD && (
            <div className="flex flex-initial">
              {context.image.derivedScaleViews.length > 0 && (
                <Button
                  variant="outline"
                  size={"icon"}
                  onClick={() => setResolution(0)}
                  className={cn(
                    "w-6 h-6 p-2",
                    resolution === 0 && "bg-primary",
                  )}
                  disabled={isImageRenderable(context.image) === false}
                  aria-label="RAW"
                >
                  RAW
                </Button>
              )}

              {context.image.derivedScaleViews.map((view, index) => (
                <Button
                  key={view.id}
                  variant="outline"
                  size={"icon"}
                  onClick={() => setResolution(index + 1)}
                  className={cn(
                    "w-6 h-6 p-2",
                    resolution === index + 1 && "bg-primary",
                  )}
                  disabled={isImageRenderable(view.image) === false}
                >
                  {view.id}
                </Button>
              ))}
            </div>
          )}

          {(context.image.store?.shape?.at(1) || 1) != 1 && (
            <>
              <Slider
                value={[t]}
                onValueChange={(s) => setT(s[0])}
                max={context.image.store?.shape?.at(1) || 1}
                className="mb-2 flex-grow bg-black"
              />{" "}
              {t}
            </>
          )}
          {(context.image.store?.shape?.at(2) || 1) != 1 && !threeD && (
            <>
              <Slider
                value={[z]}
                onValueChange={(s) => setZ(s[0])}
                max={context.image.store?.shape?.at(2) || 1}
                className="mb-2 flex-grow"
              />{" "}
              {z}
            </>
          )}
        </div>
      </div>
    </>
  );
};
