import { Guard } from "@/app/Arkitekt";
import { CommandMenu } from "@/command/Menu";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { RunsSidebar } from "@/rekuest/sidebars/RunsSidebar";
import { Identifier, Object } from "@/types";
import { lazy, Suspense, useMemo, useState } from "react";
import { MultiSidebar } from "./MultiSidebar";
import { PageLayout, PageVariant } from "./PageLayout";
import { useNavigate } from "react-router-dom";
import { useCreateRoomMutation } from "@/alpaka/api/graphql";
import { storeRoomTalkingAbout } from "@/alpaka/roomTalkingAbout";
import { AlpakaRoom } from "@/linkers";
import { MessageSquareMore } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const LazyKomments = lazy(() =>
  import("@/lok-next/components/komments/Komments").then((module) => ({
    default: module.Komments,
  })),
);

const LazyKnowledgeSidebar = lazy(() =>
  import("@/kraph/components/sidebars/KnowledgeSidebar").then((module) => ({
    default: module.KnowledgeSidebar,
  })),
);

const LazyStructureRoomsSidebar = lazy(() =>
  import("@/alpaka/sidebars/StructureRoomsSidebar").then((module) => ({
    default: module.StructureRoomsSidebar,
  })),
);

export type ModelPageLayoutProps = {
  children: React.ReactNode;
  identifier: Identifier;
  object: Object;
  title?: React.ReactNode;
  sidebars?: React.ReactNode;
  additionalSidebars?: { [key: string]: React.ReactNode };
  actions?: React.ReactNode;
  pageActions?: React.ReactNode;
  variant?: PageVariant;
  callback?: (object: Object) => void;
};

export const ModelPageLayout = ({
  sidebars,
  additionalSidebars,
  title,
  children,
  identifier,
  object,
  variant,
  actions,
  pageActions,
}: ModelPageLayoutProps) => {
  const objects = useMemo(() => [{ identifier, object }], [identifier, object]);
  const kommentsSidebar = (
    <Suspense fallback={null}>
      <LazyKomments identifier={identifier} object={object} />
    </Suspense>
  );
  const knowledgeSidebar = (
    <Suspense fallback={null}>
      <LazyKnowledgeSidebar identifier={identifier} object={object} />
    </Suspense>
  );
  const alpakaRoomsSidebar = (
    <Suspense fallback={null}>
      <LazyStructureRoomsSidebar identifier={identifier} object={object} />
    </Suspense>
  );

  return (
    <PageLayout
      title={title}
      sidebars={sidebars ? <>{sidebars}</> : <MultiSidebar map={{
        "Comments": kommentsSidebar,
        "Knowledge": <Guard.Kraph>{knowledgeSidebar}</Guard.Kraph>,
        "Rooms": <Guard.Alpaka>{alpakaRoomsSidebar}</Guard.Alpaka>,
        "Tasks": <RunsSidebar identifier={identifier} object={object} />,
        ...additionalSidebars,
      }} sidebarKey="DetailModel" />}
      variant={variant}
      actions={actions}
      pageActions={
        <div className="flex flex-row gap-1.5 items-center">
          <Guard.Alpaka><TalkAboutPageButton identifier={identifier} object={object} /></Guard.Alpaka>
          {pageActions || <ObjectButton objects={objects} />}
        </div>
      }
    >
      <CommandMenu objects={objects} />
      {children}
    </PageLayout>
  );
};

export const TalkAboutPageButton = ({
  identifier,
  object,
}: {
  identifier: string;
  object: { id: string };
}) => {
  const [createRoom, { loading }] = useCreateRoomMutation();
  const navigate = useNavigate();

  const handleTalk = async () => {
    if (!object?.id) return;

    const talkingAbout = [{
      identifier,
      object: object.id,
    }];

    try {
      const title = `Talk about ${identifier.split(".").pop() || identifier}`;
      const description = `Conversation about ${identifier} ${object.id}`;

      const result = await createRoom({
        variables: {
          input: {
            title,
            description,
            talkingAbout,
          },
        },
      });

      const roomId = result.data?.createRoom.id;
      if (!roomId) {
        throw new Error("Failed to create room");
      }

      storeRoomTalkingAbout(roomId, talkingAbout);

      navigate(
        `${AlpakaRoom.linkBuilder(roomId)}?prefillStructures=${encodeURIComponent(
          JSON.stringify(talkingAbout)
        )}`
      );
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to start conversation: ${err.message || err}`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1.5 h-9 rounded-xl border bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground"
      onClick={handleTalk}
      disabled={loading}
    >
      <MessageSquareMore className="h-4 w-4" />
      <span>Talk</span>
    </Button>
  );
};
