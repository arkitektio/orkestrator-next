import { createList } from "@/components/layout/createList";
import { MikroFile } from "@/linkers";
import {
  FileFilter,
  FileOrder,
  OffsetPaginationInput,
  useGetFilesQuery,
} from "../../api/graphql";
import FileCard from "../cards/FileCard";



const TList = createList({
  useHook: useGetFilesQuery,
  dataKey: "files",
  ItemComponent: FileCard,
  title: "Latest Files",
  smart: MikroFile,
});
export default TList;

