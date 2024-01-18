import result from "@/lok-next/api/fragments";
import { useFakts } from "@jhnnsrs/fakts";
import { useHerre } from "@jhnnsrs/herre";
import { usePort } from "@jhnnsrs/port-next";
import React, { useEffect } from "react";

export const PortAutoConfigure: React.FC<{}> = (props) => {
  const { configure } = usePort();
  const { token } = useHerre();
  const { fakts } = useFakts();

  useEffect(() => {
    if (token && fakts && fakts.port_next) {
      configure({
        secure: fakts.port_next.secure,
        wsEndpointUrl: fakts.port_next.ws_endpoint_url,
        endpointUrl: fakts.port_next.endpoint_url,
        possibleTypes: result.possibleTypes,
        retrieveToken: () => token,
      });
    }
  }, [token, fakts]);

  return <> </>;
};
