import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { LokUser } from "@/linkers";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useUserQuery } from "../api/graphql";

export const UserAvatar = (props: { sub: string }) => {
  const { data } = useUserQuery({
    variables: {
      id: props.sub,
    },
  });

  const resolve = useResolve();

  return (
    <Avatar>
      <AvatarImage
        src={
          resolve(data?.user?.profile.avatar?.presignedUrl) as
            | string
            | undefined
        }
        alt={data?.user?.username}
      />
      <AvatarFallback>{data?.user.username.slice(0, 2)}</AvatarFallback>
    </Avatar>
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
        <LokUser.DetailLink object={props.sub}>
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
        <LokUser.DetailLink object={props.sub}>
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
