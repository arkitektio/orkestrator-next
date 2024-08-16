import { Arkitekt, useMikro } from "@/arkitekt";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Fakts } from "@/lib/fakts";
import {
  ColorMap,
  ListRgbContextFragment,
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
  RgbViewFragment,
} from "@/mikro-next/api/graphql";
import { S3Store } from "@/mikro-next/providers/xarray/store";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import {
  AdditiveColormap3DExtensions,
  AdditiveColormapExtension,
  ColorPalette3DExtensions,
  LensExtension,
  PictureInPictureViewer,
  RENDERING_MODES,
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
import { useViewRenderFunction } from "./hooks/useViewRender";

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

  let path =
    endpoint_url +
    "/" +
    context.image.store.bucket +
    "/" +
    context.image.store.key;

  let aws = new AwsClient({
    accessKeyId: credentials.accessKey,
    secretAccessKey: credentials.secretKey,
    sessionToken: credentials.sessionToken,
    service: "s3",
  });

  console.log(await aws.fetch(path + "/.zattrs"));

  let store = new S3Store(path, aws);

  let group = await openGroup(store, "", "r");
  let array = (await group.getItem("data")) as ZarrArray;

  let labels = ["c", "t", "z", "y", "x"];

  const tileSize = guessTileSize(array);
  return {
    data: [new ZarrPixelSource(array, labels, tileSize)],
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

const newContrastLimits = [
  [0, 255],
  [0, 255],
  [0, 255],
];
const newDomains = [
  [0, 255],
  [0, 255],
  [0, 255],
];
const newColors = [
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255],
  [255, 255, 0],
  [255, 0, 255],
  [0, 255, 255],
  [255, 255, 255],
];

const mapToRgbColor = (view: RgbViewFragment) => {
  switch (view.colorMap) {
    case ColorMap.Red:
      return [255, 0, 0];
    case ColorMap.Green:
      return [0, 255, 0];
    case ColorMap.Blue:
      return [0, 0, 255];
    default:
      return view.baseColor || [255, 255, 255];
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

export function getPhysicalSizeScalingMatrix(x, y, z) {
  const ratio = [x, y, z];
  return new Matrix4().scale(ratio);
}

export const VivRenderer = ({
  context,
}: {
  context: ListRgbContextFragment;
}) => {
  const { renderView } = useViewRenderFunction();

  const client = useMikro();
  const fakts = Arkitekt.useFakts();

  const [threeD, setThreeD] = useState(false);
  const [source, setSource] = useState<ZarrPixelSource<any>[] | null>(null);

  const [t, setT] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    mikroLoader(client, fakts, context)
      .then((source) => {
        console.log("source", source);
        setSource(source.data);
      })
      .catch((e) => {
        alert(e);
      });
  }, []);

  const [ref, bounds] = useMeasure({
    debounce: 100,
  });

  const singleChannel = context.views.length === 1;

  const maxType = dtypeToMax(source?.at(0)?.dtype || "Float32");

  const selections = useMemo(() => {
    return context.views.map((v) => {
      return { z: z, t: t, c: v.cMin };
    });
  }, [context.views, t, z]);

  return (
    <>
      <div className="w-full h-full relative" ref={ref}>
        {source != null && bounds.width > 0 && (
          <>
            {threeD ? (
              <VolumeViewer
                contrastLimits={context.views.map((v) => [0, maxType])}
                loader={source}
                channelsVisible={context.views.map((v) => v.active)}
                height={bounds.height}
                selections={selections}
                modelMatrix={getPhysicalSizeScalingMatrix(1, 1, 3)}
                overview={true}
                overviewOn={true}
                colormap={singleChannel ? "viridis" : "rgb"}
                extensions={[
                  get3DExtension("viridis", RENDERING_MODES.ADDITIVE),
                ]}
                width={bounds.width}
                colors={context.views.map(mapToRgbColor)}
                viewStates={[viewState]}
              />
            ) : (
              <PictureInPictureViewer
                contrastLimits={context.views.map((v) => [0, maxType])}
                loader={source}
                channelsVisible={context.views.map((v) => v.active)}
                height={bounds.height}
                selections={selections}
                overview={true}
                modelMatrix={getPhysicalSizeScalingMatrix(1, 1, 3)}
                overviewOn={true}
                extensions={[
                  singleChannel
                    ? new AdditiveColormapExtension()
                    : new LensExtension(),
                ]}
                hoverHooks={}
                colormap={singleChannel ? "viridis" : undefined}
                width={bounds.width}
                colors={context.views.map(mapToRgbColor)}
                viewStates={[viewState]}
              />
            )}
          </>
        )}
        <div className="absolute top-0 right-0 p-2 w-full">
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => setThreeD(!threeD)}
            className=" w-6 h-6"
          >
            {threeD ? <BiCuboid /> : <Layers />}
          </Button>
          <div className="flex flex-col w-full">
            {(context.image.store?.shape?.at(1) || 1) != 1 && (
              <>
                <Slider
                  value={[t]}
                  onValueChange={(s) => setT(s[0])}
                  max={context.image.store?.shape?.at(1) || 1}
                  className="mb-2 w-full"
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
                  className="mb-2 w-full"
                />{" "}
                {z}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
function useMikroClient() {
  throw new Error("Function not implemented.");
}
