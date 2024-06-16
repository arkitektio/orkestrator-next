import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { Structure } from "@/types";
import { DropTargetMonitor, useDrop } from "react-dnd";

export const useSmartDrop = (
  callback: (
    structures: Structure[],
    monitor: DropTargetMonitor<unknown, unknown>,
  ) => void,
  deps?: any[],
) =>
  useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],
      drop: (item, monitor) => {
        if (item && Array.isArray(item)) {
          // We are dealing with a Smart model in the same window
          return callback(item as Structure[], monitor);
        }

        console.log("fff");

        // We might be dealing with a remote window object

        let text = monitor.getItem()?.text;

        console.log("External drop", text);
        if (text) {
          let structure: Structure = JSON.parse(text);
          return callback([structure], monitor);
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
            position: monitor.getClientOffset(),
          };
        }

        let item = monitor.getItem() as Structure[] | null;
        console.log(item);
        return {
          isOver: !!monitor.isOver(),
          overItems: [],
          position: monitor.getClientOffset(),
          canDrop: !!monitor.canDrop(),
        };
      },
    };
  }, deps);
