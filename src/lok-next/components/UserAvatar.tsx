import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
