import { Arkitekt, useMikro } from "@/arkitekt";
import { Fakts } from "@/lib/fakts";
import {
  ListRgbContextFragment,
  RequestAccessDocument,
  RequestAccessMutation,
  RequestAccessMutationVariables,
} from "@/mikro-next/api/graphql";
import { S3Store } from "@/mikro-next/providers/xarray/store";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import {
  loadOmeTiff,
  PictureInPictureViewer,
  ZarrPixelSource,
} from "@hms-dbmi/viv";
import { AwsClient } from "aws4fetch";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { openGroup, ZarrArray } from "zarr";
import { useViewRenderFunction } from "./hooks/useViewRender";

const urlOrFile = "http://127.0.0.1:8080/x.ome.tif";

const loader = async () => {
  // OME-TIFF

  // TODO(2021-05-06): temporarily disable `pool` until inline worker module is fixed.
  const source = await loadOmeTiff(urlOrFile, {
    images: "all",
    pool: false,
  });

  // Show a warning if the total number of channels/images exceeds a fixed amount.
  return source;
};

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
  zoom: 0,
  target: [0, 0, 0],
  camera: [0, 0, 0],
  rotation: [0, 0, 0],
  mode: "3d",
};

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
];

export const VivRenderer = ({
  context,
}: {
  context: ListRgbContextFragment;
}) => {
  const { renderView } = useViewRenderFunction();

  const client = useMikro();
  const fakts = Arkitekt.useFakts();

  const [source, setSource] = useState<ZarrPixelSource<any>[] | null>(null);

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

  return (
    <div className="w-full h-full" ref={ref}>
      {source != null && bounds.width > 0 && (
        <PictureInPictureViewer
          contrastLimits={newContrastLimits}
          loader={source}
          channelsVisible={[true, true, true]}
          height={bounds.height}
          selections={[{ z: 0, t: 0 }]}
          overview={false}
          width={bounds.width}
          colors={newColors}
          viewStates={[viewState]}
        />
      )}
    </div>
  );
};
function useMikroClient() {
  throw new Error("Function not implemented.");
}
