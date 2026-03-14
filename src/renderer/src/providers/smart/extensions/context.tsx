import { Guard } from "@/app/Arkitekt";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PlayIcon } from "lucide-react";
import React from "react";
import { ApplicableDefinitions } from "./kabinet/definitions";
import { ApplicableRelations } from "./kraph/relations";
import { ApplicableLocalActions } from "./local/localactions";
import { ApplicableActions, ApplicableBatchActions } from "./rekuest/actions";
import { ApplicableShortcuts } from "./rekuest/shortcuts";
import type { ObjectButtonProps, SmartContextProps } from "./types";

export const ObjectButton = (props: ObjectButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        {props.children || (
          <Button
            variant={props.variant || "outline"}
            className={cn(props.className, "text-white")}
            size={props.size || "icon"}
          >
            <PlayIcon />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="text-white border-gray-800 px-2 py-2 items-left"
        data-nonbreaker
      >
        <SmartContext {...props} />
      </PopoverContent>
    </Popover>
  );
};

export const SmartContext = (props: SmartContextProps) => {
  const [filter, setFilterValue] = React.useState<string | undefined>(undefined);

  return (
    <>
      <>
        {props.objects.length > 1 && (
          <div className="flex flex-row text-xs bg-gray-800 rounded-md px-2 py-1">
            {props.objects.length} {props.objects.at(0)?.identifier}
          </div>
        )}
        {props.partners && props.partners.length >= 1 && (
          <div className="flex flex-row text-xs bg-gray-800 rounded-md px-2 py-1">
            with {props.partners.length} {props.partners.at(0)?.identifier}
          </div>
        )}
      </>
      <div className="h-2" />

      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search"
          className="h-9"
          onValueChange={(value) => {
            setFilterValue(value);
          }}
          autoFocus
        />

        <CommandList>
          <ApplicableLocalActions {...props} filter={filter} />
          <CommandEmpty>No Action available</CommandEmpty>
          <Guard.Rekuest fallback={<></>}>
            {!props.disableShortcuts && (
              <ApplicableShortcuts {...props} filter={filter} />
            )}
          </Guard.Rekuest>

          <Guard.Kraph fallback={<></>}>
            {!props.disableKraph && (
              <ApplicableRelations {...props} filter={filter} />
            )}
          </Guard.Kraph>

          <Guard.Rekuest fallback={<></>}>
            {!props.disableActions && (
              <ApplicableActions {...props} filter={filter} />
            )}
            {!props.disableBatchActions && (
              <ApplicableBatchActions {...props} filter={filter} />
            )}
          </Guard.Rekuest>

          <Guard.Kabinet fallback={<></>}>
            {!props.disableKabinet && (
              <ApplicableDefinitions {...props} filter={filter} />
            )}
          </Guard.Kabinet>
        </CommandList>
      </Command>
    </>
  );
};
