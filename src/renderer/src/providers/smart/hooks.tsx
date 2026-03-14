import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { Structure } from "@/types";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { resolveSmartDrop } from "./dropUtils";

export const useSmartDrop = (
  callback: (
    structures: Structure[],
    monitor: DropTargetMonitor<unknown, unknown>,
  ) => void,
  deps?: any[],
) =>
  useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE, NativeTypes.TEXT],
      drop: (item, monitor) => {
        console.log("drop", item);
        const resolvedDrop = resolveSmartDrop(item, monitor.getItemType());

        if (resolvedDrop) {
          callback(resolvedDrop.partners, monitor);
        }
        return {};
      },
      collect: (monitor) => {
        return {
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        };
      },
    };
  }, deps);
