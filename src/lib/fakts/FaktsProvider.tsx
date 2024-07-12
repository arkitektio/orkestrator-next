import { useEffect, useState } from "react";
import {
  Fakts,
  FaktsContext,
  FaktsEndpoint,
  FaktsRequest,
  Grant,
  StorageProvider,
  Validator,
} from "./FaktsContext";
import { buildRemoteGrant } from "./grants/meta";
import {
  buildFailsafeDemander,
  demandDeviceToken,
  demandRetrieve,
} from "./grants/remote/demanders";

export type FaktsProps = {
  children?: any;
  store?: string;
  defaultRequestParams?: Partial<FaktsRequest>;
  storageProvider?: StorageProvider;
  staticEndpoints?: FaktsEndpoint[];
  grant?: Grant;
  validate?: Validator;
};

export const localStorageProvider = {
  set: async (key: string, value: any) => {
    localStorage.setItem(key, value);
  },
  get: async (key: string) => {
    return localStorage.getItem(key);
  },
};

export const validateDictionary = async (obj: any): Promise<Fakts> => {
  // Check if it's an object
  console.log("Validating", obj);

  if (typeof obj !== "object" || obj === null) {
    throw new Error("The value provided is not an object");
  }

  // Check if all keys are strings
  for (const key in obj) {
    if (!obj.hasOwnProperty(key) || typeof key !== "string") {
      throw new Error("The object provided contains non-string keys");
    }
  }

  // If all checks pass, return true
  return obj;
};

export const defaultRemoteGrant = buildRemoteGrant({
  demand: buildFailsafeDemander(demandRetrieve, demandDeviceToken),
});

export const FaktsProvider = ({
  children,
  store = "fakts-config",
  storageProvider = localStorageProvider,
  staticEndpoints = [],
  defaultRequestParams = {},
  grant = defaultRemoteGrant,
  validate = validateDictionary,
}: FaktsProps) => {
  const [faktsState, setConfigState] = useState<Fakts | null | undefined>(null);

  const [registeredEndpoints, setRegisteredEndpoints] =
    useState<FaktsEndpoint[]>(staticEndpoints);

  const setFaktsAsync = async (newFakts?: Fakts | null | undefined) => {
    const validatedFakts = newFakts ? await validate(newFakts) : null;
    const validatedFaktsString = validatedFakts
      ? JSON.stringify(validatedFakts)
      : "";

    await storageProvider.set(store, validatedFaktsString);
    setConfigState((x) => newFakts);
  };

  const setFakts = (newFakts?: Fakts | null | undefined) => {
    setFaktsAsync(newFakts);
  };

  const reset = async () => {
    await setFaktsAsync();
  };

  const registerEndpoints = (endpoints: FaktsEndpoint[]) => {
    setRegisteredEndpoints((oldEndpoints) => {
      let newEndpoints = [...oldEndpoints, ...endpoints];

      const seenUrls = new Set();
      const uniqueEndpoints = newEndpoints.filter((item) => {
        if (seenUrls.has(item.base_url)) {
          return false;
        } else {
          seenUrls.add(item.base_url);
          return true;
        }
      });

      return uniqueEndpoints;
    });

    return () => {
      setRegisteredEndpoints((oldEndpoints) => {
        let newEndpoints = oldEndpoints.filter((endpoint) => {
          let index = endpoints.findIndex(
            (e) => e.base_url === endpoint.base_url,
          );
          if (index >= 0) {
            return false;
          }
          return true;
        });
        return newEndpoints;
      });
    };
  };

  const load = (request: FaktsRequest) => {
    console.log("Loading");

    let abortController = new AbortController();

    let result = new Promise<Fakts>(async (resolve, reject) => {
      try {
        request = { ...defaultRequestParams, ...request };

        let fakts = await grant(request, abortController);
        console.log("Fakts loaded", fakts);
        await setFaktsAsync(fakts);
        console.log("Fakts loaded");
        resolve(fakts);
      } catch (e) {
        console.error("Could not load Fakts", e);
        reject(e);
      }
    });

    return {
      cancel: () => {
        abortController.abort();
      },
      promise: result,
    };
  };

  useEffect(() => {
    storageProvider
      .get(store)
      .then(async (x) => JSON.parse(x as string))
      .then(validate)
      .then(setFaktsAsync)
      .catch((e) => console.error("Could not load Fakts", e));
  }, [store]);

  return (
    <FaktsContext.Provider
      value={{
        fakts: faktsState,
        setFakts: setFakts,
        load: load,
        reset,
        registeredEndpoints,
        registerEndpoints,
      }}
    >
      {children}
    </FaktsContext.Provider>
  );
};
