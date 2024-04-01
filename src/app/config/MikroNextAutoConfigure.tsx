import result from "@/mikro-next/api/fragments";
import { useFakts } from "@jhnnsrs/fakts";
import { useHerre } from "@jhnnsrs/herre";
import { useMikroNext } from "@jhnnsrs/mikro-next";
import React, { useEffect } from "react";

export const MikroNextAutoConfigure: React.FC<{}> = (props) => {
  const { configure } = useMikroNext();
  const { token } = useHerre();
  const { fakts } = useFakts();

  useEffect(() => {
    if (token && fakts && fakts.mikro) {
      configure({
        secure: fakts.mikro.secure,
        wsEndpointUrl: fakts.mikro.ws_endpoint_url,
        endpointUrl: fakts.mikro.endpoint_url,
        possibleTypes: result.possibleTypes,
        retrieveToken: () => token,
      });
    }
  }, [token, fakts]);

  return <> </>;
};
