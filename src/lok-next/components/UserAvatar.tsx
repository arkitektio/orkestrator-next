import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { LokUser } from "@/linkers";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useUserQuery } from "../api/graphql";

export const UserAvatar = (props: { sub: string }) => {
  const { data } = useUserQuery({
    variables: {
      id: props.sub,
    },
  });

  return (
    <Avatar>
      <AvatarImage
        src={data?.user?.avatar as string | undefined}
        alt={data?.user?.username}
      />
      <AvatarFallback>{data?.user.username.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export const UserAvatarUsername = (props: { sub: string }) => {
  const { data } = useUserQuery({
    variables: {
      id: props.sub,
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <LokUser.DetailLink object={props.sub}>
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage
              className="rounded-md"
              src={data?.user?.avatar as string | undefined}
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
