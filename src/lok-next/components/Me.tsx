import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMeQuery } from "../api/graphql";

export const Me = () => {
  const { data } = useMeQuery();

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

export const Username = () => {
  const { data } = useMeQuery();

  return <>{data?.me?.username}</>;
};
