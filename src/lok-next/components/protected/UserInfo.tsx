import { LokNextGuard, withLokNext } from "@jhnnsrs/lok-next";
import { useUserQuery } from "../../api/graphql";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { UserAvatar } from "../UserAvatar";

export const UserInfo = (props: { sub: string | undefined }) => {
  return (
    <LokNextGuard fallback="No userinfo available">
      {props.sub && <UserAvatar sub={props.sub} />}
    </LokNextGuard>
  );
};
