import result from "@/mikro-next/api/fragments";
import { useFakts } from "@jhnnsrs/fakts";
import { useDatalayer } from "@jhnnsrs/datalayer";
import { useMikroNext } from "@jhnnsrs/mikro-next";
import React, { useEffect } from "react";
import { RequestAccessDocument, RequestAccessMutation } from "@/mikro-next/api/graphql";

export const MikroNextAutoConfigure: React.FC<{}> = (props) => {
  const { configure } = useDatalayer();
  const { client } = useMikroNext();
  const { fakts } = useFakts();

  useEffect(() => {
    if (client && fakts && fakts.datalayer) {
      configure({
        endpointUrl: fakts.datalayer.endpoint_url,
        credentialsRetriever: async () => {
          let x = await client.query<RequestAccessMutation>({
            query: RequestAccessDocument,
            variables: {},
          });
          if (!x.data.requestAccess) {
            throw Error("No request found");
          }
          return x.data.requestAccess;
        },
        presign: async (key: string) => {
          let x = await client.mutate<PresignMutation>({
            mutation: PresignDocument,
            variables: {
              file: key,
            },
          });
          if (!x.data?.presign) {
            throw Error("No request found");
          }
          return x.data.presign;
        },
      });
    }
  }, [cient, fakts]);

  return <> </>;
};
