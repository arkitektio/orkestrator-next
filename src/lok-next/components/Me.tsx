import { withLokNext } from "@jhnnsrs/lok-next";
import { useMeQuery, useUserQuery } from "../api/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Me = () => {
  const { data } = withLokNext(useMeQuery)();

  return (
    <Avatar className="border border-1 border-seperator">
      <AvatarImage
        src={data?.me?.avatar as string | undefined}
        alt={data?.me?.username}
        className="border border-1 border-seperator"
      />
      <AvatarFallback className="border border-1 border-seperator">
        {data?.me.username.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};
