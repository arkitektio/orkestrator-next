import result from "@/reaktion/api/fragments";
import { useFakts } from "@jhnnsrs/fakts";
import { useFluss } from "@jhnnsrs/fluss-next";
import { useHerre } from "@jhnnsrs/herre";
import React, { useEffect } from "react";

export const FlussNextAutoConfigure: React.FC<{}> = (props) => {
  const { configure } = useFluss();
  const { token } = useHerre();
  const { fakts } = useFakts();

  useEffect(() => {
    if (token && fakts && fakts.fluss) {
      configure({
        secure: fakts.fluss.secure,
        wsEndpointUrl: fakts.fluss.ws_endpoint_url,
        endpointUrl: fakts.fluss.endpoint_url,
        possibleTypes: result.possibleTypes,
        retrieveToken: () => token,
      });
    }
  }, [token, fakts]);

  return <> </>;
};
