import React, { useEffect } from "react";
import { useFakts } from "@jhnnsrs/fakts";
import { useHerre } from "@jhnnsrs/herre";
import result from "@/reaktion/api/fragments";
import { useFluss } from "@jhnnsrs/fluss-next";

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
