import { MikroDataset } from "@/linkers";

import { createList } from "@/components/layout/createList";
import { useListDatasetsQuery } from "@/omero-ark/api/graphql";
import DatasetCard from "../cards/DatasetCard";

const TList = createList({
  useHook: useListDatasetsQuery,
  dataKey: "datasets",
  ItemComponent: DatasetCard,
  title: "Latest Datasets",
  smart: MikroDataset,
});
export default TList;
