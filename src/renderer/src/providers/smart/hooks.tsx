import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { Structure } from "@/types";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

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
        let text = item.text;

        if (text) {
          let structure: Structure = JSON.parse(text);
          callback([structure], monitor);
        } else callback(item, monitor);
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
