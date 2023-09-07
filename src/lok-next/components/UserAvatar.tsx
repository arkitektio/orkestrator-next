import { withLokNext } from "@jhnnsrs/lok-next";
import { useUserQuery } from "../api/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = (props: { sub: string }) => {
  const { data } = withLokNext(useUserQuery)({
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
