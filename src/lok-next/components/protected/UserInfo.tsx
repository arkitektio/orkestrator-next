import { LokNextGuard } from "@jhnnsrs/lok-next";
import { UserAvatar } from "../UserAvatar";

export const UserInfo = (props: { sub: string | undefined }) => {
  return (
    <LokNextGuard fallback="No userinfo available">
      {props.sub && <UserAvatar sub={props.sub} />}
    </LokNextGuard>
  );
};
