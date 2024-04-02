import { Popover, PopoverContent } from "@/components/ui/popover";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { PopoverAnchor } from "@radix-ui/react-popover";
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { NativeTypes, getEmptyImage } from "react-dnd-html5-backend";
import { SmartModelProps } from "./types";
import { Mates } from "./Mates";
import { Structure } from "@/types";
import { composeMates } from "@/mates/compose";
import { Card } from "@/components/ui/card";
import { useMySelection } from "../selection/SelectionContext";
import { Button } from "@/components/ui/button";

export const SmartModel = ({
  showSelfMates = true,
  showSelectingIndex = true,
  hover = false,
  mates,
  ...props
}: SmartModelProps) => {
  const self: Structure = {
    identifier: props.identifier,
    id: props.object,
  };

  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      const listener = {
        handleEvent: (e: Event) => {
          e.stopPropagation();
          setShow(false);
        },
      };
      document.addEventListener("click", listener);

      return () => {
        document.removeEventListener("click", listener);
      };
    }
  }, [show]);

  const onProgress = async (progress: number | undefined) => {
    setProgress(progress);
  };

  const [{ isOver, canDrop, overItems }, drop] = useDrop(() => {
    return {
      accept: [NativeTypes.TEXT],
      drop: (item, monitor) => {
        if (!monitor.didDrop()) {
          console.log("Ommitting Parent Drop");
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
          };
        }


        let item = monitor.getItem() as Structure[] | null;
        console.log(item);
        return {
          isOver: !!monitor.isOver(),
          overItems: [],
          canDrop: !!monitor.canDrop(),
        };
      },
    };
  });

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: SMART_MODEL_DROP_TYPE,
      item: [self],
      collect: (monitor) => {
        console.log("Draging")
        
        return {
        isDragging: monitor.isDragging(),
      }},
    }),
    [self],
  );

  const {
    isSelected,
  } = useMySelection({ identifier: props.identifier, id: props.object });


  

  const dragClassNameFunc = props.dragClassName || (({}) => "");

  const dropClassNameFunc =
    props.dropClassName ||
    (({ isOver, canDrop, progress }) =>
      `${props.className} ${
        hover &&
        "hover:scale-110 transition-all ease-in-out duration-200 group hover:shadow-xl hover:shadow border-2 border-hidden"
      } ${isOver && "border-solid "} ${progress && "animate-pulse"}`);

  return (
    <div
      ref={drop}
      data-disableselect
      data-identifier={props.identifier}
      data-object={props.object}
      onContextMenu={(e) => {
        setShow(!show);
        e.preventDefault();
      }}
    >
      <Popover open={isOver || show}>
        <PopoverContent side="bottom" sideOffset={-10}>
          {(isOver || show) && (
            <Mates
              self={self}
              onProgress={onProgress}
              withSelf={true}
              overItems={overItems ? overItems : [self]}
              onDone={async () => setShow(false)}
              onError={async () => setShow(false)}
              mateFinder={mates && composeMates(mates)}
            />
          )}
        </PopoverContent>
        <PopoverAnchor
          ref={drag}
          data-draggable
          className={dragClassNameFunc({
            isDragging,
            isOver,
            canDrop,
            progress,
          })}
          style={
            props.dragStyle &&
            props.dragStyle({
              isDragging,
              isOver,
              canDrop,
              progress,
            })
          }
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData("text", JSON.stringify(self));
          }}
        >
          {isSelected && <Card className="border-2 absolute border-solid border-primary" />}{props.children}
          {isDragging && <Button>hallo</Button>}
        </PopoverAnchor>
      </Popover>
    </div>
  );
};
