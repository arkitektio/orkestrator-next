import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { NodeResizer, NodeResizeControl } from "reactflow";

const additional = {
  pink: "border-pink-500 shadow-pink-500/5 dark:border-pink-200 dark:shadow-pink-200/10",
  blue: "border-blue-500 shadow-blue-500/50 dark:border-blue-200 dark:shadow-blue-200/10",
  green:
    "border-green-500 shadow-green-500/50 dark:border-green-200 dark:shadow-green-200/10",
  red: "border-red-500 shadow-red-500/50 dark:border-red-200 dark:shadow-red-200/10",
};

type NodeProps = {
  children: React.ReactNode;
  color?: keyof typeof additional;
  id: string;
  selected?: boolean;
};

const controlStyle = {
  background: "transparent",
  border: "none",
};

export const NodeShowLayout: React.FC<NodeProps> = ({
  children,
  id,
  color = "pink",
  selected,
}) => {
  return (
    <>
      <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50}>
        <div
          className={`${
            !selected && "hidden"
          }  absolute top-0 left-0 w-3 h-3  translate-x-[-110%] translate-y-[-110%] `}
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
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className={`custom-drag-handle h-full group ${
              selected && additional[color]
            } `}
          >
            {children}
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
