import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokClient } from "@/linkers";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useClientQuery } from "../api/graphql";

export const ClientAvatar = (props: { clientId: string }) => {
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
                className="rounded-md"
                src={resolve(data?.client.logo?.presignedUrl)}
                alt={data?.client.name}
              />
              <AvatarFallback>{data?.client.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </LokClient.DetailLink>
        )}
      </TooltipTrigger>

      <TooltipContent>{data?.client.name}</TooltipContent>
    </Tooltip>
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