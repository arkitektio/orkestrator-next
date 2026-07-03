import { createList } from "@/components/layout/createList";
import { ElektroFile } from "@/linkers";
import { useGetFilesQuery } from "../../api/graphql";
import FileCard from "../cards/FileCard";

const TList = createList({
  useHook: useGetFilesQuery,
  dataKey: "files",
  ItemComponent: FileCard,
  title: "Latest Files",
  smart: ElektroFile,
});
export default TList;
