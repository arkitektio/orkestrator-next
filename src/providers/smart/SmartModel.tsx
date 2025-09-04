import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { Structure } from "@/types";
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import {
  useMySelect,
  useMySelection,
  useSelection,
} from "../selection/SelectionContext";
import { SmartModelProps } from "./types";
import { is } from "date-fns/locale";

export const SmartModel = ({
  showSelfMates = true,
  showSelectingIndex = true,
  hover = false,
  mates,
  ...props
}: SmartModelProps) => {
  const self: Structure = React.useMemo(
    () => ({
      identifier: props.identifier,
      object: props.object,
    }),
    [props.identifier, props.object],
  );

  const portalRef = React.useRef<HTMLDivElement>(null);

  const [partners, setPartners] = useState<Structure[]>([]);

  const dropHandler = React.useCallback((item: any, monitor: any) => {
    console.log("drop", item);

    if (monitor.getItemType() === SMART_MODEL_DROP_TYPE) {
      console.log("SMART", item);
      setPartners(item);
      return {};
    }

    if (monitor.getItemType() === NativeTypes.URL) {
      console.log("URL", item);
      const url = item.urls;
      const partners: Structure[] = [];
      for (let i = 0; i < url.length; i++) {
        const the_url = url[i];
        console.log("URL", the_url);
        const match = the_url.match(/arkitekt:\/\/([^:]+):([^\/]+)/);
        if (match) {
          console.log("MATCH", match);
          const [_, identifier, object] = match;
          const structure: Structure = { identifier, object };
          partners.push(structure);
        }
      }
      if (partners.length > 0) {
        setPartners(partners);
        return {};
      }
    }

    const text = item.text;

    if (item.text) {
      try {
        const structure: Structure = JSON.parse(text);
        setPartners([structure]);
        return {};
      } catch (e) {
        console.error(e);
      }
    }

    alert(`Drop unknown ${item}`);
    return {};
  }, []);

  const collectDrop = React.useCallback(
    (monitor: any) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    [],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [SMART_MODEL_DROP_TYPE, NativeTypes.TEXT, NativeTypes.URL],
      drop: dropHandler,
      collect: collectDrop,
    }),
    [dropHandler, collectDrop],
  );

  const collectDrag = React.useCallback(
    (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    [],
  );

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: SMART_MODEL_DROP_TYPE,
      item: [self],
      collect: collectDrag,
    }),
    [self, collectDrag],
  );

  const clearPartners = React.useCallback(() => {
    setPartners([]);
  }, []);

  const handleDragStart = React.useCallback(
    (e: React.DragEvent) => {
      const data = JSON.stringify(self);
      e.dataTransfer.setData("text/plain", data);
      e.dataTransfer.setData(
        "text/uri-list",
        `arkitekt://${props.identifier}:${props.object}`,
      );
    },
    [self, props.identifier, props.object],
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        portalRef.current &&
        !portalRef.current.contains(event.target as Node)
      ) {
        clearPartners();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearPartners();
      }
    };

    if (partners.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [partners.length, clearPartners]);

  const { isBSelected, toggleB, isSelected, toggle, selection } = useMySelect({
    self,
  });

  const className = React.useMemo(
    () =>
      cn(
        "@container relative z-10 cursor-pointer",
        isSelected &&
          "group ring ring-1 ring-offset-2 ring-offset-transparent rounded",
        isBSelected && "group ring ring-2  rounded ring-red-500",
        isDragging && "opacity-50 ring-2 ring-gray-600 ring rounded rounded-md",
        isOver && "shadow-xl ring-2 border-gray-200 ring rounded rounded-md",
      ),
    [isSelected, isDragging, isOver, isBSelected],
  );

  return (
    <div
      key={`${props.identifier}:${props.object}`}
      ref={drop}
      onClick={(e) => {
        if (e.shiftKey && !e.ctrlKey) {
          toggle();
          return;
        }
        if (e.shiftKey && e.ctrlKey) {
          toggleB();
          return;
        }
      }}
      onDragStart={handleDragStart}
      data-identifier={props.identifier}
      data-object={props.object}
      data-selected={isSelected ? "true" : "false"}
    >
      <ContextMenu modal={false}>
        <ContextMenuContent className="dark:border-gray-700 max-w-md">
          {selection && selection.length > 0 ? (
            <SmartContext objects={selection} partners={[]} />
          ) : (
            <SmartContext objects={[self]} partners={[]} />
          )}
        </ContextMenuContent>
        <ContextMenuTrigger>
          <div
            ref={drag}
            className={className}
            draggable={false}
            data-identifier={props.identifier}
            data-object={props.object}
          >
            {props.children}
            {isOver && <CombineButton />}
            {isBSelected && (
              <div className="absolute top-0 right-0 text-white z-[9998] translate-x-1/2 -translate-y-1/2 bg-red-500 w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold">
                {isBSelected}
              </div>
            )}
            {isSelected && (
              <div className="absolute top-0 right-0 text-white z-[9998] translate-x-1/2 -translate-y-1/2 bg-primary w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold">
                {isSelected}
              </div>
            )}

            {partners.length > 0 && (
              <div
                className="fixed inset-0 z-[9998] flex items-center justify-center"
                ref={portalRef}
              >
                <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={clearPartners}
                />
                <div
                  className="bg-background border border-gray-500 rounded-lg shadow-lg p-2 z-[9999] w-[300px] aspect-square relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SmartContext
                    objects={
                      selection && selection.length > 1 ? selection : [self]
                    }
                    partners={partners}
                    onDone={() => clearPartners()}
                  />
                </div>
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
    <div className="absolute bottom-0 w-full h-full flex justify-center items-center z-10 bg-black bg-opacity-75">
      <div className="font-light text-xs p-2 rounded-full bg-black bg-opacity-100">
        Drop to Combine
      </div>
    </div>
  );
};
