import { IpcMain } from "electron";
import { electronRegistry } from "./agent-registry";
import { Assign } from "./message";
import { registerWatcher } from "./watcher";
import { GraphQLClient } from 'graphql-request';
import { ImplementationInput as SchemaImplementationInput } from './schemas/rekuest'; // Generated file

type Alias = {
  host: string;
  port?: number | null;
  ssl: boolean;
  path?: string | null;
}

type AvailableService = {
  key: string;
  service: string;
  resolved: Alias;
};

const aliasToUrl = (alias: Alias) => {
    let url = alias.ssl ? "https://" : "http://";
    url += alias.host;
    if (alias.port) {
        url += `:${alias.port}`;
    }
    if (alias.path) {
        url += `/${alias.path}`;
    }
    return url;
}

export class AgentGateway {
  private ipc: IpcMain;
  private token: string | null = null;
  private implementations: SchemaImplementationInput[] = [];
  private cancelControllers: Map<string, AbortController> = new Map();
  private services: Map<string, GraphQLClient> = new Map();

  constructor(ipc: IpcMain) {
    this.ipc = ipc;

    registerWatcher();
    this.setup();
  }

  setup() {
    this.ipc.handle("agent:inspect-electron-agent", async () => {
      return this.implementations;
    });

    this.ipc.handle("agent:init", async (_, args) => {

        await this.initialize(args);
    });

    this.ipc.handle("agent:execute", async (event, assignation) => {
        console.log("Executing assignation", assignation);
        await this.handleAssign(event.sender, assignation);
    });

    this.ipc.handle("agent:cancel", async (_, args: { assignationId: string }) => {

        const controller = this.cancelControllers.get(args.assignationId);
        if (controller) {
            controller.abort();
        }
    });
  }

  public async initialize(context: { token: string, url: string, instanceId: string, agentUrl: string, services: AvailableService[] }) {
      this.token = context.token;

      const client = new GraphQLClient(context.url, {
          headers: {
              Authorization: `Bearer ${this.token}`,
          }
      });
      this.services.set("rekuest", client);

      if (context.services) {
        context.services.forEach(service => {
            const url = aliasToUrl(service.resolved);
            const serviceClient = new GraphQLClient(url + "/graphql", {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                }
            });
            this.services.set(service.key, serviceClient);
        });
      }

      // Register registry entries
      electronRegistry.entries.forEach(entry => {
          this.implementations.push({
              interface: entry.name,
              definition: entry.definition,
              dependencies: [],
          });
      });
  }

  public async handleAssign(sender: Electron.WebContents, assignation: Assign) {
    try {
      const entry = electronRegistry.entries.find(e => e.name === assignation.interface);
      if (!entry) {
          console.error("Function not found", assignation.interface);
          sender.send("agent:error", { assignation: assignation.assignation, error: `Function not found: ${assignation.interface}` });
          return;
      }

      const controller = new AbortController();
      this.cancelControllers.set(assignation.assignation, controller);

      try {
          await entry.func({
              message: assignation,
              args: assignation.args,
              send: () => {
                  // Not implemented for now
              },
              client: this.services.get("rekuest")!,
              yield: (returns) => {
                  sender.send("agent:yield", { assignation: assignation.assignation, returns });
              },
              return: (returns) => {
                  sender.send("agent:return", { assignation: assignation.assignation, returns });
              },
              error: (error) => {
                  sender.send("agent:error", { assignation: assignation.assignation, error });
              },
              log: (level, message) => {
                  sender.send("agent:log", { assignation: assignation.assignation, level, message });
              },
              signal: controller.signal,
          });
      } catch (e) {
          console.error("Error executing function", e);
          sender.send("agent:error", { assignation: assignation.assignation, error: e instanceof Error ? e.message : String(e) });
      }

      this.cancelControllers.delete(assignation.assignation);
    }
    catch (e) {
      console.error("Error handling assign", e);
      sender.send("agent:error", { assignation: assignation.assignation, error: e instanceof Error ? e.message : String(e) });
  }
}

}
