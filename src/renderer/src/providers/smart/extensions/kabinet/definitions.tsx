import { useRekuest } from "@/app/Arkitekt";
import { CommandItem } from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ListDefinitionFragment,
  useAllPrimaryDefinitionsQuery,
} from "@/kabinet/api/graphql";
import {
  DemandKind,
  PortDemandInput,
  PortKind,
  useAllActionsQuery,
} from "@/rekuest/api/graphql";
import { useHashActionWithProgress } from "@/rekuest/hooks/useHashActionWithProgress";
import { CommandGroup } from "cmdk";
import React from "react";
import type { PassDownProps } from "../types";
import { KabinetDefinition } from "@/linkers";

type InstallAction = {
  id: string;
  hash: string;
  name: string;
  description?: string | null;
};

export const InstallButton = (props: {
  definition: ListDefinitionFragment;
  action: InstallAction;
  children: React.ReactNode;
}) => {
  const client = useRekuest();
  const { assign, progress, installed } = useHashActionWithProgress({
    hash: props.action.hash,
    onDone: () => {
      void client.refetchQueries({ include: ["AllPrimaryActions"] });
    },
  });

  return (
    <CommandItem
      value={`install-${props.definition.id}-${props.action.id}`}
      onSelect={() => {
        void assign({ definition: {object: props.definition.id, __identifier: KabinetDefinition.identifier } });
      }}
      className="flex-1"
      style={{
        backgroundSize: `${progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
      disabled={!installed}
    >
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-col">
            <div className="text-md text-gray-100 text-left">
              {props.definition.name}
            </div>
            <div className="text-xs text-gray-400 text-left">
              {props.definition.description} on
            </div>
          </div>
          <div className="flex-grow" />
        </TooltipTrigger>
        <TooltipContent>{props.definition.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const ApplicableDefinitions = (props: PassDownProps) => {
  const demands: PortDemandInput[] = [];

  if (props.objects.length === 1) {
    demands.push({
      kind: DemandKind.Args,
      matches: [{ at: 0, kind: PortKind.Structure, identifier: props.objects[0].identifier }],
    });
  }

  if (props.objects.length > 1) {
    demands.push({
      kind: DemandKind.Args,
      matches: [{
        at: 0,
        kind: PortKind.List,
        children: [{ at: 0, kind: PortKind.Structure, identifier: props.objects[0].identifier }],
      }],
    });
  }

  if (props.partners && props.partners.length === 1) {
    demands.push({
      kind: DemandKind.Args,
      matches: [{ at: 1, kind: PortKind.Structure, identifier: props.partners[0].identifier }],
    });
  }

  if (props.partners && props.partners.length > 1) {
    demands.push({
      kind: DemandKind.Args,
      matches: [{
        at: 1,
        kind: PortKind.List,
        children: [{ at: 1, kind: PortKind.Structure, identifier: props.partners[0].identifier }],
      }],
    });
  }

  const { data: enginesData } = useAllActionsQuery({
    variables: {
      filters: {
        demands: [
          {
            kind: DemandKind.Args,
            matches: [{ at: 0, kind: PortKind.Structure, identifier: "@kabinet/definition" }],
          },
          {
            kind: DemandKind.Returns,
            matches: [{ at: 0, kind: PortKind.Structure, identifier: "@kabinet/pod" }],
          },
        ],
      },
    },
    fetchPolicy: "cache-first",
  });

  const { data } = useAllPrimaryDefinitionsQuery({
    variables: {
      filters: {
        demands,
        search: props.filter && props.filter !== "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (!data || data.definitions.length === 0) {
    return null;
  }

  if (!enginesData || enginesData.actions.length === 0) {
    return <>No install action found</>;
  }

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Installable
        </span>
      }
    >
      {data.definitions.map((definition) => (
        <React.Fragment key={definition.id}>
          {enginesData.actions.map((action) => (
            <InstallButton
              definition={definition}
              key={`${definition.id}-${action.id}`}
              action={action as InstallAction}
            >
              {definition.name}
            </InstallButton>
          ))}
        </React.Fragment>
      ))}
    </CommandGroup>
  );
};
