import {
  loadOmeTiff,
  PictureInPictureViewer,
  TiffPixelSource,
} from "@hms-dbmi/viv";
import { useEffect, useState } from "react";
import { useViewRenderFunction } from "./hooks/useViewRender";

const urlOrFile = "http://127.0.0.1:8080/x.ome.tif";

function isOmeTiff(urlOrFile) {
  if (Array.isArray(urlOrFile)) return false; // local Zarr is array of File Objects
  const name = typeof urlOrFile === "string" ? urlOrFile : urlOrFile.name;
  return (
    name.includes("ome.tiff") ||
    name.includes("ome.tif") ||
    name.includes(".companion.ome")
  );
}

/** @param {string} url */
async function fetchSingleFileOmeTiffOffsets(url) {
  // No offsets for multifile OME-TIFFs
  if (url.includes("companion.ome")) {
    return undefined;
  }
  const offsetsUrl = url.replace(/ome\.tif(f?)/gi, "offsets.json");
  const res = await fetch(offsetsUrl);
  return res.status === 200 ? await res.json() : undefined;
}

async function getTotalImageCount(sources) {
  const firstOmeTiffImage = sources[0];
  const firstPixelSource = firstOmeTiffImage.data[0];
  const representativeGeoTiffImage = await firstPixelSource._indexer({
    c: 0,
    z: 0,
    t: 0,
  });
  const hasSubIFDs = Boolean(
    representativeGeoTiffImage?.fileDirectory?.SubIFDs,
  );

  // Non-Bioformats6 pyramids use Image tags for pyramid levels and do not have offsets
  // built in to the format for them, hence the ternary.

  if (hasSubIFDs) {
    return sources.reduce((sum, { metadata }) => {
      const { SizeC, SizeT, SizeZ } = metadata.Pixels;
      const numImagesPerResolution = SizeC * SizeT * SizeZ;
      return numImagesPerResolution + sum;
    }, 1);
  }

  const levels = firstOmeTiffImage.data.length;
  const { SizeC, SizeT, SizeZ } = firstOmeTiffImage.metadata.Pixels;
  const numImagesPerResolution = SizeC * SizeT * SizeZ;
  return numImagesPerResolution * levels;
}

const loader = async () => {
  // OME-TIFF
  const maybeOffsets = await fetchSingleFileOmeTiffOffsets(urlOrFile);

  // TODO(2021-05-06): temporarily disable `pool` until inline worker module is fixed.
  const source = await loadOmeTiff(urlOrFile, {
    offsets: maybeOffsets,
    images: "all",
    pool: false,
  });

  // Show a warning if the total number of channels/images exceeds a fixed amount.
  return source;
};

export const VivRenderer = () => {
  const { renderView } = useViewRenderFunction();

  const [source, setSource] = useState<TiffPixelSource<any>[] | undefined>(
    undefined,
  );

  useEffect(() => {
    loader().then((source) => {
      setSource(source.data);
    });
  }, [loader]);

  return (
    <>
      {source && (
        <PictureInPictureViewer
          contrastLimits={[]}
          loader={source}
          channelsVisible={[0, 1]}
        />
      )}{" "}
    </>
  );
};
