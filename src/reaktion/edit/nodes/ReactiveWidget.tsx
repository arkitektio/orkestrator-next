import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Constants } from "@/reaktion/base/Constants";
import { InStream } from "@/reaktion/base/Instream";
import { OutStream } from "@/reaktion/base/Outstream";
import { ReactiveImplementation } from "@/rekuest/api/graphql";
import React from "react";
import { ReactiveNodeData, ReactiveNodeProps } from "../../types";
import { portToLabel } from "@jhnnsrs/rekuest-next";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { useEditRiver } from "../context";
import { useReactFlow, useUpdateNodeInternals } from "reactflow";

export type ShapeProps = {
  implementation: ReactiveImplementation;
  data: ReactiveNodeData;
  id: string;
};

export type ContextMenuProps = {
  implementation: ReactiveImplementation;
  data: ReactiveNodeData;
  id: string;
};

export const TriangleToRight = ({ data, implementation }: ShapeProps) => {
  return (
    <>
      <svg height="40" width="40">
        <polygon
          points="0,40 40,20 0,0"
          style={{
            strokeWidth: 1,
            stroke: "hsl(var(--accent))",
            fill: "hsl(var(--accent))",
          }}
        />
        <text>{implementation}</text>
      </svg>
    </>
  );
};

export const Default = ({ data }: ShapeProps) => {
  return (
    <>
      <Card className="rounded-md border-blue-400/40 shadow-blue-400/20 dark:border-blue-300 dark:shadow-blue/20 shadow-xl">
        <CardHeader className="p-1">
          <Tooltip>
            <TooltipTrigger>
              <CardTitle className="text-sm font-light">{data.title}</CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <CardDescription className="text-xs">
                {data.description}
              </CardDescription>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

export const ToList = ({ data }: ShapeProps) => {
  let firstItem = data?.ins?.at(0)?.at(0);
  let outItem = data?.outs?.at(0)?.at(0);
  return (
    <>
      <Card className="rounded-md">
        <CardHeader className="p-1">
          <Tooltip>
            <TooltipTrigger>
              <CardTitle className="text-xs">{data.title}</CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <CardDescription className="text-xs">
                {data.description}
                <div className="text-xs mt-0">
                  here {firstItem && portToLabel(firstItem)} to{" "}
                  {outItem && portToLabel(outItem)}
                </div>
              </CardDescription>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

export const DefaultContext = ({ data }: ContextMenuProps) => {
  return (
    <>
      <Card className="rounded-md">
        <CardHeader className="p-1">
          <Tooltip>
            <TooltipTrigger>
              <CardTitle className="text-xs">{data.title}</CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <CardDescription className="text-xs">
                {data.description}
              </CardDescription>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

export const ChangeZipImplementation = ({ data, id }: ContextMenuProps) => {
  const { updateData } = useEditRiver();
  const updateNodeInternal = useUpdateNodeInternals();

  const changeImplementation = (implementation: ReactiveImplementation) => {
    updateData({ implementation: implementation }, id);
    updateNodeInternal(id);
  };

  return (
    <>
      <div className="text-xs">Change Implementation</div>
      <div className="text-xs">Current: {data.implementation}</div>
      <div className="flex flex-row gap-2">
        {[
          ReactiveImplementation.Zip,
          ReactiveImplementation.Combinelatest,
          ReactiveImplementation.Withlatest,
        ].map((i) => (
          <Button
            onClick={() => changeImplementation(i)}
            disabled={data.implementation == i}
          >
            {i}
          </Button>
        ))}
      </div>
    </>
  );
};

const contextMenuMap: {
  [key in ReactiveImplementation]: React.FC<ContextMenuProps>;
} = {
  [ReactiveImplementation.Combinelatest]: ChangeZipImplementation,
  [ReactiveImplementation.Withlatest]: ChangeZipImplementation,
  [ReactiveImplementation.Zip]: ChangeZipImplementation,
  [ReactiveImplementation.Gate]: DefaultContext,
  [ReactiveImplementation.Filter]: DefaultContext,
  [ReactiveImplementation.Split]: DefaultContext,
  [ReactiveImplementation.ToList]: DefaultContext,
  [ReactiveImplementation.BufferComplete]: DefaultContext,
  [ReactiveImplementation.Chunk]: DefaultContext,
  [ReactiveImplementation.Omit]: DefaultContext,
  [ReactiveImplementation.Add]: DefaultContext,
  [ReactiveImplementation.All]: DefaultContext,
  [ReactiveImplementation.And]: DefaultContext,
  [ReactiveImplementation.BufferUntil]: DefaultContext,
  [ReactiveImplementation.Delay]: DefaultContext,
  [ReactiveImplementation.DelayUntil]: DefaultContext,
  [ReactiveImplementation.Divide]: DefaultContext,
  [ReactiveImplementation.Ensure]: DefaultContext,
  [ReactiveImplementation.Foreach]: DefaultContext,
  [ReactiveImplementation.If]: DefaultContext,
  [ReactiveImplementation.Modulo]: DefaultContext,
  [ReactiveImplementation.Power]: DefaultContext,
  [ReactiveImplementation.Prefix]: DefaultContext,
  [ReactiveImplementation.Subtract]: DefaultContext,
  [ReactiveImplementation.Multiply]: DefaultContext,
  [ReactiveImplementation.Suffix]: DefaultContext,
};

const shapeMap: { [key in ReactiveImplementation]: React.FC<ShapeProps> } = {
  [ReactiveImplementation.Combinelatest]: TriangleToRight,
  [ReactiveImplementation.Withlatest]: TriangleToRight,
  [ReactiveImplementation.Zip]: TriangleToRight,
  [ReactiveImplementation.Gate]: Default,
  [ReactiveImplementation.Filter]: Default,
  [ReactiveImplementation.Split]: Default,
  [ReactiveImplementation.ToList]: ToList,
  [ReactiveImplementation.BufferComplete]: Default,
  [ReactiveImplementation.Chunk]: Default,
  [ReactiveImplementation.Omit]: Default,
  [ReactiveImplementation.Add]: Default,
  [ReactiveImplementation.All]: Default,
  [ReactiveImplementation.And]: Default,
  [ReactiveImplementation.BufferUntil]: Default,
  [ReactiveImplementation.Delay]: Default,
  [ReactiveImplementation.DelayUntil]: Default,
  [ReactiveImplementation.Divide]: Default,
  [ReactiveImplementation.Ensure]: Default,
  [ReactiveImplementation.Foreach]: Default,
  [ReactiveImplementation.If]: Default,
  [ReactiveImplementation.Modulo]: Default,
  [ReactiveImplementation.Power]: Default,
  [ReactiveImplementation.Prefix]: Default,
  [ReactiveImplementation.Subtract]: Default,
  [ReactiveImplementation.Multiply]: Default,
  [ReactiveImplementation.Suffix]: Default,
};

const shapeForImplementation = (
  implementation: ReactiveImplementation,
): React.FC<ShapeProps> => {
  return shapeMap[implementation];
};

const contextMenuForImplementation = (
  implementation: ReactiveImplementation,
): React.FC<ContextMenuProps> => {
  return contextMenuMap[implementation];
};

export const ReactiveTrackNodeWidget: React.FC<ReactiveNodeProps> = ({
  data,
  id,
}) => {
  const Shape = shapeForImplementation(data.implementation);
  const ContextMenuImplementatoin = contextMenuForImplementation(
    data.implementation,
  );
  return (
    <>
      {/* <AssignEventOverlay event={data.latestAssignEvent} />
				<ProvideEventOverlay event={data.latestProvideEvent} /> */}
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="group custom-drag-handle relative">
            {data.ins.map((s, index) => (
              <InStream stream={s} id={index} length={data.ins.length} />
            ))}
            <Popover>
              <PopoverTrigger>
                <Shape
                  implementation={data.implementation}
                  data={data}
                  id={id}
                />
              </PopoverTrigger>
              <PopoverContent>
                {data?.constants.length > 0 ? (
                  <Constants
                    ports={data.constants}
                    overwrites={data.constantsMap}
                  />
                ) : (
                  "No configuration needed"
                )}
              </PopoverContent>
            </Popover>

            {data.outs.map((s, index) => (
              <OutStream stream={s} id={index} length={data.outs.length} />
            ))}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuImplementatoin
            implementation={data.implementation}
            data={data}
            id={id}
          />
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
