import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { composeMates } from "@/mates/compose";
import { Structure } from "@/types";
import { PopoverAnchor } from "@radix-ui/react-popover";
import React, { useEffect, useState } from "react";
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
import { NativeTypes } from "react-dnd-html5-backend";

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

  const [partners, setPartners] = useState<Structure[]>([]);

  useEffect(() => {
    if (partners.length > 0) {
      const listener = {
        handleEvent: (e: Event) => {
          e.stopPropagation();
          setPartners([]);
        },
      };
      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [partners]);

  const [{ isOver, canDrop, overItems }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],
      drop: (item, monitor) => {
        console.log("drop", item);
        let text = item.text;
        if (text) {
          let structure: Structure = JSON.parse(text);
          setPartners([structure]);
        } else setPartners(item);
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

  const [{ isDragging }, drag] = useDrag(
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

  return (
    <div
      key={props.identifier + "/" + props.object}
      ref={drop}
      data-identifier={props.identifier}
      data-object={props.object}
    >
      <ContextMenu>
        <ContextMenuContent className="dark:border-gray-700 max-w-lg">
          {isSelected ? (
            <>Multiselect is not implemented yet</>
          ) : (
            <SmartContext
              identifier={props.identifier}
              object={props.object}
              partners={[]}
            />
          )}
        </ContextMenuContent>
        <ContextMenuTrigger asChild>
          <div
            ref={drag}
            className={cn(
              "@container relative smartdraggable ",
              isSelected && "group ring ring-1 ",
              isOver && "shadow-xl",
              dragClassNameFunc({
                isDragging,
                isOver: false,
                canDrop,
                progress: 0,
              }),
            )}
            onClick={(e) => {
              setPartners([]);
            }}
          >
            {props.children}

            {isOver && <CombineButton />}
            {partners.length > 0 && (
              <div className="absolute bottom-0 w-full h-full flex justify-center items-center z-10 p-3">
                <Card className="h-full w-full flex text-wrap p-3">
                  <SmartContext
                    identifier={props.identifier}
                    object={props.object}
                    partners={[]}
                  />
                </Card>
              </div>
            )}
          </div>
        </ContextMenuTrigger>
      </ContextMenu>
    </div>
  );
};

export const CombineButton = (props: { children?: React.ReactNode }) => {
  return (
    <div className="absolute bottom-0  w-full h-full flex justify-center items-center z-100">
      <Card className="mx-2 mb-2 p-3">Drop to Combine</Card>
    </div>
  );
};
