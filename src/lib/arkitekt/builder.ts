import { resolveWorkingAlias } from "./alias/resolve";
import { FaktsEndpoint } from "./fakts/endpointSchema";
import { ActiveFakts, Alias } from "./fakts/faktsSchema";
import {
  AliasReport,
  AvailableService,
  ConnectedContext,
  EnhancedManifest,
  Service,
  ServiceBuilderMap,
  ServiceMap,
  Token,
  UnresolvedService
} from "./types";

export const buildContext = async <T extends Record<string, any> = Record<string, any>>({
  endpoint,
  fakts,
  manifest,
  serviceBuilderMap,
  token,
  controller,
}: {
  endpoint: FaktsEndpoint;
  fakts: ActiveFakts;
  manifest: EnhancedManifest;
  serviceBuilderMap: ServiceBuilderMap<T>;
  token: Token;
  controller: AbortController;
}): Promise<ConnectedContext<T>> => {
  const clients: { [key: string]: Service<any> } = {};
  const reports: { [key: string]: AliasReport } = {};

  console.log("Building clients for", fakts);

  const availableServices = [] as AvailableService[];
  const unresolvedServices = [] as UnresolvedService[];

  const servicePromises = Object.entries(serviceBuilderMap).map(
    async ([key, definition]) => {
      try {
        if (!definition.builder) {
          throw new Error(`No builder defined for service ${key}`);
        }

        if (!definition.service) {
          throw new Error(`No service defined for service ${key}`);
        }

        const serviceInstance = fakts.instances[key];
        if (!serviceInstance) {
          throw new Error(`No instance found for service ${key}`);
        }

        let alias: Alias;

        if (definition.omitchallenge) {
          alias = serviceInstance.aliases[0];
        } else {
          // Perform challenge if needed
          alias = await resolveWorkingAlias({
            instance: serviceInstance,
            timeout: 1000,
            controller,
          });
        }

        if (definition.forceinsecure) {
          alias.ssl = false;
        }

        const client = await definition.builder({
          manifest,
          alias,
          token,
          fakts,
          instance: serviceInstance,
        });

        return {
          key,
          client,
          availableService: {
            key,
            service: definition.service,
            resolved: alias,
          },
        };
      } catch (e) {
        console.error(`Failed to build client for ${key}`, e);
        return {
          key,
          unresolvedService: {
            key,
            service: definition.service,
            aliases: fakts.instances[key]?.aliases,
          },
        };
      }
    },
  );

  const results = await Promise.allSettled(servicePromises);

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      const { key, client, availableService, unresolvedService } = result.value;

      if (client && availableService) {
        clients[key] = client;
        availableServices.push(availableService);
        reports[key] = { valid: true, alias_id: availableService.resolved.id };
      } else if (unresolvedService) {
        reports[key] = { valid: true, reason: "Could not build service" };
        unresolvedServices.push(unresolvedService);
      }
    } else if (result.status === "rejected") {
      console.error("Service build failed:", result.reason);
      // Re-throw if it's a non-optional service that failed
      const failedKey = Object.keys(serviceBuilderMap).find(
        (key) => serviceBuilderMap[key] && !serviceBuilderMap[key].optional,
      );
      if (failedKey) {
        throw result.reason;
      }
    }
  }

  return {
    clients: clients as ServiceMap<T>,
    manifest: manifest,
    fakts: fakts,
    aliasReports: reports,
    availableServices: availableServices,
    unresolvedServices:
      unresolvedServices.length > 0 ? unresolvedServices : undefined,
    token: token,
    endpoint: endpoint,
  };
};

