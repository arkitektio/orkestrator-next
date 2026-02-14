import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import { ReactiveImplementation } from "@/reaktion/api/graphql";
import { InStream } from "@/reaktion/base/Instream";
import { OutStream } from "@/reaktion/base/Outstream";
import { portToLabel } from "@/rekuest/widgets/utils";
import React from "react";
import { ReactiveNodeData, ReactiveNodeProps } from "../../types";

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
              <CardTitle className="text-sm font-light">
                <ActionDescription
                  description={data.title}
                  variables={{ ...data.constantsMap, __ports: data.ins }}
                />
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <CardDescription className="text-xs">
                <ActionDescription
                  description={data.description}
                  variables={data.constantsMap}
                />
              </CardDescription>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

export const Select = ({ data }: ShapeProps) => {
  return (
    <>
      <Card className="rounded-md border-blue-400/40 shadow-blue-400/20 dark:border-blue-300 dark:shadow-blue/20 shadow-xl">
        <CardHeader className="p-1">
          <Tooltip>
            <TooltipTrigger>
              <CardTitle className="text-sm font-light">
                Select {data.voids.at(data.constantsMap.i)?.key}
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <CardDescription className="text-xs">
                <ActionDescription
                  description={data.description}
                  variables={data.constantsMap}
                />
              </CardDescription>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

export const Just = ({ data }: ShapeProps) => {
  return (
    <>
      <Card className="rounded-md border-blue-400/40 shadow-blue-400/20 dark:border-blue-300 dark:shadow-blue/20 shadow-xl">
        <CardHeader className="p-1">
          <Tooltip>
            <TooltipTrigger>
              <CardTitle className="text-sm font-light">
                Just <pre>{data.constantsMap.value}</pre>
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <CardDescription className="text-xs">
                Just a {data.constantsMap.value}
              </CardDescription>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

export const Add = ({ data }: ShapeProps) => {
  return (
    <>
      <Card className="rounded-md border-blue-400/40 shadow-blue-400/20 dark:border-blue-300 dark:shadow-blue/20 shadow-xl">
        <CardHeader className="p-1">
          <Tooltip>
            <TooltipTrigger>
              <CardTitle className="text-sm font-light">
                Add <pre>{data.constantsMap.value}</pre>
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <CardDescription className="text-xs">
                Just add {data.constantsMap.value}
              </CardDescription>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

export const Reorder = ({ data }: ShapeProps) => {
  return (
    <>
      <Card className="rounded-md border-blue-400/40 shadow-blue-400/20 dark:border-blue-300 dark:shadow-blue/20 shadow-xl">
        <CardHeader className="p-1">
          <Tooltip>
            <TooltipTrigger>
              <>
                <CardTitle className="text-sm font-light">Reorders</CardTitle>
                <CardDescription>
                  {data.constantsMap.map && (
                    <>
                      {Object.keys(data.constantsMap.map).map((key) => (
                        <div className="text-xs">
                          {" "}
                          {data.ins.at(0)?.at(parseInt(key))?.kind} to{" "}
                          {
                            data.outs.at(0)?.at(data.constantsMap.map[key])
                              ?.kind
                          }
                        </div>
                      ))}
                    </>
                  )}
                </CardDescription>
              </>
            </TooltipTrigger>
            <TooltipContent>
              <CardDescription className="text-xs">Just a</CardDescription>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
      </Card>
    </>
  );
};

export const ToList = ({ data }: ShapeProps) => {
  const firstItem = data?.ins?.at(0)?.at(0);
  const outItem = data?.outs?.at(0)?.at(0);
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
  return (
    <>
      <div className="text-xs">Current: {data.implementation}</div>
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
  [ReactiveImplementation.BufferCount]: DefaultContext,
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
  [ReactiveImplementation.Select]: DefaultContext,
  [ReactiveImplementation.Just]: DefaultContext,
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
  [ReactiveImplementation.Add]: Add,
  [ReactiveImplementation.All]: Default,
  [ReactiveImplementation.And]: Default,
  [ReactiveImplementation.BufferUntil]: Default,
  [ReactiveImplementation.Reorder]: Reorder,
  [ReactiveImplementation.BufferCount]: Default,
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
  [ReactiveImplementation.Select]: Select,
  [ReactiveImplementation.Just]: Just,
};

const shapeForImplementation = (
  implementation: ReactiveImplementation,
): React.FC<ShapeProps> => {
  return shapeMap[implementation] || Default;
};

const contextMenuForImplementation = (
  implementation: ReactiveImplementation,
): React.FC<ContextMenuProps> => {
  return contextMenuMap[implementation] || DefaultContext;
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
              <PopoverContent></PopoverContent>
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
