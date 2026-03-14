import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { Structure } from "@/types";
import React from "react";

import { useSelectionSelector } from "../selection/SelectionContext";
import { SmartModelProps } from "./types";
import { useSmartModel } from "./useSmartModel";

export const SmartModel = ({
  ...props
}: SmartModelProps) => {
  const {
    ref,
    portalRef,
    self,
    isOver,
    partners,
    clearPartners,
    handleClick,
    handleDragStart,
    getCurrentSelection,
  } = useSmartModel({ identifier: props.identifier, object: props.object,  });

  const className = React.useMemo(
    () =>
      cn(
        props.className,
        "group @container relative z-10 cursor-pointer",
        "selected:ring selected:ring-1 selected:ring-offset-2 selected:ring-offset-transparent selected:rounded",
        "b-selected:ring b-selected:ring-2 b-selected:rounded b-selected:ring-red-500",
        "dragging:animate-pulse dragging:ring-2 dragging:ring-gray-600 dragging:rounded dragging:rounded-md",
        "over:shadow-xl over:ring-2 over:border-gray-200 over:ring over:rounded over:rounded-md",
        "selected:after:absolute selected:after:top-0 selected:after:right-0 selected:after:z-[9998] selected:after:flex selected:after:h-6 selected:after:w-6 selected:after:translate-x-1/2 selected:after:-translate-y-1/2 selected:after:items-center selected:after:justify-center selected:after:rounded-full selected:after:bg-primary selected:after:text-xs selected:after:font-semibold selected:after:text-white selected:after:content-[attr(data-selected-index)]",
        "b-selected:before:absolute b-selected:before:top-0 b-selected:before:right-0 b-selected:before:z-[9999] b-selected:before:flex b-selected:before:h-6 b-selected:before:w-6 b-selected:before:translate-x-1/2 b-selected:before:-translate-y-1/2 b-selected:before:items-center b-selected:before:justify-center b-selected:before:rounded-full b-selected:before:bg-red-500 b-selected:before:text-xs b-selected:before:font-semibold b-selected:before:text-white b-selected:before:content-[attr(data-bselected-index)]",
      ),
    [
      props.className,
    ],
  );

  return (
    <ContextMenu modal={false}>
      <ContextMenuContent className="dark:border-gray-700 max-w-md">
        <SmartModelContext self={self} />
      </ContextMenuContent>
      <ContextMenuTrigger asChild>
        <div
          key={`${props.identifier}:${props.object}`}
          ref={ref}
          onClick={handleClick}
          className={cn("relative", props.containerClassName, className)}
          onDragStart={handleDragStart}
          draggable={false}
        >
          {props.children}
          {isOver && <CombineButton />}

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
                    getCurrentSelection().length > 1
                      ? getCurrentSelection()
                      : [self]
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
  );
};

const SmartModelContext = ({ self }: { self: Structure }) => {
  const selection = useSelectionSelector((state) => state.selection);
  const bselection = useSelectionSelector((state) => state.bselection);

  if (selection.length > 0) {
    return <SmartContext objects={selection} partners={bselection} />;
  }

  return <SmartContext objects={[self]} partners={[]} />;
};

export const CombineButton = () => {
  return (
    <div className="absolute bottom-0 w-full h-full flex justify-center items-center z-10 bg-black bg-opacity-75">
      <div className="font-light text-xs p-2 rounded-full bg-black bg-opacity-100">
        Drop to Combine
      </div>
    </div>
  );
};
