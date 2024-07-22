import {
  DetailRoomFragment,
  EnsuredStreamFragment,
  StreamFragment,
  useCreateStreamMutation,
} from "@/lok-next/api/graphql";
import { Button } from "../ui/button";
import RoomPage from "@/lok-next/pages/RoomPage";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { LiveKitRoom, ParticipantTile } from "@livekit/components-react";
import { useLivekit } from "@/arkitekt";

import { Track } from "livekit-client";
import { useTracks, VideoTrack } from "@livekit/components-react";
import { GridLayout } from "@livekit/components-react";

function VideoRenderer() {
  const trackRefs = useTracks([Track.Source.Camera]);

  return (
    <GridLayout tracks={trackRefs}>
      <ParticipantTile />
    </GridLayout>
  );
}

export const VideoStream = ({ stream }: { stream: EnsuredStreamFragment }) => {
  const { url } = useLivekit();

  console.log("Stream", stream, url);

  return (
    <LiveKitRoom
      token={stream.token}
      serverUrl={"https://localhost:7880"}
      connect={true}
    >
      <VideoRenderer />
    </LiveKitRoom>
  );
};

export const StreamButton = (props: { room: DetailRoomFragment }) => {
  const [createStream, stream] = useCreateStreamMutation();

  const handleCreateStream = async () => {
    try {
      console.log("Creating stream");
      const response = await createStream({
        variables: {
          input: {
            title: "My Stream",
            room: props.room.id,
            agentId: "default",
          },
        },
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Stream</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Button onClick={handleCreateStream}>Create Stream</Button>
          {stream.data?.createStream && (
            <VideoStream stream={stream.data.createStream} />
          )}
          {stream.data?.createStream && <> Is there</>}
        </PopoverContent>
      </Popover>
    </>
  );
};
