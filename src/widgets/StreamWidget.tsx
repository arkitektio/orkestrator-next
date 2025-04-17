import { useLivekit } from "@/arkitekt/Arkitekt";
import {
  EnsuredStreamFragment,
  useCreateStreamMutation,
  useGetStreamQuery,
} from "@/lok-next/api/graphql";
import {
  GridLayout,
  LiveKitRoom,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect } from "react";

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
  const [createStream, stream] = useCreateStreamMutation();

  useEffect(() => {
    console.log("Creating stream");
    if (!stream || !stream.data?.createStream.agent.room != props.room) {
      createStream({
        variables: {
          input: {
            title: "My Stream",
            room: props.room,
            agentId: "default",
          },
        },
      });
    }
  }, [props.room]);

  return (
    <>
      {stream.loading && <div>Loading</div>}
      {stream.data?.createStream && (
        <VideoStream stream={stream.data.createStream} />
      )}
    </>
  );
};

export const StreamWidget = (props: { value: string }) => {
  const { data } = useGetStreamQuery({
    variables: {
      id: props.value,
    },
  });

  const room = data?.stream?.agent?.room.id;

  return (
    <div className="w-full h-full m-2">{room && <StreamJoiner room={room} />}</div>
  );
};
