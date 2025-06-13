import { useLivekit } from "@/arkitekt/Arkitekt";
import {
  EnsuredStreamFragment,
  SoloBroadcastFragment,
  useCreateVideoStreamMutation,
  useGetSoloBroadcastQuery,
  useGetStreamQuery,
  useJoinBroadcastMutation,
} from "@/lovekit/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import {
  GridLayout,
  LiveKitRoom,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Value } from "@udecode/plate-common";
import { Track } from "livekit-client";
import { t } from "node_modules/@udecode/plate-list/dist/BaseListPlugin-B0eGlA5x";
import { useEffect, useRef, useState } from "react";

function VideoRenderer() {
  const trackRefs = useTracks([Track.Source.Camera]);

  const streamer = trackRefs.filter((t) =>
    t.participant.identity.startsWith("streamer"),
  );

  return (
    <GridLayout tracks={streamer}>
      <VideoTrack trackRef={streamer.at(0)} />
    </GridLayout>
  );
}

export const VideoStream = ({ token }: { token: string }) => {
  const { url } = useLivekit();

  console.log("Stream", token, url);

  return (
    <LiveKitRoom token={token} serverUrl={url} connect={true}>
      <VideoRenderer />
    </LiveKitRoom>
  );
};

export const StreamJoiner = (props: { broadcast: SoloBroadcastFragment }) => {
  const [token, setToken] = useState<string | null>(null);
  const tokenFutureRan = useRef<boolean>(false);

  const [x] = useJoinBroadcastMutation();

  useEffect(() => {
    if (!tokenFutureRan.current) {
      tokenFutureRan.current = true;
      x({
        variables: {
          input: { broadcast: props.broadcast.id },
        },
      }).then((result) => {
        if (result.data?.joinBroadcast) {
          setToken(result.data.joinBroadcast);
        }
      });
    }
  }, [props.broadcast.id, x]);

  return (
    <div className="w-full h-full flex-grow relative flex items-center justify-center">
      {token && <VideoStream token={token} />}
    </div>
  );
};

export const AsyncSoloBroadcastWidget = (props: { id: string }) => {
  const { data, error } = useGetSoloBroadcastQuery({
    variables: {
      id: props.id,
    },
  });

  const broadcast = data?.soloBroadcast?.id;

  return (
    <div className="w-full h-full bg-black relative">
      {broadcast && <StreamJoiner broadcast={data.soloBroadcast} />}
      {!broadcast && (
        <div className="flex items-center justify-center h-full">
          <span className="text-white">Loading broadcast...</span>
        </div>
      )}
      {error && (
        <div className="text-red-500">
          Error loading stream: {error.message}
        </div>
      )}
    </div>
  );
};
