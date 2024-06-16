import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import {
  ListStashFragment,
  StashItemFragment,
  useAddItemsToStashMutation,
  useCreateStashMutation,
  useDeleteStashItemsMutation,
  useDeleteStashMutation,
  useMyStashesQuery,
} from "@/lok-next/api/graphql";
import { Structure } from "@/types";
import { withLokNext } from "@jhnnsrs/lok-next";
import { motion } from "framer-motion";
import { GripVertical, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ConditionalStructureRender } from "./InfoTainer";

export const StashItem = (props: { item: StashItemFragment }) => {
  const [deleteItems] = withLokNext(useDeleteStashItemsMutation)({
    refetchQueries: ["MyStashes"],
  });

  const self: Structure = {
    identifier: props.item.identifier,
    object: props.item.object,
  };

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: SMART_MODEL_DROP_TYPE,
      item: [self],
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          if (monitor.getDropResult()?.stash) {
            deleteItems({ variables: { items: props.item.id } });
          }
        }
      },
    }),
    [self],
  );

  return (
    <Card className="p-2 relative group flex flex-row" ref={drag}>
      <div className="flex-grow my-auto">
        <ConditionalStructureRender
          object={props.item.object}
          identifier={props.item.identifier}
        />
      </div>

      <Button
        onClick={() => deleteItems({ variables: { items: props.item.id } })}
        size={"sm"}
        variant={"outline"}
        className="transition transition-all duration-300 text-xs my-auto hover:bg-red-500 hover:text-white my-auto "
      >
        <X />
      </Button>
    </Card>
  );
};

export const StashZone = (props: { item: ListStashFragment }) => {
  const [addItems] = withLokNext(useAddItemsToStashMutation)({
    refetchQueries: ["MyStashes"],
  });

  const [deleteItems] = withLokNext(useDeleteStashItemsMutation)({
    refetchQueries: ["MyStashes"],
  });

  const [deleteStash] = withLokNext(useDeleteStashMutation)({
    refetchQueries: ["MyStashes"],
  });

  const [{ isOver, canDrop, overItems }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],
      drop: (item, monitor) => {
        if (!monitor.didDrop()) {
          console.log("Ommitting Parent Drop");
        }

        if (monitor.getItem()?.text) {
          let structure: Structure = JSON.parse(monitor.getItem().text);
          addItems({
            variables: {
              stash: props.item.id,
              items: [structure],
            },
          });
        }

        let items = monitor.getItem() as Structure[] | null;

        if (items) {
          addItems({
            variables: {
              stash: props.item.id,
              items: items,
            },
          });
        }

        return { stash: props.item.id };
      },
      collect: (monitor) => {
        let text = monitor.getItem()?.text;
        console.log("text", text);
        if (text) {
          let structure: Structure = JSON.parse(text);
          return {
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            overItems: [structure],
          };
        }

        let item = monitor.getItem() as Structure[] | null;
        console.log("item", item);
        console.log("monitor", monitor.isOver());
        return {
          isOver: !!monitor.isOver(),
          overItems: item,
          canDrop: !!monitor.canDrop(),
        };
      },
    };
  });

  const allItems = props.item.items.map((item) => {
    return {
      identifier: item.identifier,
      object: item.object,
    };
  });

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: SMART_MODEL_DROP_TYPE,
      item: allItems,
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }),
    [allItems],
  );

  return (
    <Card
      ref={drop}
      className={cn(
        "transition transition-all duration-300 bg-sidebar",
        isDragging ? "animate-pulse" : "text-slate-300",
      )}
      data-disableselect
    >
      <CardHeader>
        <CardTitle
          ref={drag}
          data-disableselect
          className="cursor-pointer flex flex-row gap-2 "
        >
          <div className="flex-grow my-auto">{props.item.name}</div>
          <div className="flex flex-row gap-2">
            <GripVertical ref={drag} className={cn("w-6 h-6 cursor-pointer")} />
            <Button
              onClick={() =>
                deleteStash({ variables: { stash: props.item.id } })
              }
              variant={"outline"}
              size={"icon"}
              className="text-xs my-auto hover:bg-red-500 hover:text-white"
            >
              <X />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          {props.item.items.map((item) => (
            <StashItem item={item} />
          ))}
          {isOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {overItems &&
                overItems.map((item) => (
                  <Card className="p-2">
                    <ConditionalStructureRender
                      object={item.object}
                      identifier={item.identifier}
                    />
                  </Card>
                ))}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const StashDropZone = () => {
  const { data, refetch } = withLokNext(useMyStashesQuery)();

  const [createStash] = withLokNext(useCreateStashMutation)({
    onCompleted: () => {
      refetch();
    },
  });

  return (
    <Card
      className="p-3  transition transition-all duration-300 @container w-[500px] w-max-xl h-min-xl h-max-xl bg-background text-white shadow-lg rounded-xl"
      data-disableselect
    >
      {data?.stashes.length === 0 && (
        <div className="text-center text-lg text-slate-300">
          You have not created any stashes yet.
          <div className="text-sm text-slate-300">
            Create a new stash to start organizing your items.
          </div>
        </div>
      )}
      <ContainerGrid fitLength={data?.stashes.length}>
        {data?.stashes.map((stash) => <StashZone item={stash} />)}
      </ContainerGrid>
      <div className="justify-center items-center w-full flex mt-2">
        <Button
          onClick={() => createStash({ variables: {} })}
          className="text-xs my-auto"
          size={"sm"}
        >
          New Stash
        </Button>
      </div>
    </Card>
  );
};

export const Stash = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Add ctrl s event listener to document

    const handleSave = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        setShow(true);
      }
    };

    document.addEventListener("keydown", handleSave);

    return () => {
      document.removeEventListener("keydown", handleSave);
    };
  }, []);

  useEffect(() => {
    // Add ctrl s event listener to document

    const handleSave = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        setShow(false);
      }
    };

    document.addEventListener("keyup", handleSave);

    return () => {
      document.removeEventListener("keyup", handleSave);
    };
  }, []);

  return (
    <>
      {show && (
        <motion.div
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <StashDropZone />
        </motion.div>
      )}
    </>
  );
};
