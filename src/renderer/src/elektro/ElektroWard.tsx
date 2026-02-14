import { useElektro } from "@/app/Arkitekt";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { gql } from "@apollo/client";
import { useEffect } from "react";

export const ElektroWard: React.FC<{
  fallback?: React.ReactNode;
  key: string;
}> = ({ key, fallback }) => {
  const client = useElektro();
  const { registry } = useWidgetRegistry();

  useEffect(() => {
    if (client) {
      const runFunc = (options: { query: string; variables: any }) => {
        const document = gql(options.query);
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

      registry?.registerWard("elektro", {
        search: runFunc,
      });
    }
  }, [client, registry]);

  return <>{fallback}</>;
};
