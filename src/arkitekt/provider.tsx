import possibleTypes from "@/kabinet/api/fragments";
import { createKabinetClient } from "@/kabinet/lib/KabinetClient";
import { createLokClient } from "@/lok-next/lib/LokClient";
import { ApolloClient } from "@apollo/client";
import { Manifest, useFakts } from "@jhnnsrs/fakts";
import { useHerre } from "@jhnnsrs/herre";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type AppContext = {
  manifest: Manifest;
  clients: { [key: string]: ApolloClient<any> };
};

export const ArkitektContext = createContext<AppContext>({
  manifest: undefined as unknown as Manifest,
  clients: {},
});
export const useArkitekt = () => useContext(ArkitektContext);

export const ArkitektProvider = ({
  children,
  manifest,
}: {
  children: ReactNode;
  manifest: Manifest;
}) => {
  const { fakts } = useFakts();

  const { token } = useHerre();

  const [context, setContext] = useState<AppContext>({
    manifest: manifest,
    clients: {},
  });

  useEffect(() => {
    if (fakts && token && fakts.kabinet) {
      let x = createKabinetClient({
        endpointUrl: fakts.kabinet.endpoint_url,
        wsEndpointUrl: fakts.kabinet.ws_endpoint_url,
        retrieveToken: () => token,
        possibleTypes: possibleTypes.possibleTypes,
        secure: false,
      });

      let lok = createLokClient({
        endpointUrl: fakts.lok.endpoint_url,
        wsEndpointUrl: fakts.lok.ws_endpoint_url,
        retrieveToken: () => token,
        possibleTypes: possibleTypes.possibleTypes,
      });

      setContext({ manifest: manifest, clients: { kabinet: x, lok } });
    }
  }, [fakts, token]);

  return (
    <ArkitektContext.Provider value={context}>
      {children}
    </ArkitektContext.Provider>
  );
};
