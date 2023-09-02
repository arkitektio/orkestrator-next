import { Popover } from "@/components/ui/popover";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import { PopoverAnchor, PopoverContent } from "@radix-ui/react-popover";
import React, { Fragment, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

export type ClassNameOptions = {
  isOver: boolean;
  isDragging: boolean;
  canDrop: boolean;
  progress: number | undefined;
};

export type DropObject = {
  identifier: string;
  object: any;
};

export interface SmartModelProps {
  identifier: string;
  object: string;
  as?: HTMLElement;
  children: React.ReactNode;
  showSelectingIndex?: boolean;
  containerClassName?: string;
  dragClassName?: (props: ClassNameOptions) => string;
  dropClassName?: (props: ClassNameOptions) => string;
  dragStyle?: (props: ClassNameOptions) => React.CSSProperties;
  dropStyle?: (props: ClassNameOptions) => React.CSSProperties;
  hover?: boolean;
  showSelfMates?: boolean;
  className?: string;
}

export const SmartModel = ({
  showSelfMates = true,
  showSelectingIndex = true,
  hover = false,
  ...props
}: SmartModelProps) => {
  const self = {
    identifier: props.identifier,
    id: props.object,
  };
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [show, setShow] = useState(false);

  const on_progress = async (x: number | undefined) => {
    setProgress(x);
  };

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

  const [{ isOver, canDrop, overItems }, drop] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],
      drop: (item, monitor) => {
        if (!monitor.didDrop()) {
          console.log("Ommitting Parent Drop");
        }
        return {};
      },
      collect: (monitor) => {
        let item = monitor.getItem() as DropObject[] | null;
        return {
          isOver: !!monitor.isOver(),
          overItems: item,
          canDrop: !!monitor.canDrop(),
        };
      },
    };
  });

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: SMART_MODEL_DROP_TYPE,
      item: [self],
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [self],
  );

  useEffect(() => {
    preview(getEmptyImage(), {
      captureDraggingState: true,
    });
  }, []);

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
      className={dropClassNameFunc({
        isDragging,
        isOver,
        canDrop,
        progress,
      })}
      style={
        props.dropStyle &&
        props.dropStyle({
          isDragging,
          isOver,
          canDrop,
          progress,
        })
      }
      onDoubleClick={() => {
        setShow(!show);
      }}
      onContextMenu={(e) => {
        setShow(!show);
        e.preventDefault();
      }}
    >
      <Popover open={isOver || show}>
        <PopoverContent> I am open sodinfsoidfnsodin</PopoverContent>
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
          {props.children}
        </PopoverAnchor>
      </Popover>
    </div>
  );
};
