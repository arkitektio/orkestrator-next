import React, { useEffect, useState } from "react";
import * as ListLayout from "@/components/ui/list-layout";
import { ListOffsetter } from "@/components/ui/list";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FileQuestion, Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import { Smart } from "@/providers/smart/builder";
import { BsCaretLeft, BsCaretRight } from "react-icons/bs";
import { Refetcher } from "../ui/refetcher";

// --- Types ---

interface StandardVariables<TFilters, TOrder> {
  filters?: TFilters;
  order?: TOrder;
  pagination: OffsetPaginationInput;
}

interface HookResult<TData> {
  data?: TData;
  loading: boolean;
  error?: any;
  refetch: (variables?: any) => Promise<any>;
}

type ItemComponentType<TItem> = React.ComponentType<{ item: TItem } & any>;

// The props available when you USE the component (<BlockList ... />)
export interface GeneratedListProps<TFilters, TOrder> {
  filters?: TFilters;
  order?: TOrder;
  // All display props are now optional because they might be defined in the factory
  title?: React.ReactNode;
  actions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  defaultLimit?: number;
  cardProps?: Record<string, any>;
}



export const Offseter = ({
  offset,
  setOffset,
  refetch,
  step,
  array,
}: {
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  array?: any[] | undefined | null;
  refetch: () => Promise<any>;
}) => (
  <div className="flex flex-row items-center gap-1 text-gray-600">
    {offset != 0 && (
      <Button
        size={"sm"}
        variant={"ghost"}
        type="button"
        className="hover:text-gray-200 transition-all"
        onClick={() => setOffset(offset - step > 0 ? offset - step : 0)}
      >
        {" "}
        <BsCaretLeft />{" "}
      </Button>
    )}
    {array && array.length == step && (
      <Button
        size={"sm"}
        variant={"ghost"}
        className="hover:text-gray-200 transition-all "
        onClick={() => setOffset(offset + step)}
      >
        {" "}
        <BsCaretRight />{" "}
      </Button>
    )}
    <Refetcher refetch={() => refetch()} />
  </div>
);

// The Configuration Object passed to createList({...})
interface CreateListOptions<TData, TFilters, TOrder, TItem> {
  // Logic (Required)
  useHook: (options: {
    variables: StandardVariables<TFilters, TOrder>;
    fetchPolicy?: any;
  }) => HookResult<TData>;
  dataKey: keyof TData;
  ItemComponent: ItemComponentType<TItem>;

  // Defaults (Optional)
  autoHide?: boolean;
  title?: React.ReactNode;
  actions?: React.ReactNode; // Default actions (e.g. always show "New")
  emptyTitle?: string;
  emptyDescription?: string;
  defaultLimit?: number;
  smart?: Smart;
  cardProps?: Record<string, any>;
}

export const createList = <
  TData,
  TFilters,
  TOrder,
  TItem extends { id?: string | number }
>(
  options: CreateListOptions<TData, TFilters, TOrder, TItem>
) => {
  // Destructure options for easier access
  const {
    useHook,
    dataKey,
    ItemComponent,
    // Extract defaults to merge later
    smart,
    autoHide = true,
    title: defaultTitle,
    actions: defaultActions,
    emptyTitle: defaultEmptyTitle = "No items found",
    emptyDescription: defaultEmptyDesc = "No results match your criteria.",
    defaultLimit: initialLimit = 20,
    cardProps: defaultCardProps = {}
  } = options;

  const GenericList = (props: GeneratedListProps<TFilters, TOrder>) => {
    // MERGE: Props passed at runtime override defaults passed at creation
    const title = props.title ?? defaultTitle;
    const actions = props.actions ?? defaultActions;
    const emptyTitle = props.emptyTitle ?? defaultEmptyTitle;
    const emptyDescription = props.emptyDescription ?? defaultEmptyDesc;
    const defaultLimit = props.defaultLimit ?? initialLimit;
    const cardProps = { ...defaultCardProps, ...props.cardProps };

    // --- Logic ---

    const [pagination, setPagination] = useState<OffsetPaginationInput>({
      limit: defaultLimit,
      offset: 0,
    });

    useEffect(() => {
      setPagination((prev) => ({ ...prev, offset: 0 }));
    }, [JSON.stringify(props.filters), JSON.stringify(props.order)]);

    const { data, loading, error, refetch, } = useHook({
      variables: {
        filters: props.filters as TFilters,
        order: props.order as TOrder,
        pagination: pagination,
      },
      fetchPolicy: "cache-and-network",
    });

    const listData = (data ? data[dataKey] : []) as unknown as TItem[];
    const hasItems = listData && listData.length > 0;

    // Pagination Logic
    const showHeaderPagination = listData.length >= (pagination.limit || 20);

    const headerActions = (
      <div className="flex items-center gap-2">

        {actions}
        {smart ? (
          <smart.NewButton><Button size={"icon"} variant={"ghost"} className="text-gray-600"><Plus className="h-4 w-4 mr-1" /></Button></smart.NewButton>
        ) : null}
        <Offseter
          offset={pagination.offset || 0}
          step={pagination.limit || 20}
          setOffset={(newOffset) =>
            setPagination((prev) => ({ ...prev, offset: newOffset }))
          }
          array={listData}
          refetch={refetch}
        />
      </div>
    );

    if (error) {
      return (
        <ListLayout.Root>
          <div className="p-4 text-red-500 border border-red-200 rounded bg-red-50">
            <div className="font-bold">Error loading data</div>
            <div className="text-sm">{error.message}</div>
          </div>
        </ListLayout.Root>
      );
    }

    if (autoHide && !hasItems && !loading) {
      return (
        <></>
      );
    }

    return (
      <ListLayout.Root>
        {(title || headerActions) && (
          <ListLayout.Header actions={headerActions}>
            {smart ? (
              <smart.ListLink className="flex-0 ">{title}</smart.ListLink>
            ) : (
              title
            )}


          </ListLayout.Header>
        )}

        {loading && !hasItems ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground animate-pulse">
            Loading...
          </div>
        ) : !hasItems ? (
          <Empty>
            <EmptyHeader>
              <div className="flex justify-center">
                <EmptyMedia>
                  <FileQuestion className="h-10 w-10 text-muted-foreground" />
                </EmptyMedia>
              </div>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              <EmptyDescription>{emptyDescription}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={() => refetch()}>
                Check Again
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <ListLayout.Grid>
            {listData.map((item, index) => (
              <ItemComponent
                key={item.id || index}
                item={item}
                {...cardProps}
              />
            ))}
          </ListLayout.Grid>
        )}

      </ListLayout.Root>
    );
  };

  GenericList.displayName = `GeneratedList(${String(dataKey)})`;

  return GenericList;
};
