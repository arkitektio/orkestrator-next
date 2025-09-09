import { Card } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
import { NodeResizeControl } from "reactflow";
import { useEditNodeErrors, useEditRiver } from "../edit/context";

type NodeProps = {
  children: React.ReactNode;
  className?: string;
  id: string;
  selected?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  contextMenu?: React.ReactNode;
};

const controlStyle = {
  background: "transparent",
  border: "none",
};

export const NodeShowLayout: React.FC<NodeProps> = ({
  id,
  children,
  className,
  selected,
  contextMenu,
  minWidth = 100,
  minHeight = 30,
  maxWidth = 800,
  maxHeight = 900,
}) => {
  const { showNodeErrors } = useEditRiver();

  const errors = useEditNodeErrors(id);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={id}
            className={cn(
              "rounded-xl border bg-card text-card-foreground shadow dark:border-gray-700 border-gray-400 w-full",
              "custom-drag-handle h-full z-10 group shadow relative border bg-sidebar ",
              className,
            )}
          >
            {children}

            {errors.length > 0 && showNodeErrors && (
              <div className="absolute translate-y-[-100%] top-0 left-[50%] translate-x-[-50%] pb-3 flex flex-col gap-2 min-w-[200px]">
                {errors.map((e) => (
                  <Card className="p-2 border-destructive text-xs max-w-md  animate-pulse">
                    {e.message}
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent>{contextMenu}</ContextMenuContent>
      </ContextMenu>
      <NodeResizeControl
        style={controlStyle}
        minWidth={100}
        minHeight={70}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        className=""
      >
        <div
          className={`${!selected && "hidden"
            }  absolute bottom-0 right-0 w-3 h-3 z-10 translate-x-[-1/2] translate-y-[-1/2] bg-white rounded-full shadow-md border-2 border-white dark:border-gray-800 dark:bg-gray-800 dark:shadow-none/0`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3536 11.3536C11.5488 11.1583 11.5488 10.8417 11.3536 10.6465L4.70711 4L9 4C9.27614 4 9.5 3.77614 9.5 3.5C9.5 3.22386 9.27614 3 9 3L3.5 3C3.36739 3 3.24021 3.05268 3.14645 3.14645C3.05268 3.24022 3 3.36739 3 3.5L3 9.00001C3 9.27615 3.22386 9.50001 3.5 9.50001C3.77614 9.50001 4 9.27615 4 9.00001V4.70711L10.6464 11.3536C10.8417 11.5488 11.1583 11.5488 11.3536 11.3536Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </NodeResizeControl>
    </>
  );
};
