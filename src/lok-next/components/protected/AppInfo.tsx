import { LokNextGuard, withLokNext } from "@jhnnsrs/lok-next";
import { useUserQuery } from "../../api/graphql";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { UserAvatar } from "../UserAvatar";
import { AppAvatar } from "../AppAvatar";

export const AppInfo = (props: { clientId: string | undefined }) => {
  return (
    <LokNextGuard fallback="No userinfo available">
      {props.clientId && <AppAvatar clientId={props.clientId} />}
    </LokNextGuard>
  );
};
