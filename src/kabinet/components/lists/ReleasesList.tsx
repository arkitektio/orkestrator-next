import { withKabinet } from "@/arkitekt";
import { ListRender } from "@/components/layout/ListRender";
import { KabinetRelease } from "@/linkers";

import ReleaseCard from "../cards/ReleaseCard";
import React from "react";
import { OffsetPaginationInput, useListReleasesQuery } from "../../api/graphql";

export type Props = {
  filters?: any;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withKabinet(
    useListReleasesQuery,
  )({
    variables: {},
  });

  return (
    <>
      {JSON.stringify(error)}
      <ListRender
        array={data?.releases}
        title={
          <KabinetRelease.ListLink className="flex-0 mb-5">
            <h2 className="text-2xl font-bold ">Latest Releases</h2>
            <div className="text-muted-foreground text-xs mb-3">
              {data?.releases.length} nodes that your peers have been working on
            </div>
          </KabinetRelease.ListLink>
        }
        refetch={refetch}
      >
        {(ex, index) => <ReleaseCard key={index} item={ex} />}
      </ListRender>
    </>
  );
};

export default List;
