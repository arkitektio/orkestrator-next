import { withLokNext } from "@jhnnsrs/lok-next";
import { useClientQuery } from "../api/graphql";

export const AppAvatar = (props: { clientId: string }) => {
  const { data } = withLokNext(useClientQuery)({
    variables: {
      clientId: props.clientId,
    },
  });

  return (
    <div className="px-2 bg-slate-200 rounded rounded-md inline">
      {data?.client?.release.app.identifier}
    </div>
  );
};
