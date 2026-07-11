import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokClient } from "@/linkers";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useClientQuery } from "../api/graphql";

export const AgentPill = (props: { clientId: string }) => {
  const { data, error } = useClientQuery({
    variables: {
      clientId: props.clientId,
    },
  });

  const resolve = useResolve();

  if (error) {
    return <div>
        {JSON.stringify(error)}</div>;
  }

  const client = data?.client;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {client && (
          <LokClient.DetailLink object={client}>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage
                className="rounded-md center"
                src={resolve(client.logo?.presignedUrl)}
                alt={client.name}
              />
              <AvatarFallback>{client.release.app.identifier.slice(0, 2)}</AvatarFallback>
            </Avatar>
            {client.user?.username}
            {client.node ? <p className="text-muted-foreground">{client.node?.name || "Unlabeled Node"}</p> : ""}

          </LokClient.DetailLink>
        )}
      </TooltipTrigger>

      <TooltipContent>{client?.name}</TooltipContent>
    </Tooltip>
  );
};


export const ClientImage = (props: { clientId: string, className?: string }) => {
  const { data } = useClientQuery({
    variables: {
      clientId: props.clientId,
    },
  });

  const resolve = useResolve();

  return (
    <img
      className={props.className}
      src={resolve(data?.client.logo?.presignedUrl)}
      alt={data?.client.name}
    />
  );
};



export const JustClientName = (props: { clientId: string }) => {
  const { data } = useClientQuery({
    variables: {
      clientId: props.clientId,
    },
  });


  return <>{data?.client.release.app.identifier}:{data?.client.release.version}</>;
}
