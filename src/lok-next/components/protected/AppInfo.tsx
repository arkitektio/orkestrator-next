import { LokNextGuard } from "@jhnnsrs/lok-next";
import { AppAvatar } from "../AppAvatar";

export const AppInfo = (props: { clientId: string | undefined }) => {
  return (
    <LokNextGuard fallback="No userinfo available">
      {props.clientId && <AppAvatar clientId={props.clientId} />}
    </LokNextGuard>
  );
};
