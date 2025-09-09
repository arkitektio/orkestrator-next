import { Guard } from "@/lib/arkitekt/Arkitekt";
import { LokUser } from "@/linkers";
import { UserAvatar } from "../UserAvatar";

export const UserInfo = (props: { sub: string | undefined }) => {
  return (
    <Guard.Lok fallback="No userinfo available">
      {props.sub && <LokUser.DetailLink object={props.sub}><UserAvatar sub={props.sub} /></LokUser.DetailLink>}
    </Guard.Lok>
  );
};
