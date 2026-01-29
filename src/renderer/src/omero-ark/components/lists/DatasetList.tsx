import { MikroDataset } from "@/linkers";

import { createList } from "@/components/layout/createList";
import DatasetCard from "../cards/DatasetCard";
import { useListDatasetsQuery } from "@/omero-ark/api/graphql";

const TList = createList({
  useHook: useListDatasetsQuery,
  dataKey: "datasets",
  ItemComponent: DatasetCard,
  title: "Latest Datasets",
  smart: MikroDataset,
});
export default TList;
