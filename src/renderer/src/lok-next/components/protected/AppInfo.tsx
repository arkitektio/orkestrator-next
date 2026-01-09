import { Guard } from "@/lib/arkitekt/Arkitekt";
import { AppAvatar } from "../AppAvatar";

export const AppInfo = (props: { clientId: string | undefined }) => {
  return (
    <Guard.Lok fallback="No userinfo available">
      {props.clientId && <AppAvatar clientId={props.clientId} />}
    </Guard.Lok>
  );
};
