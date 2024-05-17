import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { Structure } from "@/types";
import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { withLokNext } from "@jhnnsrs/lok-next";
import {
  ListStashFragment,
  StashItemFragment,
  useAddItemsToStashMutation,
  useCreateStashMutation,
  useDeleteStashItemsMutation,
  useMyStashesQuery,
} from "@/lok-next/api/graphql";
import { Button } from "@/components/ui/button";

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
    }),
    [self],
  );

  return (
    <Card className="p-2" ref={drag}>
      {props.item.object} {props.item.identifier}
      <Button
        onClick={() => deleteItems({ variables: { items: props.item.id } })}
      >
        Delete
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

        return {};
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

  return (
    <Card
      ref={drop}
      className="p-2 transition transition-all duration-300"
      data-disableselect
    >
      <CardHeader>
        <CardTitle>{props.item.name}</CardTitle>
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
                    {item.object} {item.identifier}
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
      className="p-3  transition transition-all duration-300"
      data-disableselect
    >
      <div className="flex flex-row justify-between gap-2">
        {data?.stashes.map((stash) => <StashZone item={stash} />)}
        <Button
          onClick={() => createStash({ variables: {} })}
          className="h-full my-auto"
        >
          +
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
