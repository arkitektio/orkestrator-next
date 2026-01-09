import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import {
  DatasetFilter,
  OffsetPaginationInput,
  useGetDatasetsQuery,
} from "../../api/graphql";
import DatasetCard from "../cards/DatasetCard";
import { createList } from "@/components/layout/createList";

export type Props = {
  filters?: DatasetFilter;
  pagination?: OffsetPaginationInput;
};


const TList = createList({
  useHook: useGetDatasetsQuery,
  dataKey: "datasets",
  ItemComponent: DatasetCard,
  title: "Latest Datasets",
  smart: MikroDataset,
});
export default TList;
