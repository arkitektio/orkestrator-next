import { useCreateRoomMutation } from "@/alpaka/api/graphql";
import { CommandGroup } from "cmdk";
import { MessageSquareMore } from "lucide-react";
import React from "react";

import { storeRoomTalkingAbout } from "../../../../alpaka/roomTalkingAbout";
import { CommandActionRow } from "../CommandActionRow";
import type { PassDownProps } from "../types";
import { useNavigate } from "react-router-dom";
import { AlpakaRoom } from "@/linkers";

const ACTION_TITLE = "Talk about structure";
const ACTION_DESCRIPTION = "Open an Alpaka room about the selected structure";

const buildRoomTitle = (props: PassDownProps) => {
  if (props.objects.length === 1) {
    return `Talk about ${props.objects[0].identifier}`;
  }

  return `Talk about ${props.objects.length} structures`;
};

const buildRoomDescription = (props: PassDownProps) => {
  if (props.objects.length === 1) {
    return `Conversation about ${props.objects[0].identifier} ${props.objects[0].object.id}`;
  }

  return `Conversation about ${props.objects.length} selected selected structures`;
};

export const TalkAboutButton = (props: PassDownProps) => {
  const [createRoom] = useCreateRoomMutation();
  const [isOpening, setIsOpening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const openRoom = React.useCallback(async () => {
    const talkingAbout = props.objects
      .filter((structure) => structure.object?.id)
      .map((structure) => ({
        identifier: structure.identifier,
        object: structure.object.id,
      }));

    if (talkingAbout.length === 0) {
      setError("No structure selected");
      props.onError?.("No structure selected");
      return;
    }

    setIsOpening(true);
    setError(null);

    try {
      const result = await createRoom({
        variables: {
          input: {
            title: buildRoomTitle(props),
            description: buildRoomDescription(props),
            talkingAbout,
          },
        },
      });

      const roomId = result.data?.createRoom.id;

      if (!roomId) {
        throw new Error("Failed to create room");
      }

      storeRoomTalkingAbout(roomId, talkingAbout);
      props.onDone?.({ kind: "local" });

      const promptText = props.filter?.trim() || `Please tell me more about this ${talkingAbout.length === 1 ? "structure" : "structures"}.`;
      navigate(
        `${AlpakaRoom.linkBuilder(roomId)}?prefillStructures=${encodeURIComponent(
          JSON.stringify(talkingAbout)
        )}&text=${encodeURIComponent(promptText)}`
      );
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : "Failed to create room";
      setError(message);
      props.onError?.(message);
    } finally {
      setIsOpening(false);
    }
  }, [createRoom, navigate, props]);

  return (
    <CommandActionRow
      onSelect={() => {
        void openRoom();
      }}
      value={props.filter ? `Talk about structure: ${props.filter}` : ACTION_TITLE}
      title={props.filter ? `Talk about structure: "${props.filter}"` : ACTION_TITLE}
      description={
        props.filter
          ? `Create a room, attach the selected structures and prefill with "${props.filter}"`
          : props.objects.length === 1
            ? ACTION_DESCRIPTION
            : `Open an Alpaka room about ${props.objects.length} selected structures`
      }
      icon={MessageSquareMore}
      disabled={isOpening}
      trailing={
        <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {isOpening ? <span>Opening…</span> : null}
          {error ? <span className="text-destructive">{error}</span> : null}
        </span>
      }
    />
  );
};

export const ApplicableTalk = (props: PassDownProps) => {
  if (props.objects.length === 0) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full inline-flex gap-2">
          <MessageSquareMore className="h-3.5 w-3.5" />
          <span>Alpaka</span>
        </span>
      }
    >
      <TalkAboutButton {...props} />
    </CommandGroup>
  );
};
