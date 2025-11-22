import { AppContext, useArkitekt } from "@/lib/arkitekt/provider";
import { ApolloClient, NormalizedCache } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Assign,
  CancelledEvent,
  CancelMessage,
  CriticalEvent,
  DoneEvent,
  ErrorEvent,
  FromAgentMessage,
  Register,
  ToAgentMessage,
  YieldEvent,
} from "./message";
import { useSettings } from "@/providers/settings/SettingsContext";
import { aliasToWsPath } from "@/lib/arkitekt/alias/helpers";
import { selectAlias, selectApolloClient } from "@/lib/arkitekt/utils";
import { ActionKind, DefinitionInput, EnsureAgentDocument, EnsureAgentMutation, EnsureAgentMutationVariables, ImplementationInput, PortInput, PortKind, SetExtensionImplementationsDocument, SetExtensionImplementationsMutation, SetExtensionImplementationsMutationVariables } from "@/rekuest/api/graphql";
import { AgentFunction, AssignContext, InferDefinition } from "./types";
import { globalRegistry } from "./registry";

export class OrkestratorAgent {
  instanceId: string;
  context: AppContext;
  rekuestClient: ApolloClient<NormalizedCache>;
  ws: WebSocket | null = null;
  cancelControllers: Map<string, AbortController> = new Map();
  electronListeners: Map<string, (type: string, data: any) => void> = new Map();
  registry: Map<string, AgentFunction<any>> = new Map();
  implementations: ImplementationInput[] = [];
  reconnectTimer: NodeJS.Timeout | null = null;
  shouldReconnect = true;
  token: string
  agentUrl: string;
  navigate: (path: string) => void;

  constructor(
    context: AppContext,
    instanceId: string,
    navigate: (path: string) => void
  ) {
    this.instanceId = instanceId;
    this.context = context;
    this.navigate = navigate;
    this.rekuestClient = selectApolloClient(context, "rekuest");
    this.agentUrl = aliasToWsPath(selectAlias(
      this.context,
      "rekuest"
    ), `agi`
    );

    if (this.context.connection == undefined) {
      throw new Error("No connection in context");
    }

    this.token = this.context.connection.token

    if (window.api) {
      window.api.onAgentYield((data) => this.notifyElectronListener(data.assignation, "yield", data));
      window.api.onAgentDone((data) => this.notifyElectronListener(data.assignation, "done", data));
      window.api.onAgentError((data) => this.notifyElectronListener(data.assignation, "error", data));
      window.api.onAgentLog((data) => this.notifyElectronListener(data.assignation, "log", data));
    }

    // Register global registry entries
    globalRegistry.entries.forEach((entry) => {
      this.register(entry.name, entry.func, entry.definition);
    });
  }

  public register<const D extends DefinitionInput, R extends Record<string, unknown> = Record<string, unknown>>(
    name: string,
    func: AgentFunction<AssignContext<InferDefinition<D>, R>>,
    definition: D,
  ) {
    this.registry.set(name, func);
    this.implementations.push({
      interface: name,
      definition: definition,
      dependencies: [],
    });
  }

  notifyElectronListener(id: string, type: string, data: any) {
    const listener = this.electronListeners.get(id);
    if (listener) listener(type, data);
  }

  async registerElectron() {
    try {
      if (window.api) {
        await window.api.initAgent({
          token: this.token,
          url: this.context.connection!.endpoint.base_url,
          instanceId: this.instanceId,
          agentUrl: this.agentUrl,
          services: this.context.connection!.availableServices
        });

        const impls = await window.api.inspectElectronAgent();
        console.log("Electron agent implementations:", impls);
        impls.forEach(impl => {
          if (!impl.interface) return;
          this.register(impl.interface, async (context) => {
            this.electronListeners.set(context.message.assignation, (type, data) => {
              if (type === "yield") context.yield(data.returns);
              if (type === "done") context.return(data.returns);
              if (type === "error") context.error(data.error);
            });
            try {
              console.log("Executing electron agent assignation:", context.message);
              await window.api.executeElectron(context.message);
            } catch (e) {
              context.error(String(e));
            } finally {
              this.electronListeners.delete(context.message.assignation);
            }
          }, impl.definition);
        });
      }
    } catch (e) {
      console.error("Error registering electron agent:", e);
    }
  }

  public async announce() {
    if (!this.rekuestClient) throw new Error("Rekuest client not found");

    await this.registerElectron();

    await this.rekuestClient.mutate<EnsureAgentMutation, EnsureAgentMutationVariables>({
      mutation: EnsureAgentDocument,
      variables: {
        input: {
          instanceId: this.instanceId,
          name: "Orkestrator",
        },
      },
    });

    await this.rekuestClient.mutate<SetExtensionImplementationsMutation, SetExtensionImplementationsMutationVariables>({
      mutation: SetExtensionImplementationsDocument,
      variables: {
        input: {
          extension: "orkestrator",
          instanceId: this.instanceId,
          implementations: this.implementations,
        },
      },
    });

  }

  public connect() {

    this.announce();

    this.ws = new WebSocket(this.agentUrl);

    this.ws.onopen = () => {

      this.send(
        Register.parse({
          type: "REGISTER",
          token: this.token,
          instance_id: this.instanceId,
        })
      );
    };

    this.ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data as string);
        const message = ToAgentMessage.parse(data);
        await this.handleMessage(message);
      } catch (e) {
        console.error("Error handling message", e);
      }
    };

    this.ws.onclose = () => {

      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      }
    };

    this.ws.onerror = (e) => {
      console.error("Agent error", e);
    };
  }

  public disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }

  private send(message: FromAgentMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private async handleHeartbeat(_: ToAgentMessage) {
    this.send(
      FromAgentMessage.parse({
        type: "HEARTBEAT_ANSWER",
      })
    );
  }

  private async handleCancel(message: CancelMessage) {
    const controller = this.cancelControllers.get(message.assignation);
    if (controller) {
      controller.abort();
      this.send(CancelledEvent.parse({
        type: "CANCELLED",
        assignation: message.assignation,
      }));
    }
    else {
      this.send(ErrorEvent.parse({
        type: "ERROR",
        assignation: message.assignation,
        error: `The assignation ${message.assignation} could not be cancelled because it was not found.`,
      }));
    }

  }

  private async handleMessage(message: ToAgentMessage) {
    switch (message.type) {
      case "INIT":

        break;
      case "ASSIGN":
        await this.handleAssign(message);
        break;
      case "CANCEL":
        await this.handleCancel(message);
        break;
      case "HEARTBEAT":
        // Handle heartbeat if needed, usually just reply
        await this.handleHeartbeat(message);
        break;
    }
  }

  private async handleAssign(message: Assign) {
    const { assignation, interface: interfaceName } = message;
    const handler = this.registry.get(interfaceName);

    if (!handler) {
      this.send(
        ErrorEvent.parse({
          type: "ERROR",
          assignation,
          error: `No handler for interface ${interfaceName}`,
        })
      );
      return;
    }

    try {

      const newController = new AbortController();
      this.cancelControllers.set(message.assignation, newController);


      handler({
        message,
        send: (msg) => this.send(msg),
        app: this.context,
        yield: (returns) => {
          this.send(
            YieldEvent.parse({
              type: "YIELD",
              assignation: message.assignation,
              returns,
            })
          );
        },
        error: (error) => {
          this.send(
            ErrorEvent.parse({
              type: "ERROR",
              assignation: message.assignation,
              error,
            })
          );
        },
        return: (returns) => {
          this.send(
            YieldEvent.parse({
              type: "YIELD",
              assignation: message.assignation,
              returns,
            })
          );
          this.send(
            DoneEvent.parse({
              type: "DONE",
              assignation: message.assignation,
            })
          );
        },
        controller: newController,
        navigate: this.navigate,
      });
    } catch (e: any) {
      this.send(
        CriticalEvent.parse({
          type: "ERROR",
          assignation: message.assignation,
          error: e.message || String(e),
        })
      );
    }
  }
}

export const Agent = () => {
  const arkitekt = useArkitekt();
  const navigate = useNavigate();
  const { settings } = useSettings();

  useEffect(() => {
    if (!arkitekt.connection || !settings.startAgent) return;

    const agent = new OrkestratorAgent(arkitekt, settings.instanceId, navigate);
    agent.registerElectron()
    agent.connect();

    return () => {
      agent.disconnect();
    };

  }, [arkitekt.connection, settings.startAgent, settings.instanceId]);

  return <></>;
};

