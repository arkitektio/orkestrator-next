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
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
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

  const [{ isOver, canDrop }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE, NativeTypes.TEXT, NativeTypes.URL],
      drop: (item, monitor) => {
        console.log("drop", item);

        if (monitor.getItemType() === SMART_MODEL_DROP_TYPE) {
          console.log("SMART", item);
          setPartners(item);
          return {};
        }

        if (monitor.getItemType() === NativeTypes.URL) {
          console.log("URL", item);
          let url = item.urls;
          let partners: Structure[] = [];
          for (let i = 0; i < url.length; i++) {
            let the_url = url[i];
            console.log("URL", the_url);
            let match = the_url.match(/arkitekt:\/\/([^:]+):([^\/]+)/);
            if (match) {
              console.log("MATCH", match);
              let [_, identifier, object] = match;
              let structure: Structure = { identifier, object };
              partners.push(structure);
            }
          }
          if (partners.length > 0) {
            setPartners(partners);
            return {};
          }
        }

        let text = item.text;

        if (item.text) {
          try {
            let structure: Structure = JSON.parse(text);
            setPartners([structure]);
            return {};
          } catch (e) {
            console.error(e);
          }
        }

        alert(`Drop unkonwn ${item}`);

        return {};
      },
      collect: (monitor) => {
        return {
          isOver: !!monitor.isOver(),
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
        console.log("dragging", monitor.isDragging());
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
      onDragStart={(e) => {
        // Package the data as text/uri-list
        const data = JSON.stringify(self);
        e.dataTransfer.setData("text/plain", data);
        e.dataTransfer.setData(
          "text/uri-list",
          `arkitekt://${props.identifier}:${props.object}`,
        );
      }}
      data-identifier={props.identifier}
      data-object={props.object}
    >
      <ContextMenu modal={false}>
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
        <ContextMenuTrigger>
          <div
            ref={drag}
            className={cn(
              "@container relative z-10 cursor-pointer",
              isSelected && "group ring ring-1 ",
              isDragging &&
                "opacity-50 ring-2 ring-gray-600 ring rounded rounded-md",
              isOver &&
                "shadow-xl ring-2 border-gray-200 ring rounded rounded-md",
            )}
            draggable={true}
            onDragStart={(e) => {
              // Package the data as text/uri-list
              const data = JSON.stringify(self);
              e.dataTransfer.setData("text/plain", data);
            }}
            data-identifier={props.identifier}
            data-object={props.object}
          >
            {props.children}
            {isOver && <CombineButton />}
            <div className="absolute top-0 right-0 " ref={refs.setReference} />

            {partners.length > 0 && (
              <Portal>
                <div
                  ref={refs.setFloating}
                  className={cn(
                    " bg-background border border-gray-500 rounded-lg shadow-lg p-2 z-[9999] w-[300px] aspect-square",
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
