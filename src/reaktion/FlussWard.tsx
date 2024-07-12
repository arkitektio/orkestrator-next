import { useService } from "@/arkitekt/hooks";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { gql } from "@apollo/client";
import { useEffect } from "react";

export const FlussWard: React.FC<{
  key?: string;
  fallback?: React.ReactNode;
}> = ({ key, fallback }) => {
  const client = useService("fluss");
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

      registry?.registerWard(key || "fluss", {
        search: runFunc,
      });
    }
  }, [client, registry]);

  return <></>;
};
