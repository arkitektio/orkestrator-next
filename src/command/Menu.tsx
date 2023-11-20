import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGlobalSearchLazyQuery } from "@/mikro-next/api/graphql";
import {
  RegisteredAction,
  useCommand,
} from "@/providers/command/CommandContext";
import { useDisplayComponent } from "@/providers/display/DisplayContext";
import { useSettings } from "@/providers/settings/SettingsContext";
import {
  ListNodeFragment,
  useNodeSearchLazyQuery,
  useReservationsQuery,
} from "@/rekuest/api/graphql";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogPortal } from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import React, { Suspense, useContext, useEffect, useState } from "react";

export type SmartModifier<I extends string = string> = {
  type: "smart";
  identifier: I;
  id: string;
  label?: string;
};

export type SearchModifier = {
  type: "search";
};

export type Modifier = SmartModifier | SearchModifier;

export type Context = {
  open: boolean;
  query: string;
  modifiers: Modifier[];
};

export type ExtensionContextType = Context & {
  activateModifier: (modifier: Modifier) => void;
  removeModifier: (index: number) => void;
};

export const ExtensionContext = React.createContext<ExtensionContextType>({
  open: false,
  query: "",
  activateModifier: (modifier: Modifier) => {},
  removeModifier: (index: number) => {},
  modifiers: [],
});

const useExtension = () => useContext(ExtensionContext);

const selectSmarts = <T extends string>(
  modifiers: Modifier[],
  identifier?: T,
): SmartModifier<T>[] => {
  return modifiers.filter(
    (c) =>
      c.type === "smart" &&
      (identifier == undefined || c.identifier == identifier),
  ) as SmartModifier<T>[];
};

export const NodeExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  const [nodes, setNodes] = useState<ListNodeFragment[]>([]);

  const [searchNodes] = withRekuest(useNodeSearchLazyQuery)();

  useEffect(() => {
    if (
      query == undefined ||
      query == "" ||
      modifiers.find(
        (c) => c.type === "smart" && c.identifier === "@rekuest/node",
      )
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
  }, [query, modifiers]);

  return (
    <>
      {nodes.length > 0 && (
        <CommandGroup heading="Nodes">
          {nodes?.map((node) => {
            return (
              <CommandItem
                key={node.id}
                value={node.id}
                onSelect={() =>
                  activateModifier({
                    type: "smart",
                    identifier: "@rekuest/node",
                    id: node.id,
                    label: node.name,
                  })
                }
              >
                {node.name}
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}
    </>
  );
};

export const SmartCommandItem = (props: {
  identifier: string;
  id: string;
  label?: string;
}) => {
  const { activateModifier } = useExtension();

  return (
    <CommandItem
      key={props.identifier + ":" + props.id}
      value={props.identifier + ":" + props.id}
      onSelect={() =>
        activateModifier({
          type: "smart",
          identifier: props.identifier,
          id: props.id,
          label: props.label,
        })
      }
    >
      {props.label}
    </CommandItem>
  );
};

export const SearchExtensions = () => {
  const { query, activateModifier, modifiers } = useExtension();

  const [searchGlobal, { data }] = withMikroNext(useGlobalSearchLazyQuery)();

  useEffect(() => {
    if (query != undefined) {
      searchGlobal({
        variables: {
          search: query,
          noImages: false,
          noFiles: false,
          pagination: { limit: 10 },
        },
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [query, modifiers]);

  return (
    <>
      {data && query && (
        <>
          {data?.images.length > 0 && (
            <CommandGroup heading="Images">
              {data?.images.map((image) => {
                return (
                  <SmartCommandItem
                    identifier={"@mikro-next/image"}
                    id={image.id}
                    label={image.name}
                  />
                );
              })}
            </CommandGroup>
          )}
        </>
      )}
    </>
  );
};

const useSmartExtension = <T extends string>(identifier?: T) => {
  const { modifiers } = useExtension();
  const meModifiers = selectSmarts(modifiers, identifier);
  return {
    modifiers: meModifiers,
    multiple: meModifiers.length > 1,
    active: meModifiers.length > 0,
  };
};

export const FilteredCommands = (props: { actions: RegisteredAction[] | undefined, heading: string}) => {
  const { query } = useExtension();

  const filtered = props.actions?.filter((action) => {
    return query && query.length > 0 && action.label.toLowerCase().includes(query.toLowerCase());
  }) || [];

  if (filtered.length == 0) {
    return <></>;
  }

  return (
    <><CommandGroup heading={props.heading}>
      {filtered.map((action) => (
        <CommandItem
          key={action.key}
          value={action.key}
          onSelect={() => action.run()}
        >
          {action.label}
        </CommandItem>
      ))}
    </CommandGroup>
    </>
  );
};

export const OneNodeExtensions = () => {
  const { modifiers, multiple } = useSmartExtension("@rekuest/node");

  return (
    <>
      {modifiers.map((modifier) => (
          <FilteredCommands
            heading={modifier.label || "Node"}
            actions={[
              {
                key: "node:delete",
                label: "Reserve " + modifier.label,
                run: async () => alert("Reserve"),
              },
              {
                key: "node:edit",
                label: "Edit " + modifier.label,
                run: async () => alert("Edit"),
              },
            ]}
          />
      ))}
    </>
  );
};

export const LocalActionExtensions = () => {
  const { actions } = useCommand();

  return (
    <>
      {actions.length > 0 && (
        <CommandGroup heading="Local Actions">
          {actions?.map((action) => {
            return (
              <CommandItem
                key={action.key}
                value={action.key}
                onSelect={() => action.run()}
                className="flex-row items-center justify-between"
              >
                {action.label}
                {action.description && <div className="text-xs ml-1">{action.description}</div>}
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}
    </>
  );
};


export const ReservationExtensions = () => {
  const { settings} = useSettings()
  const { data } = withRekuest(useReservationsQuery)({
    variables: {
      instanceId: settings.instanceId,
    }
  });

  return (
    <>
      
          <FilteredCommands actions={data?.myreservations.map(x => ({
            key: "assign:" + x.id,
            label: "Assign to " + x.title ,
            run: async () => alert("Assign"),
          }))} heading="Assign"/>
    
    </>
  );
};

export const DisplayWidget = (props: {
  identifier: string;
  object: string;
}) => {
  const Widget = useDisplayComponent(props.identifier);

  if (Widget == undefined) {
    return <>No widget found</>;
  }

  return (
    <Suspense>
      <Widget small={true} object={props.object} />
    </Suspense>
  );
};

export const DisplayWidgetHub = () => {
  const { modifiers } = useSmartExtension();

  return (
    <>
      {modifiers.map((modifier) => {
        return (
          <>
            <DisplayWidget
              identifier={modifier.identifier}
              object={modifier.id}
            />
          </>
        );
      })}
    </>
  );
};

export const ModifierRender = (props: { modifier: Modifier }) => {
  if (props.modifier.type === "smart") {
    return (
      <DisplayWidget
        identifier={props.modifier.identifier}
        object={props.modifier.id}
      />
    );
  }
  if (props.modifier.type === "search") {
    return <Badge>Search</Badge>;
  }
  return <>Unknown Modifier</>;
};

export const CommandMenu = () => {
  const [context, setContext] = useState<Context>({
    open: false,
    query: "",
    modifiers: [],
  });
  const debouncedContext = useDebounce(context, 100);

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
      <DialogPortal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] gap-2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] ",
            "",
          )}
        >
          {context.modifiers.length > 0 && (
            <div className="flex flex-col justify-between items-center relative gap-1">
              {context.modifiers.map((m, index) => (
                <>
                  <div className="border bg-background shadow-lg sm:rounded-lg md:w-full relative">
                    <div
                      onClick={() => removeModifier(index)}
                      className="absolute right-4 top-[50%] translate-y-[-50%] cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                      <Cross2Icon className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </div>
                    <ModifierRender modifier={m} />
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="flex flex-row justify-between items-center relative gap-4 border bg-background shadow-lg sm:rounded-lg md:w-full">
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
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

              <CommandList>
                {context.query && <CommandEmpty>No results found</CommandEmpty>}
                <ExtensionContext.Provider
                  value={{
                    ...debouncedContext,
                    activateModifier,
                    removeModifier,
                  }}
                >
                  <NodeExtensions />
                  <OneNodeExtensions />
                  <LocalActionExtensions />
                  <SearchExtensions />
                  <ReservationExtensions />
                </ExtensionContext.Provider>
              </CommandList>
            </Command>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
