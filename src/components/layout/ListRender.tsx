import { OffsetPaginationInput } from "@/rekuest/api/graphql";
import React, { ReactNode, useEffect, useState } from "react";
import { ListOffsetter, ListTitle } from "../ui/list";
import { Refetcher } from "../ui/refetcher";
import { ContainerGrid } from "./ContainerGrid";

export type ListRenderProps<T> = {
  title?: React.ReactNode;
  loading?: boolean;
  fitLength?: number;
  loader?: React.ReactNode;
  children: (item: T, index: number) => ReactNode;
  additionalChildren?: ReactNode;
  array: T[] | undefined | null;
  limit?: number;
  fit?: boolean;
  actions?: React.ReactNode;
  refetch?: (values: { pagination: OffsetPaginationInput }) => Promise<any>;
};

export const ListRender = <T extends any>({
  title,
  loading,
  array,
  actions,
  children,
  refetch,
  fit,
  additionalChildren,
  loader,
  limit = 20,
}: ListRenderProps<T>) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (refetch) {
      refetch({ pagination: { limit: limit, offset: offset } });
    }
  }, [offset, limit]);

  return (
    <>
      {array && (array.length > 0 || offset > 0) && (
        <>
          <ListTitle
            right={
              <div className="flex flex-row text-gray-700 my-auto">
                {refetch && (
                  <>
                    <ListOffsetter
                      offset={offset}
                      setOffset={setOffset}
                      array={array}
                      step={limit}
                    />
                    <Refetcher
                      onClick={() =>
                        refetch({
                          pagination: { limit: limit, offset: offset },
                        })
                      }
                    />
                  </>
                )}
                {actions}
              </div>
            }
          >
            {title}
          </ListTitle>
          <ContainerGrid fitLength={fit ? array.length : undefined}>
            {array?.map(children)}
            {additionalChildren}
          </ContainerGrid>
        </>
      )}
      {loading && loader}
    </>
  );
};
