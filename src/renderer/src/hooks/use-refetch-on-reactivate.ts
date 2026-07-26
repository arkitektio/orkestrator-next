import { useEffect, useRef } from "react";
import type { ApolloClient } from "@apollo/client";
import { useConnection } from "@/lib/arkitekt/provider";

/** Paired `focus` + `visibilitychange` events fire for one reactivation.
 *  Collapse anything within this window into a single refetch sweep. */
const COOLDOWN_MS = 800;

/**
 * Re-run every currently-active GraphQL query when the app is reactivated —
 * i.e. when the window regains focus or the tab becomes visible again after the
 * user switched to another app (or the machine slept).
 *
 * Iterates the live `serviceMap` and calls `refetchQueries({ include: "active" })`
 * on each ready Apollo client, so whatever is on screen refreshes transparently.
 * Subscriptions are untouched — only active queries re-run.
 */
export const useRefetchOnReactivate = () => {
  const connection = useConnection();

  // Keep the latest connection in a ref so the listeners are bound once and
  // don't churn every time the service map changes.
  const connectionRef = useRef(connection);
  connectionRef.current = connection;

  const lastRunRef = useRef(0);

  useEffect(() => {
    const onReactivate = () => {
      const now = Date.now();
      if (now - lastRunRef.current < COOLDOWN_MS) return;
      lastRunRef.current = now;

      const serviceMap = connectionRef.current?.serviceMap;
      if (!serviceMap) return;

      for (const service of Object.values(serviceMap)) {
        if (service?.type !== "apollo") continue;
        try {
          const client = service.client as ApolloClient<unknown>;
          void client.refetchQueries({ include: "active" });
        } catch (e) {
          console.warn("[refetch-on-reactivate] refetch failed for service:", e);
        }
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") onReactivate();
    };

    window.addEventListener("focus", onReactivate);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onReactivate);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
};

/** Mount once inside `Arkitekt.Provider` to enable refetch-on-reactivate. */
export const RefetchOnReactivate = () => {
  useRefetchOnReactivate();
  return null;
};
