import { NO_RECONNECT_CODES } from "@/constants";
import { aliasToWsPath } from "@/lib/arkitekt/alias/helpers";
import type { AppContext } from "@/lib/arkitekt/provider";
import type { AvailableService } from "@/lib/arkitekt/types";
import { TokenResponse } from "@/lib/arkitekt/fakts/tokenSchema";
import { selectAlias, selectApolloClient } from "@/lib/arkitekt/utils";
import { DefinitionInput, EnsureAgentDocument, EnsureAgentMutation, EnsureAgentMutationVariables, ImplementationInput} from "@/rekuest/api/graphql";
import { ApolloClient, NormalizedCache } from "@apollo/client";
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
import { globalRegistry } from "./registry";
import { AgentFunction, AssignContext, InferDefinition } from "./types";

export type AgentState = {
  assignments: Assign[];
  errors: string[];
  connected: boolean;
  lastCode?: number;
  lastReason?: string;
}

export type AgentListener = (state: AgentState) => void;

type RegisteredAgentContext = Omit<
  AssignContext<Record<string, unknown>, Record<string, unknown>>,
  "args"
>;

type RegisteredAgentFunction = (context: RegisteredAgentContext) => void | Promise<void>;

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 3000;
const RETRY_RESET_MS = 10000;

const isAbortError = (error: unknown) => {
  return error instanceof Error && error.name === "AbortError";
};

const getAccessToken = (token: TokenResponse | string) => {
  if (typeof token === "string") {
    return token;
  }

  if (token.access_token) {
    return token.access_token;
  }

  throw new Error("No access token available for agent connection");
};

export class OrkestratorAgent {
  instanceId: string;
  context: AppContext;
  rekuestClient: ApolloClient<NormalizedCache>;
  ws: WebSocket | null = null;
  cancelControllers: Map<string, AbortController> = new Map();
  requestControllers: Set<AbortController> = new Set();
  electronListeners: Map<string, (type: string, data: unknown) => void> = new Map();
  registry: Map<string, RegisteredAgentFunction> = new Map();
  implementations: ImplementationInput[] = [];
  reconnectTimer: NodeJS.Timeout | null = null;
  stableConnectionTimer: NodeJS.Timeout | null = null;
  shouldReconnect = true;
  reconnectAttempts = 0;
  token: string
  agentUrl: string;
  navigate: (path: string) => void;

  assignments: Assign[] = [];
  errors: string[] = [];
  connected: boolean = false;
  lastCode?: number;
  lastReason?: string;
  listeners: AgentListener[] = [];

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

    this.token = getAccessToken(this.context.connection.token)

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

  public subscribe(listener: AgentListener) {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  public getState(): AgentState {
    return {
      assignments: this.assignments,
      errors: this.errors,
      connected: this.connected,
      lastCode: this.lastCode,
      lastReason: this.lastReason,
    };
  }

  public register<const D extends DefinitionInput, R extends Record<string, unknown> = Record<string, unknown>>(
    name: string,
    func: AgentFunction<AssignContext<InferDefinition<D>, R>>,
    definition: D,
  ) {
    this.registry.set(name, func as RegisteredAgentFunction);
    this.implementations.push({
      interface: name,
      definition: definition,
      dependencies: [],
    });
  }

  private getAvailableServices(): AvailableService[] {
    return Object.entries(this.context.connection?.serviceMap ?? {}).flatMap(([key, service]) => {
      if (!service || !service.alias) {
        return [];
      }

      return [{
        key,
        service: service.type ?? key,
        resolved: service.alias,
      }];
    });
  }

  notifyElectronListener(id: string, type: string, data: unknown) {
    const listener = this.electronListeners.get(id);
    if (listener) listener(type, data);
  }

  private createRequestController() {
    const controller = new AbortController();
    this.requestControllers.add(controller);
    return controller;
  }

  private releaseRequestController(controller: AbortController) {
    this.requestControllers.delete(controller);
  }

  private abortAllControllers() {
    this.cancelControllers.forEach((controller) => {
      controller.abort();
    });
    this.cancelControllers.clear();

    this.requestControllers.forEach((controller) => {
      controller.abort();
    });
    this.requestControllers.clear();
  }

  private async runAbortableRequest<T>(
    request: (controller: AbortController) => Promise<T>,
  ): Promise<T> {
    const controller = this.createRequestController();

    try {
      return await request(controller);
    } finally {
      this.releaseRequestController(controller);
    }
  }

  async registerElectron() {
    try {
      if (window.api) {
        await window.api.initAgent({
          token: this.token,
          url: this.context.connection!.endpoint.base_url,
          instanceId: this.instanceId,
          agentUrl: this.agentUrl,
          services: this.getAvailableServices(),
        });

        const impls = await window.api.inspectElectronAgent();
        console.log("Electron agent implementations:", impls);
        impls.forEach(impl => {
          if (!impl.interface) return;
          this.register(impl.interface, async (context) => {
            this.electronListeners.set(context.message.assignation, (type, data) => {
              if (!data || typeof data !== "object") {
                return;
              }

              if (type === "yield" && "returns" in data) context.yield(data.returns as Record<string, unknown>);
              if (type === "done" && "returns" in data) context.return(data.returns as Record<string, unknown>);
              if (type === "error" && "error" in data) context.error(String(data.error));
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
      if (isAbortError(e)) {
        return;
      }
      console.error("Error registering electron agent:", e);
    }
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private clearStableConnectionTimer() {
    if (this.stableConnectionTimer) {
      clearTimeout(this.stableConnectionTimer);
      this.stableConnectionTimer = null;
    }
  }

  private setConnectionFailure(reason: string, code?: number) {
    this.connected = false;
    this.lastCode = code;
    this.lastReason = reason;
    this.errors = [...this.errors, reason];
    this.notify();
  }

  private scheduleReconnect() {
    if (!this.shouldReconnect) {
      return;
    }

    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.setConnectionFailure(
        `Could not connect to the AGI endpoint after ${MAX_RECONNECT_ATTEMPTS} retries.`,
        this.lastCode,
      );
      return;
    }

    this.reconnectAttempts += 1;
    const retryNumber = this.reconnectAttempts;
    const existingReason = this.lastReason?.trim();
    const retryReason = existingReason
      ? `${existingReason} Retrying ${retryNumber}/${MAX_RECONNECT_ATTEMPTS}.`
      : `Retrying connection to the AGI endpoint (${retryNumber}/${MAX_RECONNECT_ATTEMPTS}).`;

    this.lastReason = retryReason;
    this.notify();

    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, RECONNECT_DELAY_MS);
  }

  public async announce() {
    if (!this.rekuestClient) throw new Error("Rekuest client not found");

    await this.registerElectron();

    const result = await this.runAbortableRequest((controller) =>
      this.rekuestClient.mutate<EnsureAgentMutation, EnsureAgentMutationVariables>({
        mutation: EnsureAgentDocument,
        variables: {
          input: {
            instanceId: this.instanceId,
            name: "Orkestrator",
          },
        },
        context: {
          fetchOptions: {
            signal: controller.signal,
          },
        },
      }),
    );

   // Reimplmemnt with new api


  }

  public connect() {

    console.log("Connecting agent...");

    this.clearReconnectTimer();
    this.clearStableConnectionTimer();

    this.announce();

    this.errors = [];
    this.lastCode = undefined;
    this.lastReason = undefined;
    this.notify();

    this.ws = new WebSocket(this.agentUrl);

    this.ws.onopen = () => {
      this.connected = true;
      this.clearStableConnectionTimer();
      this.stableConnectionTimer = setTimeout(() => {
        this.reconnectAttempts = 0;
        this.stableConnectionTimer = null;
      }, RETRY_RESET_MS);
      this.notify();

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

    this.ws.onclose = (event) => {
      console.log("Agent connection closed", event);
      this.clearStableConnectionTimer();
      this.connected = false;
      this.lastCode = event.code;
      this.lastReason = event.reason;
      this.notify();

      if (this.shouldReconnect && !NO_RECONNECT_CODES.includes(event.code)) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (e) => {
      console.error("Agent error", e);
      this.clearStableConnectionTimer();
      this.errors.push("Websocket error");
      this.connected = false;
      this.notify();
    };
  }

  public disconnect() {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.clearStableConnectionTimer();
    this.abortAllControllers();
    this.ws?.close();
    this.connected = false;
    this.notify();
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
      this.cancelControllers.delete(message.assignation);
      this.send(CancelledEvent.parse({
        type: "CANCELLED",
        assignation: message.assignation,
      }));
      this.assignments = this.assignments.filter(a => a.assignation !== message.assignation);
      this.notify();
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
      this.assignments.push(message);
      this.notify();


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
          this.cancelControllers.delete(message.assignation);
          this.assignments = this.assignments.filter(a => a.assignation !== message.assignation);
          this.notify();
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
          this.cancelControllers.delete(message.assignation);
          this.assignments = this.assignments.filter(a => a.assignation !== message.assignation);
          this.notify();
        },
        controller: newController,
        navigate: this.navigate,
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.send(
        CriticalEvent.parse({
          type: "ERROR",
          assignation: message.assignation,
          error: errorMessage,
        })
      );
      this.cancelControllers.delete(message.assignation);
      this.assignments = this.assignments.filter(a => a.assignation !== message.assignation);
      this.notify();
    }
  }
}



