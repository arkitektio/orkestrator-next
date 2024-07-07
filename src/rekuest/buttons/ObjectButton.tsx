import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { CaretDownIcon } from "@radix-ui/react-icons";
import React from "react";
import { toast } from "sonner";
import { PrimaryNodeFragment, usePrimaryNodesQuery } from "../api/graphql";
import { useNodeAction } from "../hooks/useNodeAction";


export const AssignButton = (props: { object: string; node: PrimaryNodeFragment, children: React.ReactNode}) => {
  const {assign, latestAssignation} = useNodeAction({id: props.node.id});

  const objectAssign = async () => {


    let the_key = props.node.args?.at(0)?.key
    if (!the_key) {
      toast.error("No key found")
      return
    }
    try {
      await assign({
            node: props.node.id,
            args: {
              [the_key]: props.object,
            },
          });
    } catch (e) {
      toast.error(e.message)
    }
  };

  return (
    <Tooltip >
      <TooltipTrigger asChild>
    <Button onClick={objectAssign} variant={"outline"} size="sm" className="flex-1">
      {props.children}
    </Button>
    </TooltipTrigger>
    <TooltipContent>
      {props.node.description}
    </TooltipContent>
    </Tooltip>
  );
};


export const ApplicableNodes = (props: {
    object: string
    identifier: string
}) => {

    const { data}  = withRekuest(usePrimaryNodesQuery)({
        variables: {
            identifier: props.identifier,
        }
    })


    return <div className="flex flex-row gap-2 w-full ">
    {data?.nodes.map(x => <AssignButton node={x} object={props.object}>{x.name}</AssignButton>)}
    
    </div>

}

export type ObjectButtonProps = 
  {
    object: string;
    identifier: string
    children?: React.ReactNode;
    className?: string;
  }

export const ObjectButton = (props: ObjectButtonProps ) => {
  return (
    <>
      <>
        <Popover>
          <PopoverTrigger asChild>{props.children || <Button size={"icon"} variant={"outline"} className="w-4 h-4"><CaretDownIcon className={cn("w-3 h-3", props.className)}/></Button>}</PopoverTrigger>
          <PopoverContent className="text-white border-gray-800 px-1 py-1">
            <ApplicableNodes object={props.object} identifier={props.identifier}/>
          </PopoverContent>
        </Popover>
      </>
    </>
  );
};
