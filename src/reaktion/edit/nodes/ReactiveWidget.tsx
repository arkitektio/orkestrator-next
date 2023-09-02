import React from "react";
import { Handle, Position } from "reactflow";
import { ReactiveNodeData, ReactiveNodeProps } from "../../types";
import { PortFragment, ReactiveImplementation } from "@/rekuest/api/graphql";
import { usePortForm } from "@/pages/Reservation";
import { useWidgetRegistry } from "@jhnnsrs/rekuest-next";
import { toast } from "@/components/ui/use-toast";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { Form } from "@/components/ui/form";
import { InStream } from "@/reaktion/base/Instream";
import { OutStream } from "@/reaktion/base/Outstream";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Constants } from "@/reaktion/base/Constants";

export type ShapeProps = {
  implementation: ReactiveImplementation;
  data: ReactiveNodeData;
};

export const ZipProps = ({ data }: ShapeProps) => {
  return (
    <>
      <svg height="40" width="40">
        <polygon
          points="0,40 40,20 0,0"
          style={{
            strokeWidth: 1,
            stroke: "hsl(var(--secondary))",
            fill: "hsl(var(--secondary))",
          }}
        />
      </svg>
    </>
  );
};

const shapeMap: { [key in ReactiveImplementation]: React.FC<ShapeProps> } = {
  [ReactiveImplementation.Combinelatest]: ZipProps,
  [ReactiveImplementation.Withlatest]: ZipProps,
  [ReactiveImplementation.Zip]: ZipProps,
  [ReactiveImplementation.Gate]: ZipProps,
  [ReactiveImplementation.Filter]: ZipProps,
  [ReactiveImplementation.Split]: ZipProps,
  [ReactiveImplementation.ToList]: ZipProps,
  [ReactiveImplementation.BufferComplete]: ZipProps,
  [ReactiveImplementation.Chunk]: ZipProps,
  [ReactiveImplementation.Omit]: ZipProps,
  [ReactiveImplementation.Add]: ZipProps,
  [ReactiveImplementation.All]: ZipProps,
  [ReactiveImplementation.And]: ZipProps,
  [ReactiveImplementation.BufferUntil]: ZipProps,
  [ReactiveImplementation.Delay]: ZipProps,
  [ReactiveImplementation.DelayUntil]: ZipProps,
  [ReactiveImplementation.Divide]: ZipProps,
  [ReactiveImplementation.Ensure]: ZipProps,
  [ReactiveImplementation.Foreach]: ZipProps,
  [ReactiveImplementation.If]: ZipProps,
  [ReactiveImplementation.Modulo]: ZipProps,
  [ReactiveImplementation.Power]: ZipProps,
  [ReactiveImplementation.Prefix]: ZipProps,
  [ReactiveImplementation.Subtract]: ZipProps,
  [ReactiveImplementation.Multiply]: ZipProps,
  [ReactiveImplementation.Suffix]: ZipProps,
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
