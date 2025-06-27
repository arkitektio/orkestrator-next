import { Guard } from "@/lib/arkitekt/Arkitekt";
import { UserAvatar } from "../UserAvatar";

export const UserInfo = (props: { sub: string | undefined }) => {
  return (
    <Guard.Lok fallback="No userinfo available">
      {props.sub && <UserAvatar sub={props.sub} />}
    </Guard.Lok>
  );
};
