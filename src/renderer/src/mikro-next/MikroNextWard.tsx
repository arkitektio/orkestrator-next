import { build } from "@/hooks/use-metaapp";
import { useMikro } from "@/app/Arkitekt";
import { buildDescribeFunction } from "@/rekuest/widgets/utils";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { gql } from "@apollo/client";
import { useEffect } from "react";

export const MikroNextWard: React.FC<{
  fallback?: React.ReactNode;
}> = ({ key, fallback }) => {
  const client = useMikro();
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

      registry?.registerWard("mikro", {
        search: runFunc,
        describe: buildDescribeFunction(client),
      });
    }
  }, [client, registry]);

  return <></>;
};
