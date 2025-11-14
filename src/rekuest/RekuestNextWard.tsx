import { useRekuest } from "@/lib/arkitekt/Arkitekt";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { gql } from "@apollo/client";
import { useEffect } from "react";
import { buildDescribeFunction } from "./widgets/utils";

export const RekuestNextWard: React.FC<{
  fallback?: React.ReactNode;
}> = ({ key, fallback }) => {
  const client = useRekuest();
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

      registry?.registerWard("rekuest", {
        search: runFunc,
        describe: buildDescribeFunction(client),
      });

      console.log("regivstered", {
        search: runFunc,
      });
    }
  }, [client, registry]);

  return <></>;
};
