import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCommand } from "@/providers/command/CommandContext";
import {
  ListNodeFragment,
  useNodeSearchLazyQuery,
} from "@/rekuest/api/graphql";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useContext, useEffect, useState } from "react";

export type Modifier<T extends { [key: string]: any } = {}> = {
  type: string;
  label: string;
  params?: T;
};

export type Context = {
  open: boolean;
  query: string;
  modifiers: Modifier[];
};

export type ExtensionContextType = Context & {
  activateModifier: (modifier: Modifier) => void;
  activeModifierTypes: string[];
};

export const ExtensionContext = React.createContext<ExtensionContextType>({
  open: false,
  query: "",
  activateModifier: (modifier: Modifier) => {},
  activeModifierTypes: [],
  modifiers: [],
});

const useExtension = () => useContext(ExtensionContext);

export const NodeExtensions = () => {
  const { query, activateModifier, activeModifierTypes } = useExtension();

  const [nodes, setNodes] = useState<ListNodeFragment[]>([]);

  const [searchNodes] = withRekuest(useNodeSearchLazyQuery)();

  useEffect(() => {
    if (
      query == undefined ||
      query == "" ||
      activeModifierTypes.includes("node")
    ) {
      setNodes([]);
      return;
    } else {
      searchNodes({ variables: { filters: { search: query } } })
        .then((res) => {
          setNodes(res.data?.nodes || []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [query, activeModifierTypes]);

  return (
    <CommandGroup heading="Nodes">
      {nodes?.map((node) => {
        return (
          <CommandItem
            key={node.id}
            value={node.id}
            onSelect={() => activateModifier({ type: "node", label: "Node" })}
          >
            {node.name}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
};

export const OneNodeExtensions = () => {
  const { query, activeModifierTypes } = useExtension();

  return (
    activeModifierTypes.includes("node") && (
      <CommandGroup heading="Do with node">
        <CommandItem>Reserve</CommandItem>
      </CommandGroup>
    )
  );
};

export const LocalActionExtensions = () => {
  const { actions } = useCommand();

  return (
    <CommandGroup heading="Local Actions">
      {actions?.map((action) => {
        return (
          <CommandItem
            key={action.key}
            value={action.key}
            onSelect={() => alert("Called")}
          >
            {action.label}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
};

export const CommandMenu = () => {
  const [context, setContext] = useState<Context>({
    open: false,
    query: "",
    modifiers: [],
  });
  const debouncedContext = useDebounce(context, 100);

  const activeModifierTypes = context.modifiers.map((m) => m.type);
  const updateQuery = (query: string) => {
    setContext((c) => ({ ...c, query }));
  };

  const activateModifier = (modifier: Modifier) => {
    setContext((c) => ({
      ...c,
      modifiers: [...c.modifiers, modifier],
      query: "",
    }));
  };

  const removeModifier = (index: number) => {
    setContext((c) => ({
      ...c,
      modifiers: c.modifiers.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "m" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setContext((c) => ({ ...c, open: !c.open }));
      }
      if (e.key === "," && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setContext((c) => ({ ...c, open: !c.open, query: "", modifiers: [] }));
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog
      open={context.open}
      onOpenChange={(open) => setContext((c) => ({ ...c, open: open }))}
    >
      <DialogContent className="overflow-hidden p-0 ">
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="Type a command or search..."
            onValueChange={updateQuery}
            value={context.query}
            className=""
          />
          <div className="text-xs flex flex-row gap-2 px-3 py-1">
            {context.modifiers.map((modifier, i) => (
              <Badge
                className="cursor-pointer"
                onClick={() => removeModifier(i)}
              >
                {modifier.type}
              </Badge>
            ))}
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <ExtensionContext.Provider
              value={{
                ...debouncedContext,
                activateModifier,
                activeModifierTypes,
              }}
            >
              <NodeExtensions />
              <OneNodeExtensions />
              <LocalActionExtensions />
            </ExtensionContext.Provider>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
