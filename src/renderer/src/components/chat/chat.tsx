import {
  RoomFragment,
  useSendMessageMutation,
} from "@/alpaka/api/graphql";
import { Guard, useRekuest } from "@/app/Arkitekt";
import { useSmartDrop } from "@/providers/smart/hooks";
import { Download, MessageSquareText, PackagePlus } from "lucide-react";
import { Card } from "../ui/card";
import { ChatList } from "./chat-list";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { usePortForm } from "@/rekuest/hooks/usePortForm";
import { submittedDataToRekuestFormat } from "@/rekuest/widgets/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  useAllActionsQuery,
  useDetailActionQuery,
  DemandKind,
  PortKind,
  TaskEventKind,
  useCancelMutation,
} from "@/rekuest/api/graphql";
import {
  useAllPrimaryDefinitionsQuery,
  ListDefinitionFragment,
} from "@/kabinet/api/graphql";
import { useHashActionWithProgress } from "@/rekuest/hooks/useHashActionWithProgress";
import { KabinetDefinition } from "@/linkers";
import { useAssignWithCallback } from "@/rekuest/hooks/useAssign";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type InstallAction = {
  id: string;
  hash: string;
  name: string;
  description?: string | null;
};

const InstallReplyerDefinitionButton = (props: {
  definition: ListDefinitionFragment;
  action: InstallAction;
  onInstalled?: () => void;
}) => {
  const client = useRekuest();
  const { assign, progress, installed } = useHashActionWithProgress({
    hash: props.action.hash,
    onDone: () => {
      void client.refetchQueries({ include: ["AllActions"] });
      props.onInstalled?.();
    },
  });

  return (
    <CommandItem
      value={`install-replyer-${props.definition.id}-${props.action.id}`}
      onSelect={() => {
        void assign({
          definition: {
            object: props.definition.id,
            __identifier: KabinetDefinition.identifier,
          },
        });
      }}
      disabled={!installed}
      style={{
        backgroundSize: `${progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm">{props.definition.name}</span>
        {props.definition.description && (
          <span className="truncate text-xs text-muted-foreground">
            {props.definition.description}
          </span>
        )}
      </div>
    </CommandItem>
  );
};

const InstallReplyerPopover = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInstalled?: () => void;
}) => {
  const { open, onOpenChange } = props;
  const [search, setSearch] = useState("");

  const { data: enginesData } = useAllActionsQuery({
    variables: {
      filters: {
        demands: [
          {
            kind: DemandKind.Args,
            matches: [
              { at: 0, kind: PortKind.Structure, identifier: "@kabinet/definition" },
            ],
          },
          {
            kind: DemandKind.Returns,
            matches: [
              { at: 0, kind: PortKind.Structure, identifier: "@kabinet/pod" },
            ],
          },
        ],
      },
    },
    fetchPolicy: "cache-first",
  });

  const { data: definitionsData } = useAllPrimaryDefinitionsQuery({
    variables: {
      filters: {
        demands: [
          {
            kind: DemandKind.Args,
            matches: [{ kind: PortKind.Structure, identifier: "@alpaka/message" }],
          },
          {
            kind: DemandKind.Returns,
            matches: [{ kind: PortKind.Structure, identifier: "@alpaka/message" }],
          },
        ],
        search: search !== "" ? search : undefined,
      },
    },
    fetchPolicy: "cache-and-network",
    skip: !open,
  });

  const engines = enginesData?.actions ?? [];
  const definitions = definitionsData?.definitions ?? [];

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 text-xs text-muted-foreground hover:bg-muted/20 hover:text-foreground transition-colors"
        >
          <PackagePlus className="h-3.5 w-3.5" />
          Install Replyer
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search replyers..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {engines.length === 0 ? (
              <CommandEmpty>No install engine available</CommandEmpty>
            ) : definitions.length === 0 ? (
              <CommandEmpty>No installable replyers found</CommandEmpty>
            ) : (
              <CommandGroup heading="Installable Replyers">
                {definitions.map((definition) =>
                  engines.map((engine) => (
                    <InstallReplyerDefinitionButton
                      key={`${definition.id}-${engine.id}`}
                      definition={definition}
                      action={engine as InstallAction}
                      onInstalled={() => onOpenChange(false)}
                    />
                  ))
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export interface ActiveTask {
  id: string;
  reference: string;
  actionName: string;
  status: 'PENDING' | 'RUNNING' | 'DONE' | 'ERROR' | 'CANCELLED';
  progress?: number | null;
  message?: string | null;
  delegatedName?: string | null;
}


interface ChatProps {
  isMobile: boolean;
  room: RoomFragment;
}

export function Chat({ isMobile, room }: ChatProps) {
  const [send, { loading }] = useSendMessageMutation({
    refetchQueries: ["DetailRoom"],
  });

  const [selectedActionId, setSelectedActionId] = useState<string>("none");
  const [hasAutoselected, setHasAutoselected] = useState(false);
  const [installReplyerOpen, setInstallReplyerOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [stagedStructures, setStagedStructures] = useState<{ identifier: string; object: string }[]>([]);
  const [prefillText, setPrefillText] = useState("");

  useEffect(() => {
    const textParam = searchParams.get("text");
    const prefill = searchParams.get("prefillStructures");

    if (textParam) {
      setPrefillText(textParam);
    }

    if (prefill) {
      try {
        const parsed = JSON.parse(prefill);
        if (Array.isArray(parsed)) {
          setStagedStructures(parsed);
        }
      } catch (e) {
        console.error("Failed to parse prefillStructures", e);
      }
    }

    if (textParam || prefill) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("text");
      nextParams.delete("prefillStructures");
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data: actionsData } = useAllActionsQuery({
    variables: {
      filters: {
        demands: [
          {
            kind: DemandKind.Args,
            matches: [
              {
                kind: PortKind.Structure,
                identifier: "@alpaka/message",
              },
            ],
          },
          {
            kind: DemandKind.Returns,
            matches: [
              {
                kind: PortKind.Structure,
                identifier: "@alpaka/message",
              },
            ],
          },
        ],
      },
    },
  });

  useEffect(() => {
    if (!hasAutoselected && actionsData?.actions && actionsData.actions.length > 0) {
      setSelectedActionId(actionsData.actions[0].id);
      setHasAutoselected(true);
    }
  }, [actionsData, hasAutoselected]);

  const { data: actionDetailData } = useDetailActionQuery({
    variables: {
      id: selectedActionId,
    },
    skip: !selectedActionId || selectedActionId === "none",
  });
  const action = actionDetailData?.action;

  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);

  const { assign } = useAssignWithCallback({
    onDone: (event) => {
      setActiveTasks((prev) => {
        return prev.map((ass) => {
          if (ass.reference === event.task.reference) {
            let status: ActiveTask["status"] = ass.status;
            if (event.kind === TaskEventKind.Completed) {
              status = "DONE";
            } else if (event.kind === TaskEventKind.Failed) {
              status = "ERROR";
            } else if (event.kind === TaskEventKind.Cancelled) {
              status = "CANCELLED";
            } else {
              status = "RUNNING";
            }

            return {
              ...ass,
              status,
              progress: event.progress !== undefined && event.progress !== null ? event.progress : ass.progress,
              message: event.message || ass.message,
              delegatedName: event.delegatedTo?.implementation?.action?.name || ass.delegatedName,
            };
          }
          return ass;
        });
      });
    },
  });

  useEffect(() => {
    const doneTasks = activeTasks.filter((ass) => ass.status === "DONE");
    if (doneTasks.length > 0) {
      const timers = doneTasks.map((ass) => {
        return setTimeout(() => {
          setActiveTasks((prev) => prev.filter((p) => p.reference !== ass.reference));
        }, 3000);
      });
      return () => {
        timers.forEach((t) => clearTimeout(t));
      };
    }
  }, [activeTasks]);

  const dismissTask = (reference: string) => {
    setActiveTasks((prev) => prev.filter((ass) => ass.reference !== reference));
  };

  const [cancelAssign] = useCancelMutation();

  const handleCancelTask = async (id: string, reference: string) => {
    if (!id) return;
    try {
      toast.info("Canceling replyer...");
      await cancelAssign({
        variables: {
          input: { task: id },
        },
      });
      toast.success("Cancellation requested");
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to cancel: ${err.message || err}`);
    }
  };

  const handleRereply = async (messageId: string) => {
    if (selectedActionId && selectedActionId !== "none" && messageKey && action) {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fill in all required arguments for the selected replyer.");
        return;
      }

      const rawFormValues = form.getValues();
      const formattedFormValues = submittedDataToRekuestFormat(rawFormValues, action.args as any);

      const assignArgs: Record<string, any> = {
        ...formattedFormValues,
        [messageKey]: {
          __identifier: "@alpaka/message",
          object: messageId,
        },
      };

      const reference = uuidv4();

      setActiveTasks((prev) => [
        ...prev,
        {
          id: "",
          reference,
          actionName: action.name,
          status: "PENDING",
          progress: null,
          message: "Assigning...",
        },
      ]);

      try {
        const task = await assign({
          action: selectedActionId,
          args: assignArgs,
          reference,
        });

        setActiveTasks((prev) =>
          prev.map((ass) =>
            ass.reference === reference
              ? { ...ass, id: task.id, status: "RUNNING" }
              : ass
          )
        );
      } catch (err: any) {
        console.error(err);
        toast.error(`Replyer failed: ${err.message || err}`);
        setActiveTasks((prev) =>
          prev.map((ass) =>
            ass.reference === reference
              ? { ...ass, status: "ERROR", message: err.message || "Failed to trigger" }
              : ass
          )
        );
      }
    }
  };

  const { registry } = useWidgetRegistry();

  const selectedAction = useMemo(() => {
    if (!actionsData?.actions || !selectedActionId || selectedActionId === "none") {
      return undefined;
    }
    return actionsData.actions.find((act) => act.id === selectedActionId);
  }, [actionsData, selectedActionId]);

  const latestTask = selectedAction?.latestTask;

  const messageArg = useMemo(() => {
    return action?.args.find(
      (arg) =>
        arg.kind === PortKind.Structure &&
        arg.identifier === "@alpaka/message"
    );
  }, [action]);
  const messageKey = messageArg?.key;

  const hiddenArgs = useMemo(() => {
    if (messageKey) {
      return { [messageKey]: true };
    }
    return {};
  }, [messageKey]);

  const formOverwrites = useMemo(() => {
    const overwrites: Record<string, any> = {};

    if (latestTask?.args) {
      Object.assign(overwrites, latestTask.args);
    }

    if (messageKey) {
      overwrites[messageKey] = {
        __identifier: "@alpaka/message",
        object: "dummy",
      };
    }
    return overwrites;
  }, [messageKey, latestTask]);

  const form = usePortForm({
    ports: (action?.args || []) as any,
    overwrites: formOverwrites,
  });

  const sendMessage = async (text: string) => {
    if (selectedActionId && selectedActionId !== "none") {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fill in all required arguments for the selected replyer.");
        return;
      }
    }

    try {
      const res = await send({
        variables: {
          input: {
            text: text,
            room: room.id,
            agentId: "default",
            attachStructures: stagedStructures.length > 0 ? stagedStructures : undefined,
          },
        },
      });

      const createdMessage = res.data?.send;

      setStagedStructures([]);

      if (createdMessage && selectedActionId && selectedActionId !== "none" && messageKey && action) {
        const rawFormValues = form.getValues();
        const formattedFormValues = submittedDataToRekuestFormat(rawFormValues, action.args as any);

        const assignArgs: Record<string, any> = {
          ...formattedFormValues,
          [messageKey]: {
            __identifier: "@alpaka/message",
            object: createdMessage.id,
          },
        };

        const reference = uuidv4();

        setActiveTasks((prev) => [
          ...prev,
          {
            id: "",
            reference,
            actionName: action.name,
            status: "PENDING",
            progress: null,
            message: "Assigning...",
          },
        ]);

        try {
          const task = await assign({
            action: selectedActionId,
            args: assignArgs,
            reference,
          });

          setActiveTasks((prev) =>
            prev.map((ass) =>
              ass.reference === reference
                ? { ...ass, id: task.id, status: "RUNNING" }
                : ass
            )
          );
        } catch (err: any) {
          console.error(err);
          toast.error(`Replyer failed: ${err.message || err}`);
          setActiveTasks((prev) =>
            prev.map((ass) =>
              ass.reference === reference
                ? { ...ass, status: "ERROR", message: err.message || "Failed to trigger" }
                : ass
            )
          );
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to send message: ${error.message || error}`);
    }
  };

  const [{ isOver }, drop] = useSmartDrop((structures) => {
    setStagedStructures((prev) => [
      ...prev,
      ...structures.map((s) => ({
        identifier: s.identifier,
        object: s.object,
      })),
    ]);
  });

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[inherit]"
      ref={drop}
    >
      {(isOver || loading) && (
        <div className="absolute top-0 left-0 z-50 h-full w-full backdrop-blur-sm">
          <div className="flex items-center justify-center h-full">
            <Card className="p-4">
              {loading ? "Adding..." : "Drop to Add to Chat"}
            </Card>
          </div>
        </div>
      )}
      <div className="border-b px-4 py-3 backdrop-blur ">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-muted/60 text-muted-foreground shadow-sm">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{room.title}</div>
              <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {room.description || "Ask questions, attach structures, and keep the context in one room."}
              </div>
            </div>
          </div>
 
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Replyer:</span>
              {actionsData?.actions && actionsData.actions.length > 0 ? (
                <>
                  <Select
                    value={selectedActionId}
                    onValueChange={(val) => {
                      if (val === "__install__") {
                        setInstallReplyerOpen(true);
                      } else {
                        setSelectedActionId(val);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-[180px] text-xs rounded-lg border-border/60 bg-background/50 hover:bg-muted/20">
                      <SelectValue placeholder="No Replyer" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="none">No Replyer</SelectItem>
                      {actionsData.actions.map((act) => (
                        <SelectItem key={act.id} value={act.id}>
                          {act.name}
                        </SelectItem>
                      ))}
                      <Guard.Kabinet unavailable={<></>}>
                        <SelectItem value="__install__" className="text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <PackagePlus className="h-3.5 w-3.5" />
                            Install Replyer
                          </span>
                        </SelectItem>
                      </Guard.Kabinet>
                    </SelectContent>
                  </Select>
                  <Guard.Kabinet unavailable={<></>}>
                    <InstallReplyerPopover
                      open={installReplyerOpen}
                      onOpenChange={setInstallReplyerOpen}
                    />
                  </Guard.Kabinet>
                </>
              ) : (
                <Guard.Kabinet unavailable={<></>}>
                  <InstallReplyerPopover
                    open={installReplyerOpen}
                    onOpenChange={setInstallReplyerOpen}
                  />
                </Guard.Kabinet>
              )}
            </div>

            {selectedActionId !== "none" && action && (
              <Form {...form}>
                <div className="flex items-center gap-2 border-l border-border/50 pl-3">
                  <ArgsContainer
                    registry={registry}
                    groups={action?.portGroups || []}
                    ports={action?.args || []}
                    hidden={hiddenArgs}
                    path={[]}
                  />
                </div>
              </Form>
            )}

            <div className="hidden rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:block">
              {room.messages.length} {room.messages.length === 1 ? "message" : "messages"}
            </div>
          </div>
        </div>
      </div>
      <ChatList
        messages={[...room.messages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )}
        currentAgentId="default"
        sendMessage={sendMessage}
        isMobile={isMobile}
        stagedStructures={stagedStructures}
        onRemoveStructure={(idx) => {
          setStagedStructures((prev) => prev.filter((_, i) => i !== idx));
        }}
        prefillText={prefillText}
        activeTasks={activeTasks}
        onDismissTask={dismissTask}
        onCancelTask={handleCancelTask}
        onRereply={selectedActionId !== "none" ? handleRereply : undefined}
      />
    </div>
  );
}
