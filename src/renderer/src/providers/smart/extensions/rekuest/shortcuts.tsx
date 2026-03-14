import { useDialog } from "@/app/dialog";
import { CommandItem } from "@/components/ui/command";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import React from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  AssignationEventFragment,
  DemandKind,
  ListShortcutFragment,
  PortDemandInput,
  PortKind,
  useShortcutsQuery,
} from "@/rekuest/api/graphql";
import { registeredCallbacks } from "@/rekuest/components/functional/AssignationUpdater";
import { useAssign } from "@/rekuest/hooks/useAssign";
import type { PassDownProps, SmartContextProps } from "../types";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

const buildShortcutDemands = (props: PassDownProps): PortDemandInput[] => {
  const demands: PortDemandInput[] = [];

  if (props.objects.length > 0) {
    if (props.objects.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [{ at: 0, kind: PortKind.Structure, identifier: props.objects[0].identifier }],
      });
    } else {
      demands.push({
        kind: DemandKind.Args,
        matches: [{
          at: 0,
          kind: PortKind.List,
          children: [{ at: 0, kind: PortKind.Structure, identifier: props.objects[0].identifier }],
        }],
      });
    }
  }

  if (props.partners && props.partners.length > 0) {
    if (props.partners.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [{ at: 1, kind: PortKind.Structure, identifier: props.partners[0].identifier }],
      });
    } else {
      demands.push({
        kind: DemandKind.Args,
        matches: [{
          at: 1,
          kind: PortKind.List,
          children: [{ at: 0, kind: PortKind.Structure, identifier: props.partners[0].identifier }],
        }],
      });
    }
  }

  if (props.returns) {
    demands.push({
      kind: DemandKind.Returns,
      matches: props.returns.map((identifier, index) => ({
        at: index,
        kind: PortKind.Structure,
        identifier,
      })),
    });
  }

  return demands;
};

const buildShortcutArgs = (
  shortcut: ListShortcutFragment,
  props: SmartContextProps,
): Record<string, unknown> | null => {
  const keys: Record<string, unknown> = {};

  if (props.objects.length === 1) {
    const key = shortcut.args?.at(0)?.key;
    if (!key) {
      toast.error("No key found for self");
      return null;
    }
    keys[key] = props.objects[0].object;
  }

  if (props.objects.length > 1) {
    if (shortcut.args.at(0)?.kind !== PortKind.List) {
      toast.error("Should be a list but is not");
      return null;
    }
    const key = shortcut.args?.at(0)?.key;
    if (!key) {
      toast.error("No key found for self");
      return null;
    }
    keys[key] = props.objects.map((obj) => ({
      __identifier: obj.identifier,
      object: obj.object,
    }));
  }

  if (props.partners && props.partners.length === 1) {
    const key = shortcut.args?.at(1)?.key;
    if (!key) {
      toast.error("No key found for partner");
      return null;
    }
    keys[key] = {
      __identifier: props.partners[0].identifier,
      object: props.partners[0].object,
    };
  }

  if (props.partners && props.partners.length > 1) {
    if (shortcut.args.at(1)?.kind !== PortKind.List) {
      toast.error("Should be a list but is not");
      return null;
    }
    const key = shortcut.args?.at(1)?.key;
    if (!key) {
      toast.error("No key found for partner");
      return null;
    }
    keys[key] = props.partners.map((obj) => ({
      __identifier: obj.identifier,
      object: obj.object,
    }));
  }

  return keys;
};

export const ShortcutButton = (
  props: SmartContextProps & { shortcut: ListShortcutFragment },
) => {
  const { assign } = useAssign();
  const { openDialog } = useDialog();
  const [doing, setDoing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number | null>(0);

  const doStuff = React.useCallback(
    (event: AssignationEventFragment) => {
      if (event.kind === "DONE") {
        setDoing(false);
        setProgress(null);
        props.onDone?.({ event, kind: "shortcut" });
      }
      if (event.kind === "ERROR" || event.kind === "CRITICAL") {
        const message = event.message || "Unknown error";
        setDoing(false);
        setProgress(null);
        setError(message);
        props.onError?.(message);
      }
      if (event.kind === "PROGRESS") {
        setProgress(event.progress || 0);
      }
    },
    [props],
  );

  const conditionalAssign = React.useCallback(
    async (shortcut: ListShortcutFragment) => {
      const keys = buildShortcutArgs(shortcut, props);
      if (!keys) {
        return;
      }

      const unknownKeys = shortcut.args.filter((arg) => arg.key && !keys[arg.key]);
      if (unknownKeys.length >= 1) {
        openDialog("actionassign", {
          id: shortcut.action.id,
          args: { ...keys, ...shortcut.savedArgs },
          hidden: { ...keys, ...shortcut.savedArgs },
        });
        return;
      }

      try {
        const reference = uuidv4();
        await assign({
          action: shortcut.action.id,
          args: {
            ...keys,
            ...shortcut.savedArgs,
          },
        });
        registeredCallbacks.set(reference, doStuff);
        setDoing(true);
        setError(null);
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        props.onError?.(message);
      }
    },
    [assign, doStuff, openDialog, props],
  );

  React.useEffect(() => {
    if (!props.shortcut.bindNumber) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === props.shortcut.bindNumber?.toString()) {
        event.preventDefault();
        void conditionalAssign(props.shortcut);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.shortcut, conditionalAssign]);

  return (
    <CommandItem
      onSelect={() => conditionalAssign(props.shortcut)}
      value={props.shortcut.id}
      className="flex-initial flex flex-row group cursor-pointer border border-1 rounded rounded-full bg-slate-800 shadow-xl h-8 overflow-hidden truncate max-w-[100px] ellipsis px-2"
      style={{
        backgroundSize: `${progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
    >
      {props.shortcut.allowQuick && <LightningBoltIcon className="w-4 h-4" />}
      <span className="mr-auto text-md text-gray-100 ellipsis truncate w-full">
        {props.shortcut.name} {props.shortcut.bindNumber && `(${props.shortcut.bindNumber})`}
        {doing && " ..."}
        {error && ` ${error}`}
      </span>
    </CommandItem>
  );
};

export const ApplicableShortcuts = (props: PassDownProps) => {
  const { data, error } = useShortcutsQuery({
    variables: {
      filters: {
        demands: buildShortcutDemands(props),
        search: props.filter && props.filter !== "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (error) {
    return <span className="font-light text-xs w-full items-center ml-2 w-full">Error</span>;
  }

  if (!data || data.shortcuts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 p-2">
      {data.shortcuts.map((shortcut) => (
        <ShortcutButton shortcut={shortcut} {...props} key={shortcut.id} />
      ))}
    </div>
  );
};
