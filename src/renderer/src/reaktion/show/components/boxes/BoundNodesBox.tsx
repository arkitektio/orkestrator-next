import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClientsQuery } from "@/rekuest/api/graphql";
import { Ban, CheckCheck, HelpCircle } from "lucide-react";
import { useMemo } from "react";
import { FlowNode } from "../../../types";

export const BoundNodesBox = (props: { nodes: FlowNode[] }) => {
  const hashes = useMemo(
    () => props.nodes.filter((n) => n.data.hash).map((n) => n.data.hash),
    [props.nodes],
  );

  const { data, error } = useClientsQuery({
    variables: {
      filters: {
        hasTemplatesFor: hashes,
      },
    },
  });

  return (
    <Card className="w-full ">
      <CardHeader className="flex flex-row h-14">
        {data?.clients?.length == 0 ? (
          <Ban className="text-red-600 my-auto " />
        ) : (
          <CheckCheck className="text-green-400 my-auto" />
        )}
        <CardTitle className=" ml-2 flex flex-row h-12">
          {data?.clients?.length == 0 ? (
            <>Workflow will not be schedule on any of your apps</>
          ) : (
            <>Workflow is bound</>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <HelpCircle className="h-4 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
              <h3 className="text-xs font-light">
                This Workflow is now a bound Workflow. This is because it uses
                data that might only live in the context of a one instance of an
                app and cannot be send to the server. This is not a bad thing it
                only means you can't schedule this workflow only one the below
                clients.
              </h3>
              <ul className="mt-4 space-y-2">
                {error && <>{JSON.stringify(error)}</>}
                {data?.clients?.length == 0 && (
                  <div className="text-sm text-gray-500">No bound nodes</div>
                )}
                {data?.clients?.map((client) => (
                  <Card key={client.id} className="flex items-center space-x-2">
                    <CardTitle>
                      <div className="text-sm font-bold">{client.name}</div>
                    </CardTitle>
                  </Card>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
