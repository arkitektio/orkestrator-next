import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDisplayComponent } from "@/providers/display/DisplayContext";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogPortal } from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { Suspense, useEffect, useState } from "react";
import {
  Context,
  ExtensionContext,
  Modifier,
  useSmartExtension,
} from "./ExtensionContext";
import { LocalActionExtensions } from "./extensions/LocalActionExtension";
import { NodeActionExtension } from "./extensions/NodeActionExtension";
import { NodeExtensions } from "./extensions/NodeExtension";
import { ReservationExtensions } from "./extensions/ReservationActionExtension";
import { SearchExtensions } from "./extensions/SearchExtensions";
import { RekuestGuard } from "@jhnnsrs/rekuest-next";
import { MikroNextGuard } from "@jhnnsrs/mikro-next";

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

/**
 * A custom Command Menu a la VSCode.
 * This renders and filters the commands that are *currently* registered in the command provider.
 * And allows for the execution of these commands.
 *
 **/
export const CommandMenu = () => {
  const [context, setContext] = useState<Context>({
    open: false,
    query: "",
    modifiers: [],
  });
  const debouncedContext = useDebounce(context, 100); // Debounce the context to prevent too many rerenders.

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
        // Open the command menu with cmd+m
        e.preventDefault();
        setContext((c) => ({ ...c, open: !c.open }));
      }
      if (e.key === "," && (e.metaKey || e.ctrlKey)) {
        // Open a fresh command menu with cmd+,, without any modifiers.
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
            <Command
              shouldFilter={false}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
            >
              <CommandInput
                placeholder="Type a command or search..."
                onValueChange={updateQuery}
                value={context.query}
                className=""
                capture={true}
              />
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <Cross2Icon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>

              <CommandList>
                {context.query && <CommandEmpty>No results found</CommandEmpty>}
                <ExtensionContext.Provider
                  value={{
                    ...debouncedContext,
                    activateModifier,
                    removeModifier,
                  }}
                > 
                  <RekuestGuard>
                    <NodeExtensions />
                    <NodeActionExtension />
                    
                    <ReservationExtensions />
                  </RekuestGuard>
                  <LocalActionExtensions />
                  <MikroNextGuard fallback={<></>}>
                    <SearchExtensions />
                  </MikroNextGuard>
                </ExtensionContext.Provider>
              </CommandList>
            </Command>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
