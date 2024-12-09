import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { Structure } from "@/types";
import { useFloating } from "@floating-ui/react";
import { Portal } from "@radix-ui/react-portal";
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useMySelection } from "../selection/SelectionContext";
import { SmartModelProps } from "./types";

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
  const { refs, floatingStyles } = useFloating({
    strategy: "fixed",
    transform: true,
    open: partners.length > 0,
    onOpenChange: (open) => {
      if (!open) {
        setPartners([]);
      }
    },
  });

  useEffect(() => {
    if (partners.length > 0) {
      const listener = {
        handleEvent: (e: Event) => {
          const target = e.target as HTMLElement;
          const partnerCard = target.closest(".partnercard");
          if (!partnerCard) {
            setPartners([]);
          }
        },
      };
      document.addEventListener("mousedown", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
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

  return (
    <div
      key={props.object}
      ref={drop}
      data-identifier={props.identifier}
      data-object={props.object}
    >
      <ContextMenu>
        <ContextMenuContent className="dark:border-gray-700 max-w-md">
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
              "@container relative smartdraggable z-10",
              isSelected && "group ring ring-1 ",
              isDragging &&
                "opacity-50 ring-2 ring-gray-600 ring rounded rounded-md",
              isOver &&
                "shadow-xl ring-2 border-gray-200 ring rounded rounded-md",
            )}
            style={{
              scale: partners.length > 0 ? 1.5 : 1,
            }}
          >
            {props.children}
            {isOver && <CombineButton />}
            <div className="absolute top-0 right-0 " ref={refs.setReference} />

            {partners.length > 0 && (
              <Portal>
                <div
                  ref={refs.setFloating}
                  className={cn(
                    " bg-background border rounded-lg shadow-lg p-2 z-[9999] w-[300px] aspect-square partnercard",
                  )}
                  style={floatingStyles}
                >
                  <SmartContext
                    identifier={props.identifier}
                    object={props.object}
                    partners={partners}
                  />
                </div>
              </Portal>
            )}
          </div>
        </ContextMenuTrigger>
      </ContextMenu>
    </div>
  );
};

export const CombineButton = (props: { children?: React.ReactNode }) => {
  return (
    <div className="absolute bottom-0 w-full h-full flex justify-center items-center z-10 bg-black bg-opacity-75">
      <div className="font-light text-xs p-2 rounded-full bg-black bg-opacity-100">
        Drop to Combine
      </div>
    </div>
  );
};
