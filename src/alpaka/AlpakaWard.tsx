import { useAlpaka } from "@/arkitekt/Arkitekt";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { gql } from "@apollo/client";
import { useEffect } from "react";

export const AlpakaWard: React.FC<{
  fallback?: React.ReactNode;
}> = ({ key, fallback }) => {
  const client = useAlpaka();
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

      registry?.registerWard("alpaka", {
        search: runFunc,
      });
    }
  }, [client, registry]);

  return <></>;
};
