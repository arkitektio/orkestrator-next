import { createList } from "@/components/layout/createList";
import { ElektroDataset } from "@/linkers";
import { useGetDatasetsQuery } from "../../api/graphql";
import DatasetCard from "../cards/DatasetCard";

const TList = createList({
  useHook: useGetDatasetsQuery,
  dataKey: "datasets",
  ItemComponent: DatasetCard,
  title: "Latest Datasets",
  smart: ElektroDataset,
});
export default TList;
