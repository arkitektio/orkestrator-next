import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useDatalayerEndpoint, useMikro } from "@/app/Arkitekt";
import type { AxisCoords } from "../coords/axisPath";
import {
  acquireAttributeService,
  type AttributeService,
  type PlanAttributesResult,
} from "./attributeService";

/**
 * React surface of the attribute service. The provider acquires the shared
 * (client, datalayer) service and releases it on unmount — mount it under
 * `Guard.Mikro` (it calls `useMikro()`; everything past that is imperative
 * GraphQL, so no query hooks fire). Consumers read attributes at arbitrary
 * coordinates with `useAttributesAt` — no <Scene> anywhere.
 */

const AttributeServiceContext = createContext<AttributeService | null>(null);

export const AttributeServiceProvider = ({ children }: { children: ReactNode }) => {
  const client = useMikro();
  const datalayer = useDatalayerEndpoint();
  const [service, setService] = useState<AttributeService | null>(null);

  useEffect(() => {
    if (!datalayer) return;
    const acquired = acquireAttributeService({ client, datalayer });
    setService(acquired.service);
    return () => {
      setService(null);
      acquired.release();
    };
  }, [client, datalayer]);

  return (
    <AttributeServiceContext.Provider value={service}>
      {children}
    </AttributeServiceContext.Provider>
  );
};

/** The shared service; null while the datalayer is still resolving. */
export const useAttributeServiceOrNull = (): AttributeService | null =>
  useContext(AttributeServiceContext);

export const useAttributeService = (): AttributeService => {
  const service = useAttributeServiceOrNull();
  if (!service) {
    throw new Error(
      "useAttributeService must be used under <AttributeServiceProvider> (with a resolved datalayer)",
    );
  }
  return service;
};

export type UseAttributesAtResult = {
  status: "idle" | "loading" | "ready" | "error";
  results: readonly PlanAttributesResult[];
  error: string | null;
};

/**
 * Attributes under a point, latest-wins: pass null to idle. Answers
 * synchronously from the service cache when the point was already asked;
 * otherwise runs the lookups with an AbortController so a superseded input
 * never delivers.
 */
export function useAttributesAt(
  input: { systemId: string; coords: AxisCoords } | null,
): UseAttributesAtResult {
  const service = useAttributeServiceOrNull();
  // Value-identity for the coords object so callers may inline literals.
  const inputKey = input
    ? `${input.systemId}|${Object.keys(input.coords)
        .sort()
        .map((axis) => `${axis}=${input.coords[axis]}`)
        .join(",")}`
    : null;
  const inputRef = useRef(input);
  inputRef.current = input;

  const instant = useMemo(
    () => (service && input ? service.peekAttributesAt(input) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [service, inputKey],
  );

  const [state, setState] = useState<UseAttributesAtResult>({
    status: "idle",
    results: [],
    error: null,
  });

  useEffect(() => {
    const current = inputRef.current;
    if (!service || !current) {
      setState({ status: "idle", results: [], error: null });
      return;
    }
    if (instant !== null) {
      setState({ status: "ready", results: instant, error: null });
      return;
    }
    const controller = new AbortController();
    setState({ status: "loading", results: [], error: null });
    service
      .attributesAt({ ...current, signal: controller.signal })
      .then((results) => {
        if (controller.signal.aborted) return;
        setState({ status: "ready", results, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          results: [],
          error: error instanceof Error ? error.message : "attribute lookup failed",
        });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, inputKey, instant]);

  return state;
}
