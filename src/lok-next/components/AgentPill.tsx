import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokClient } from "@/linkers";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useClientQuery } from "../api/graphql";

export const AgentPill = (props: { clientId: string }) => {
  const { data } = useClientQuery({
    variables: {
      clientId: props.clientId,
    },
  });

  const resolve = useResolve();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {data?.client.id && (
          <LokClient.DetailLink object={data?.client.id}>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage
                className="rounded-md center"
                src={resolve(data?.client.logo?.presignedUrl)}
                alt={data?.client.name}
              />
              <AvatarFallback>{data?.client.release.app.identifier.slice(0, 2)}</AvatarFallback>
            </Avatar>
            {data.client.user?.username}
            {data.client.node ? <p className="text-muted-foreground">{data.client.node?.name || "Unlabeled Node"}</p> : ""}
          </LokClient.DetailLink>
        )}
      </TooltipTrigger>

      <TooltipContent>{data?.client.name}</TooltipContent>
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
