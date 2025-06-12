import { useLivekit } from "@/arkitekt/Arkitekt";
import {
  EnsuredStreamFragment,
  useCreateVideoStreamMutation,
  useGetStreamQuery,
} from "@/lovekit/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import {
  GridLayout,
  LiveKitRoom,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";

function VideoRenderer() {
  const trackRefs = useTracks([Track.Source.Camera]);

  const notMine = trackRefs.filter(
    (t) => !t.participant.identity.startsWith("default"),
  );

  console.log("Tracks", trackRefs, notMine);

  return (
    <GridLayout tracks={notMine}>
      <VideoTrack trackRef={trackRefs.at(0)} />
    </GridLayout>
  );
}

export const VideoStream = ({ stream }: { stream: EnsuredStreamFragment }) => {
  const { url } = useLivekit();

  console.log("Stream", stream, url);

  return (
    <LiveKitRoom token={stream.token} serverUrl={url} connect={true}>
      <VideoRenderer />
    </LiveKitRoom>
  );
};

export const StreamJoiner = (props: { room: string }) => {
  const [createStream, stream] = useCreateVideoStreamMutation();

  return <>Not implemented Right now</>;
};

export const StreamWidget = (props: ReturnWidgetProps) => {
  const { data } = useGetStreamQuery({
    variables: {
      id: props.value,
    },
  });

  const room = data?.stream?.id;

  return (
    <div className="w-full h-full m-2">
      {room && <StreamJoiner room={room} />}
    </div>
  );
};
