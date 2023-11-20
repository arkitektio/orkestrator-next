import React, { useEffect } from "react";
import { useFakts } from "@jhnnsrs/fakts";
import { useHerre } from "@jhnnsrs/herre";
import result from "@/rekuest/api/fragments";
import { useRekuest } from "@jhnnsrs/rekuest-next";

export const RekuestNextAutoConfigure: React.FC<{}> = (props) => {
  const { configure } = useRekuest();
  const { token } = useHerre();
  const { fakts } = useFakts();

  useEffect(() => {
    if (token && fakts && fakts.rekuest_next) {
      configure({
        secure: fakts.rekuest_next.secure,
        wsEndpointUrl: fakts.rekuest_next.ws_endpoint_url,
        endpointUrl: fakts.rekuest_next.endpoint_url,
        possibleTypes: result.possibleTypes,
        retrieveToken: () => token,
      });
    }
  }, [token, fakts]);

  return <> </>;
};