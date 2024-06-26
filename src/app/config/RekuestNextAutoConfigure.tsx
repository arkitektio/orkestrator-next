import result from "@/rekuest/api/fragments";
import { useFakts } from "@jhnnsrs/fakts";
import { useHerre } from "@jhnnsrs/herre";
import { useRekuest } from "@jhnnsrs/rekuest-next";
import React, { useEffect } from "react";

export const RekuestNextAutoConfigure: React.FC<{}> = (props) => {
  const { configure } = useRekuest();
  const { token } = useHerre();
  const { fakts } = useFakts();

  useEffect(() => {
    if (token && fakts && fakts.rekuest) {
      configure({
        secure: fakts.rekuest.secure,
        wsEndpointUrl: fakts.rekuest.ws_endpoint_url,
        endpointUrl: fakts.rekuest.endpoint_url,
        possibleTypes: result.possibleTypes,
        retrieveToken: () => token,
      });
    }
  }, [token, fakts]);

  return <> </>;
};
