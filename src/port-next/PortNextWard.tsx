import { gql } from "@apollo/client";
import { usePort } from "@jhnnsrs/port-next";
import { useWidgetRegistry } from "@jhnnsrs/rekuest-next";
import { useEffect } from "react";

export const PortNextWard: React.FC<{
  key?: string;
  fallback?: React.ReactNode;
}> = ({ key, fallback }) => {
  const { client } = usePort();
  const { registry } = useWidgetRegistry();

  useEffect(() => {
    if (client) {
      const runFunc = (options: { query: string; variables: any }) => {
        let document = gql(options.query);
        return client
          .query({
            query: document,
            variables: options.variables,
          })
          .then((result: any) => {
            console.log(result.data);
            return result.data.options;
          });
      };

      registry?.registerWard(key || "port_next", {
        search: runFunc,
      });
    }
  }, [client, registry]);

  return <></>;
};
