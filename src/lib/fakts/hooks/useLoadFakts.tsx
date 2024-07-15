import { useCallback, useState } from "react";
import { CancelableRequest, Fakts, FaktsRequest, useFakts } from "../FaktsContext";

export const useLoadFakts = () => {
  const { load: faktsLoad, setFakts, fakts, registeredEndpoints, registerEndpoints } = useFakts();
  const [progress, setProgress] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [promise, setPromise] = useState<CancelableRequest<Fakts> | null>(null);

  const load = useCallback(
    (request: FaktsRequest) => {
      if (promise) {
        promise.cancel();
      } else {
        let manifest = request.manifest;

        if (request.requestedClientType == "website" && !request.requestedRedirectURIs) {
          throw new Error(
            "No redirect URI specified, but requested website, please set requestedRedirectURIs"
          );
        }

        if (!manifest) {
          throw new Error("No manifest");
        }

        setError(undefined);
        const newPromise = faktsLoad({
          ...request,
          manifest,
          onProgress: (progress) => {
            request.onProgress && request.onProgress(progress);
            setProgress(progress);
          },
          deviceCodeExpirationTime: 200000,
          maxChallengeRetries: 30,
          maxRetrievalAttempts: 30
        });

        newPromise.promise
          .then((x) => {
            setPromise(null);
            setProgress(undefined);
          })
          .catch((e) => {
            console.log("Error", e);

            setPromise(null);
            setError(e.message);
          });

        setPromise(newPromise);
      }
    },
    [promise]
  );

  const remove = useCallback(() => {
    if (promise) {
      promise.cancel();
    } else {
      setFakts(null);
    }
  }, [promise]);

  console.log("rerender");

  return {
    progress,
    loading: promise != null,
    load,
    remove,
    error,
    fakts,
    registerEndpoints,
    registeredEndpoints
  };
};
