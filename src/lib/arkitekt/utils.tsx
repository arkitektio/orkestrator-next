import { anySignal } from "any-signal";
import { AppContext } from "./provider";
import { ApolloClient, NormalizedCache } from "@apollo/client";
function mstimeout(ms: number) {
  return new Promise((resolve, reject) =>
    setTimeout(() => reject(Error(`Timeout after ${ms}`)), ms),
  );
}


export const selectService = (context: AppContext, name: string) => {
  const client = context.connection?.clients[name];
  if (!client) {
    throw new Error(`Client ${name} not found`);
  }
  return client;
}

export const selectAlias = (context: AppContext, name: string): Alias => {
  const client = context.connection?.clients[name];
  if (!client) {
    throw new Error(`Client ${name} not found`);
  }
  return client.alias;
}


export const selectApolloClient = (
  context: AppContext,
  name: string,
): ApolloClient<NormalizedCache> => {
  const client = selectService(context, name).client;
  return client as ApolloClient<NormalizedCache>;
}


export async function awaitWithTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T> {
  return (await Promise.race([promise, mstimeout(ms)])) as T;
}

type ExpandedRequestInit = RequestInit & {
  timeout: number;
  controller: AbortController;
};

export async function fetchWithTimeout(
  resource: RequestInfo,
  options: ExpandedRequestInit,
) {
  let id: NodeJS.Timeout | undefined = undefined;
  let timeoutController: AbortController | undefined = undefined;
  if (options?.timeout) {
    timeoutController = new AbortController();

    id = setTimeout(
      () =>
        timeoutController &&
        timeoutController.abort(new Error("Timeout Error")),
      options.timeout,
    );
    options.signal = anySignal([
      options.controller.signal,
      timeoutController.signal,
    ]);
  } else {
    options.signal = options?.controller.signal;
  }

  try {
    const response = await fetch(resource, {
      ...options,
    });
    if (id) {
      clearTimeout(id);
    }
    return response;
  } catch (e) {
    if (id) {
      clearTimeout(id);
    }

    if (options.controller.signal.aborted) {
      throw new Error("User Cancelled");
    }

    if (timeoutController) {
      if (timeoutController.signal.aborted) {
        throw new Error("Timeout Error");
      }
    }

    throw e;
  }
}
