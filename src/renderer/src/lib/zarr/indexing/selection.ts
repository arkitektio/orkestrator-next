import { Slice } from "zarrita";
import { BasicIndexer, IndexerProjection } from "./indexer";

export const calculateChunkGrid = (
  selection: (number | Slice | null)[],
  shape,
  chunks,
) => {
  const indexer = new BasicIndexer({
    selection,
    shape: shape,
    chunk_shape: chunks,
  });

  const chunk_loaders: {
    chunk_coords: number[];
    mapping: IndexerProjection[];
  }[] = [];

  for (const { chunk_coords, mapping } of indexer) {
    chunk_loaders.push({ chunk_coords, mapping });
  }

  return chunk_loaders;
};


