import { Card } from "@/components/ui/card";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { composeMates } from "@/mates/compose";
import { Structure } from "@/types";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useMySelection } from "../selection/SelectionContext";
import { Mates } from "./Mates";
import { SmartModelProps } from "./types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { cn } from "@/lib/utils";

export const SmartModel = ({
  showSelfMates = true,
  showSelectingIndex = true,
  hover = false,
  mates,
  ...props
}: SmartModelProps) => {
  const self: Structure = {
    identifier: props.identifier,
    object: props.object,
  };

  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      const listener = {
        handleEvent: (e: Event) => {
          e.stopPropagation();
          setShow(false);
        },
      };
      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [show]);

  const onProgress = async (progress: number | undefined) => {
    setProgress(progress);
  };

  const [{ isOver, canDrop, overItems }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],
      drop: (item, monitor) => {
        if (!monitor.didDrop()) {
          console.log("Ommitting Parent Drop");
        }
        return {};
      },
      collect: (monitor) => {
        let text = monitor.getItem()?.text;
        if (text) {
          let structure: Structure = JSON.parse(text);
          return {
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            overItems: [structure],
          };
        }

        let item = monitor.getItem() as Structure[] | null;

        return {
          isOver: !!monitor.isOver(),
          overItems: [],
          canDrop: !!monitor.canDrop(),
        };
      },
    };
  });

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

  const { isSelected } = useMySelection({
    identifier: props.identifier,
    object: props.object,
  });

  const dragClassNameFunc = props.dragClassName || (({}) => "");

  const dropClassNameFunc =
    props.dropClassName ||
    (({ isOver, canDrop, progress }) =>
      `${props.className} ${
        hover &&
        "hover:scale-110 transition-all ease-in-out duration-200 group hover:shadow-xl hover:shadow border-2 border-hidden"
      } ${isOver && "border-solid "} ${progress && "animate-pulse"}`);

  return (
    <div
      key={props.identifier + "/" + props.object}
      ref={drop}
      data-identifier={props.identifier}
      data-object={props.object}
    >
      <ContextMenu>
        <ContextMenuContent className="dark:border-gray-700">
          {isSelected ? (
            <>Multiselect is not implemented yet</>
          ) : (
            <SmartContext identifier={props.identifier} object={props.object} />
          )}
        </ContextMenuContent>
        <ContextMenuTrigger asChild>
          <div
            ref={drag}
            className={cn(
              "@container ",
              isSelected && "group ring ring-1 ",
              dragClassNameFunc({
                isDragging,
                isOver,
                canDrop,
                progress,
              }),
            )}
            style={
              props.dragStyle &&
              props.dragStyle({
                isDragging,
                isOver,
                canDrop,
                progress,
              })
            }
          >
            {props.children}
          </div>
        </ContextMenuTrigger>
      </ContextMenu>
    </div>
  );
};
