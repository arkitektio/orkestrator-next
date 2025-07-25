import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMeQuery, useMyContextQuery } from "../api/graphql";
import { useResolve } from "@/datalayer/hooks/useResolve";

export const Me = () => {
  const { data } = useMeQuery();
  const resolve = useResolve();

  return (
    <Avatar className="border border-3 border-seperator border-white mx-auto">
      <AvatarImage
        src={resolve(data?.me?.profile.avatar?.presignedUrl)}
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
  const { data } = useMyContextQuery();

  return (
    <>
      {data?.mycontext.user?.username} @ {data?.mycontext.organization.slug}
    </>
  );
};
