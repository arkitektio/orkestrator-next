import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Constants } from "@/reaktion/base/Constants";
import { InStream } from "@/reaktion/base/Instream";
import { OutStream } from "@/reaktion/base/Outstream";
import { ReactiveImplementation } from "@/rekuest/api/graphql";
import React from "react";
import { ReactiveNodeData, ReactiveNodeProps } from "../../types";

export type ShapeProps = {
  implementation: ReactiveImplementation;
  data: ReactiveNodeData;
};

export const TriangleToRight = ({ data }: ShapeProps) => {
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
      </svg>
    </>
  );
};

export const Default = ({ data }: ShapeProps) => {
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
          </CardDescription></TooltipContent>

          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

const shapeMap: { [key in ReactiveImplementation]: React.FC<ShapeProps> } = {
  [ReactiveImplementation.Combinelatest]: TriangleToRight,
  [ReactiveImplementation.Withlatest]: TriangleToRight,
  [ReactiveImplementation.Zip]: TriangleToRight,
  [ReactiveImplementation.Gate]: Default,
  [ReactiveImplementation.Filter]: Default,
  [ReactiveImplementation.Split]: Default,
  [ReactiveImplementation.ToList]: Default,
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

export const ReactiveTrackNodeWidget: React.FC<ReactiveNodeProps> = ({
  data,
  id,
}) => {
  const Shape = shapeForImplementation(data.implementation);
  return (
    <>
      {/* <AssignEventOverlay event={data.latestAssignEvent} />
				<ProvideEventOverlay event={data.latestProvideEvent} /> */}
      <div className="group custom-drag-handle relative">
        {data.ins.map((s, index) => (
          <InStream stream={s} id={index} length={data.ins.length} />
        ))}
        <Popover>
          <PopoverTrigger>
            <Shape implementation={data.implementation} data={data} />
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
    </>
  );
};
