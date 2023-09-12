import { ListRender } from "@/components/layout/ListRender";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useNodeSearchLazyQuery,
  useNodeSearchQuery,
} from "@/rekuest/api/graphql";
import NodeCard from "@/rekuest/components/cards/NodeCard";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import * as React from "react";
import NodeSearchFilter from "../components/forms/filter/NodeSearchFilter";

interface IDataSidebarProps {}

const Pane: React.FunctionComponent<IDataSidebarProps> = (props) => {
  const { data, refetch } = withRekuest(useNodeSearchQuery)({
    variables: {
      pagination: {
        limit: 20,
      },
    },
  });

  return (
    <>
      <div className="flex h-full flex-col p-2 mt-2" data-enableselect={true}>
        <NodeSearchFilter
          onFilterChanged={(e) => refetch({ filters: e })}
          defaultValue={{ search: "" }}
        />
        <ScrollArea
          className="flex-grow flex flex-col gap-2 p-3 direct @container"
          data-enableselect={true}
        >
          <ListRender array={data?.nodes}>
            {(item, i) => <NodeCard node={item} key={i} />}
          </ListRender>
        </ScrollArea>
      </div>
    </>
  );
};

export default Pane;
