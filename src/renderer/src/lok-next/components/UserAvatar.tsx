import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokComputeNode, LokUser } from "@/linkers";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useGetDeviceByDeviceIdQuery, useGetDeviceQuery, useUserQuery } from "../api/graphql";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const UserAvatar = (props: { sub: string, className?: string }) => {
  const { data } = useUserQuery({
    variables: {
      id: props.sub,
    },
  });

  return (
    <Avatar className={cn(props.className)}>

      <AvatarFallback>{data?.user.username.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
};



export const DeviceImprint = (props: { deviceId: string, className?: string }) => {
  const { data } = useGetDeviceByDeviceIdQuery({
    variables: {
      id: props.deviceId,
    },
  });

  if (!data) {
    return <Badge className="animate-pule">
      Loading
    </Badge>;
  }


  return (
    <LokComputeNode.DetailLink object={data?.deviceByDeviceId}>
      <Badge className={cn("text-xs font-mono mx-3  truncate elipsis flex flex-wrap items-left align-left group-hover:opacity-100 opacity-0 transition-opacity", !data?.deviceByDeviceId && "animate-pulse ", props.className)}>
        {data?.deviceByDeviceId?.name || "Unknown"}
      </Badge>
    </LokComputeNode.DetailLink>
  );
};

export const UserUsername = (props: { sub: string }) => {
  const { data } = useUserQuery({
    variables: {
      id: props.sub,
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <LokUser.DetailLink object={{ id: props.sub }}>
          <span className="cursor-pointer">{data?.user.username}</span>
        </LokUser.DetailLink>
      </TooltipTrigger>

      <TooltipContent>{data?.user.username}</TooltipContent>
    </Tooltip>
  );
};

export const JustUsername = (props: { sub: string }) => {
  const { data } = useUserQuery({
    variables: {
      id: props.sub,
    },
  });

  return data?.user.username;
};

export const UserAvatarUsername = (props: { sub: string }) => {
  const { data } = useUserQuery({
    variables: {
      id: props.sub,
    },
  });

  const resolve = useResolve();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <LokUser.DetailLink object={{ id: props.sub }}>
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage
              className="rounded-md"
              src={
                resolve(data?.user?.profile.avatar?.presignedUrl) as
                | string
                | undefined
              }
              alt={data?.user?.username}
            />
            <AvatarFallback>{data?.user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </LokUser.DetailLink>
      </TooltipTrigger>

      <TooltipContent>{data?.user.username}</TooltipContent>
    </Tooltip>
  );
};
