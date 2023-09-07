import result from "@/lok-next/api/fragments";
import { useFakts } from "@jhnnsrs/fakts";
import { useHerre } from "@jhnnsrs/herre";
import { useLokNext } from "@jhnnsrs/lok-next";
import React, { useEffect } from "react";

export const LokNextAutoConfigure: React.FC<{}> = (props) => {
  const { configure } = useLokNext();
  const { token } = useHerre();
  const { fakts } = useFakts();

  useEffect(() => {
    if (token && fakts && fakts.lok) {
      configure({
        secure: fakts.lok.secure,
        wsEndpointUrl: fakts.lok.ws_endpoint_url,
        endpointUrl: fakts.lok.endpoint_url,
        possibleTypes: result.possibleTypes,
        retrieveToken: () => token,
      });
    }
  }, [token, fakts]);

  return <> </>;
};
