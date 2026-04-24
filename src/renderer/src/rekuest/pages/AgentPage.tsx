import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetPodForAgentQuery } from "@/kabinet/api/graphql";
import { cn } from "@/lib/utils";
import { KabinetPod, RekuestAgent, RekuestState } from "@/linkers";
import {
  AgentFragment,
  PortKind,
  ProtocolAgentFragment,
  useAgentForProtocolLazyQuery,
  useAgentQuery,
  useBounceMutation,
  usePinAgentMutation,
  WatchImplementationsDocument,
  WatchImplementationsSubscription,
  WatchImplementationsSubscriptionVariables,
} from "@/rekuest/api/graphql";
import { Clipboard, ClipboardCheck, Pin, PinOff, Server } from "lucide-react";
import { useEffect, useState } from "react";
import Timestamp from "react-timestamp";
import { AgentHeroScene } from "../components/AgentHeroScene";
import ImplementationCard from "../components/cards/ImplementationCard";
import TaskCard from "../components/cards/TaskCard";
import { AgentTasksSidebar } from "../sidebars/AgentTasksSidebar";

const stageCardClass =
  "border-white/20 bg-[linear-gradient(135deg,rgba(250,247,243,0.82),rgba(250,247,243,0.32))] shadow-[0_22px_50px_-30px_rgba(26,22,19,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(40,35,32,0.82),rgba(18,16,15,0.26))]";

export const PinAgent = (props: { agent: AgentFragment }) => {
  const [pin] = usePinAgentMutation();

  return (
    <Button
      variant={props.agent.pinned ? "default" : "outline"}
      size="sm"
      onClick={() => {
        pin({
          variables: {
            input: { id: props.agent.id, pin: !props.agent.pinned },
          },
        });
      }}
    >
      {props.agent.pinned ? (
        <>
          <PinOff className="h-4 w-4 mr-2" />
          Unpin
        </>
      ) : (
        <>
          <Pin className="h-4 w-4 mr-2" />
          Pin
        </>
      )}
    </Button>
  );
};

export const BounceAgentButton = (props: { agent: AgentFragment }) => {
  const [bounce] = useBounceMutation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        bounce({
          variables: {
            input: { agent: props.agent.id, duration: 10 },
          },
        });
      }}
    >
      Bounce
    </Button>
  );
};

const toPythonIdentifier = (value: string, fallback: string) => {
  const normalized = value
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!normalized) {
    return fallback;
  }

  return /^[0-9]/.test(normalized) ? `_${normalized}` : normalized;
};

const toPythonClassName = (name: string) => {
  const words = name.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (!words.length) return "Agent";
  const pascal = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  return /^[0-9]/.test(pascal) ? `Agent${pascal}` : pascal;
};

const escapePyTripleString = (value?: string | null) =>
  value ? value.replace(/"""/g, '"""') : null;

const portKindToPython = (kind: PortKind, identifier?: string | null): string => {
  switch (kind) {
    case PortKind.String:
      return "str";
    case PortKind.Int:
      return "int";
    case PortKind.Float:
      return "float";
    case PortKind.Bool:
      return "bool";
    case PortKind.Date:
      return "datetime";
    case PortKind.Dict:
      return "dict";
    case PortKind.List:
      return "list";
    case PortKind.Enum:
      return "str";
    case PortKind.Structure:
    case PortKind.Model: {
      if (identifier) {
        const parts = String(identifier).split("/");
        return toPythonClassName(parts[parts.length - 1]);
      }
      return "Any";
    }
    default:
      return "Any";
  }
};

const portTypePy = (port: {
  kind: PortKind;
  identifier?: string | null;
  nullable: boolean;
}): string => {
  const base = portKindToPython(port.kind, port.identifier);
  return port.nullable ? `Optional[${base}]` : base;
};

const protocolAgentToPythonString = (agent: ProtocolAgentFragment): string => {
  const className = toPythonClassName(agent.name);
  const usedMethodNames = new Set<string>();
  const extraImports = new Set<string>();

  const methodBlocks = agent.implementations.map((impl, index) => {
    const preferredName = impl.action.key;
    const baseMethodName = toPythonIdentifier(
      preferredName,
      `method_${index + 1}`,
    );

    let methodName = baseMethodName;
    let suffix = 2;
    while (usedMethodNames.has(methodName)) {
      methodName = `${baseMethodName}_${suffix}`;
      suffix += 1;
    }
    usedMethodNames.add(methodName);

    const argList = impl.action.args
      .map((a) => {
        const argName = toPythonIdentifier(a.key, `arg_${index}`);
        const pyType = portTypePy(a);
        if (a.nullable) extraImports.add("Optional");
        if (pyType === "datetime") extraImports.add("datetime");
        return `${argName}: ${pyType}`;
      })
      .join(", ");

    const rets = impl.action.returns;
    let returnType: string;
    if (rets.length === 0) {
      returnType = "None";
    } else if (rets.length === 1) {
      returnType = portTypePy(rets[0]);
      if (rets[0].nullable) extraImports.add("Optional");
      if (returnType.startsWith("datetime")) extraImports.add("datetime");
    } else {
      const parts = rets.map((r) => {
        if (r.nullable) extraImports.add("Optional");
        const t = portTypePy(r);
        if (t.startsWith("datetime")) extraImports.add("datetime");
        return t;
      });
      returnType = `Tuple[${parts.join(", ")}]`;
      extraImports.add("Tuple");
    }

    const description = escapePyTripleString(impl.action.description);
    const params = argList ? `self, ${argList}` : "self";

    return [
      `    def ${methodName}(${params}) -> ${returnType}:`,
      `        """${description ?? impl.action.name}"""`,
      "        ...",
      "",
    ].join("\n");
  });

  const body = methodBlocks.length ? methodBlocks.join("\n") : "    pass\n";

  const typingImports = ["Protocol", ...extraImports].sort().join(", ");

  return [
    `from typing import ${typingImports}`,
    `from arkitekt_next import declare`,
    "",
    `@declare(app="${agent.app.identifier}")`,
    `class ${className}Like(Protocol):`,
    body,
  ].join("\n");
};

export const CopyAgentPythonButton = (props: { agent: AgentFragment }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchProtocol] = useAgentForProtocolLazyQuery();

  const handleCopy = async () => {
    setLoading(true);
    try {
      const result = await fetchProtocol({ variables: { id: props.agent.id } });
      if (result.data?.agent) {
        navigator.clipboard.writeText(protocolAgentToPythonString(result.data.agent));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Copied
        </>
      ) : (
        <>
          <Clipboard className="h-4 w-4 mr-2" />
          {loading ? "Loading..." : "Copy Python"}
        </>
      )}
    </Button>
  );
};

export const ManagedByCard = (props: { agent: AgentFragment }) => {
  const { data } = useGetPodForAgentQuery({
    variables: {
      clientId: props.agent.registry.client.clientId,
      instanceId: props.agent.instanceId,
    },
  });

  if (!data?.podForAgent) {
    return null;
  }

  return (
    <KabinetPod.DetailLink object={data?.podForAgent}>
      <Button variant="outline" size="sm">
        <Server className="h-4 w-4 mr-2" />
        {data?.podForAgent?.resource?.name} • {data?.podForAgent?.backend?.name}
      </Button>
    </KabinetPod.DetailLink>
  );
};







export const AgentPage = asDetailQueryRoute(
  useAgentQuery,
  ({ data, subscribeToMore }) => {
    useEffect(() => {
      return subscribeToMore<
        WatchImplementationsSubscription,
        WatchImplementationsSubscriptionVariables
      >({
        document: WatchImplementationsDocument,
        variables: { agent: data.agent.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const create = subscriptionData.data.implementations.create;
          const update = subscriptionData.data.implementations.update;
          const remove = subscriptionData.data.implementations.delete;
          if (create) {
            return {
              agent: {
                ...prev.agent,
                implementations: [...prev.agent.implementations, create],
              },
            };
          }
          if (update) {
            return {
              agent: {
                ...prev.agent,
                implementations: prev.agent.implementations.map((x) =>
                  x.id == update.id ? update : x,
                ),
              },
            };
          }
          if (remove) {
            return {
              agent: {
                ...prev.agent,
                implementations: prev.agent.implementations.filter((x) => x.id != remove),
              },
            };
          }
          return prev;
        },
      });
    }, [subscribeToMore, data.agent.id]);

    return (
      <RekuestAgent.ModelPage
        title={data.agent.name}
        object={data.agent}
        variant={"black"}
        sidebars={
          <MultiSidebar
            map={{
              Comments: <RekuestAgent.Komments object={data?.agent} />,
              States: <>
                {/* States Section */}
                {data.agent.states.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Agent States
                    </h3>
                    <div className="space-y-3">
                      {data.agent.states.map((state) => (
                        <RekuestState.DetailLink object={state} key={state.id}>
                          <Button variant="outline" size="sm">
                            {state.id}
                          </Button>
                        </RekuestState.DetailLink>
                      ))}
                    </div>
                  </div>
                )}
              </>,
              Tasks: <AgentTasksSidebar agent={data.agent.id} />,
            }}
          />
        }
        pageActions={
          <>
            <PinAgent agent={data.agent} />
            <BounceAgentButton agent={data.agent} />
            <CopyAgentPythonButton agent={data.agent} />
            <ManagedByCard agent={data.agent} />
            <RekuestAgent.DetailLink
                          object={data?.agent}
                          subroute="space"
                          className="font-semibold"
                        >
                          <Button
                            variant={"outline"}
                            size={"sm"}
                          >
                            Space
                          </Button>
                        </RekuestAgent.DetailLink>
                        <RekuestAgent.DetailLink
                          object={data?.agent}
                          subroute="states"
                          className="font-semibold"
                        >
                          <Button
                            variant={"outline"}
                            size={"sm"}
                          >
                            States
                          </Button>
                        </RekuestAgent.DetailLink>
                        <RekuestAgent.DetailLink
                          object={data?.agent}
                          subroute="tasks"
                          className="font-semibold"
                        >
                          <Button
                            variant={"outline"}
                            size={"sm"}
                          >
                            Tasks
                          </Button>
                        </RekuestAgent.DetailLink>
          </>
        }
      >
        <div className="relative h-full w-full overflow-hidden  shadow-[0_30px_120px_-48px_rgba(15,23,42,0.55)]">


          <div>
            {data.agent.placements.map((plc) => (
              <>{plc.model?.file && <AgentHeroScene placement={plc} />}</>

            ))}

          </div>

          <div className="absolute inset-y-0 left-0 z-20 flex w-full max-w-[620px] items-stretch">
            <div className="flex w-full flex-col justify-between gap-6 p-6">
              <div className="space-y-1">
                <div className="space-y-4">
                  <RekuestAgent.DetailLink object={data.agent}>
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight transition-colors hover:text-primary lg:text-6xl cursor-pointer">
                      {data.agent.name}
                    </h1>
                  </RekuestAgent.DetailLink>
                </div>

                <div className="grid grid-cols-3 gap-1  ">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          data.agent.connected
                            ? "bg-green-500 shadow-[0_0_14px_rgba(34,197,94,0.75)]"
                            : "bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.75)]",
                        )}
                      />
                      <span className="text-2xl font-semibold">
                        {data.agent.connected ? "Online" : "Offline"}
                      </span>
                      <div className="font-light">
                      <Timestamp date={data.agent.lastSeen} relative />
                      </div>
                                       </div>
                    {(data.agent.active !== data.agent.connected || data.agent.blocked) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {data.agent.active !== data.agent.connected && (
                          <Badge variant="outline" className="text-xs">
                            Mismatch
                          </Badge>
                        )}
                        {data.agent.blocked && (
                          <Badge variant="destructive" className="text-xs">
                            Blocked
                          </Badge>
                        )}
                      </div>
                    )}


                </div>
              </div>


        <div className="mt-6  @container">
          Tasks
              <ListRender array={data.agent.assignations}>
                {(item) => <TaskCard item={item} />}
              </ListRender>
        </div>

        <div className="mt-6  @container overflow-y-auto">
          Actions
          <ListRender array={data.agent.implementations}>
            {(item) => <ImplementationCard item={item} />}
          </ListRender>
        </div>
              </div>
            </div>

        </div>

      </RekuestAgent.ModelPage>
    );
  },
);


export default AgentPage;
