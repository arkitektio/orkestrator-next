import { Button } from "@/components/ui/button";
import { Mate, MateOptions } from "@/mates/types";
import { Structure } from "@/types";
import React, { useEffect } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { SMART_MODEL_DROP_TYPE } from "../../constants";
import { useSelection } from "../selection/SelectionContext";

export interface MateProps {
  mate: Mate;
  self: Structure;
  options?: MateOptions;
  focus?: boolean;
  clickable?: boolean;
  onProgress: (x: number | undefined) => Promise<void>;
  onDone?: () => Promise<void>;
  onError?: (error: Error) => Promise<void>;
}

export const MateRender: React.FC<MateProps> = ({
  mate,
  self,
  focus = false,
  onProgress: prog,
  clickable = false,
  onDone,
  onError,
}) => {
  const { selection } = useSelection();

  const click = (e: any) => {
    console.log("click");
    if (clickable) {
      e.stopPropagation();
      console.log("clickable");
      mate
        .action({
          self: self,
          partners: selection && selection.length > 0 ? selection : [self],
          progress: prog,
        })
        .then(() => {
          onDone && onDone();
          console.log("done");
        })
        .catch((error) => {
          console.log(error);
          onError && onError(error);
        });
    }
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],
      drop: (partners: Structure[], monitor) => {
        if (monitor.getItemType() == NativeTypes.HTML) {
          return;
        }
        let item = monitor.getItem();
        console.log(partners);
        mate
          .action({
            self: self,
            partners: item,
            progress: prog,
          })
          .then(() => {
            prog(undefined);
            onDone && onDone();
            console.log("done");
          })
          .catch((error) => {
            prog(undefined);
            console.log(error);
            onError && onError(error);
          });
        return {};
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    };
  }, []);

  useEffect(() => {
    if (focus) {
      const listener = {
        handleEvent: (e: KeyboardEvent) => {
          if (e.key === " ") {
            e.stopPropagation();
            mate
              .action({
                self: self,
                partners:
                  selection && selection.length > 0 ? selection : [self],
                progress: prog,
              })
              .then(() => {
                console.log("done");
                onDone && onDone();
                prog(undefined);
              })
              .catch((error) => {
                prog(undefined);
                console.log(error);
                onError && onError(error);
              });
          }
        },
      };
      document.addEventListener("keydown", listener);

      return () => {
        document.removeEventListener("keydown", listener);
      };
    }
  }, [focus]);

  return (
    <Button ref={drop} onClick={click}>
      {mate?.label}
    </Button>
  );
};
