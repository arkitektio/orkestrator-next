import { withMikroNext } from "@jhnnsrs/mikro-next";
import * as React from "react";
import {
  GlobalSearchQueryVariables,
  useGlobalSearchLazyQuery,
} from "../api/graphql";
import GlobalSearchFilter from "../forms/filter/GlobalSearchFilter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@uidotdev/usehooks";
import { ListRender } from "@/components/layout/ListRender";
import ImageCard from "../components/cards/ImageCard";
import FileCard from "../components/cards/FileCard";

interface IDataSidebarProps {}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const [fetch, { data }] = withMikroNext(useGlobalSearchLazyQuery)();

  return (
    <>
      <div className="flex h-full flex-col p-2 mt-2" data-enableselect={true}>
        <GlobalSearchFilter
          onFilterChanged={(e) => fetch({ variables: e })}
          defaultValue={{ search: "", noImages: false, noFiles: false }}
        />
        <ScrollArea
          className="flex-grow flex flex-col gap-2 p-3 direct @container"
          data-enableselect={true}
        >
          <ListRender array={data?.images}>
            {(item, i) => <ImageCard image={item} key={i} />}
          </ListRender>
          <ListRender array={data?.files}>
            {(item, i) => <FileCard file={item} key={i} />}
          </ListRender>
        </ScrollArea>
      </div>
    </>
  );
};

export default Pane;
