import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/components/timeline/timeline";
import { Badge } from "@/components/ui/badge";
import { MikroImage, MikroProtocol, MikroProtocolStep } from "@/linkers";
import {
  ProtocolStepFragment,
  useGetProtocolStepQuery,
  useUpdateProtocolStepMutation,
} from "../api/graphql";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { DndProvider } from "react-dnd-multi-backend";
import { CommentsProvider } from "@udecode/plate-comments";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plate, useEditorReadOnly, useEditorRef } from "@udecode/plate-common";
import { plugins } from "@/plate/plugins";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { Editor } from "@/components/plate-ui/editor";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { EmojiDropdownMenu } from "@/components/plate-ui/emoji-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListToolbarButton } from "@/components/plate-ui/list-toolbar-button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export type IRepresentationScreenProps = {};

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "Hello, World!" }],
  },
];

export const SafeButton = ({ step }: { step: ProtocolStepFragment }) => {
  const ref = useEditorRef();
  const [update] = useUpdateProtocolStepMutation();
  const readOnly = useEditorReadOnly();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Add ctrl s event listener to document

    const handleSave = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        onClick();
      }
    };

    document.addEventListener("keydown", handleSave);

    return () => {
      document.removeEventListener("keydown", handleSave);
    };
  }, []);

  const onClick = () => {
    console.log("serialized");
    console.log(ref);
    setSaving(true);

    update({
      variables: {
        id: step.id,
        plateChildren: ref?.children || [],
      },
    }).then(() => {
      setSaving(false);
    });
  };

  return (
    <>
      {!readOnly && (
        <Button
          onClick={onClick}
          disabled={saving}
          variant={"outline"}
          className="mr-2"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      )}
    </>
  );
};

export function PlateEditor({ step }: { step: ProtocolStepFragment }) {
  return (
    <TooltipProvider>
      <CommentsProvider users={{}} myUserId="1">
        <Plate plugins={plugins} initialValue={step.plateChildren || []}>
          <div className="flex-grow">
            <FixedToolbar>
              <FixedToolbarButtons />
              <SafeButton step={step} />
            </FixedToolbar>

            <Editor className="rounded-xs border-0 mt-0 ring-0 h-full w-full" />

            <FloatingToolbar>
              <FloatingToolbarButtons />
            </FloatingToolbar>
            <CommentsPopover />
          </div>
        </Plate>
      </CommentsProvider>
    </TooltipProvider>
  );
}

export default asDetailQueryRoute(useGetProtocolStepQuery, ({ data }) => {
  return (
    <MikroProtocolStep.ModelPage
      title={data?.protocolStep?.name}
      object={data.protocolStep.id}
      actions={<MikroProtocolStep.Actions object={data.protocolStep.id} />}
      sidebars={
        <MultiSidebar
          map={{
            Comments: (
              <MikroProtocolStep.Komments object={data.protocolStep.id} />
            ),
          }}
        />
      }
    >
      <div className="h-full w-full flex flex-col">
        <PlateEditor step={data.protocolStep} />
        <p className="text-muted-foreground text-sm mt-6">Linked Reagents</p>
        <div className="flex flex-row">
          {data.protocolStep?.reagents.map((reagent) => (
            <Card className="flex flex-row p-3">
              <div className="flex-1 mr-1">{reagent.name}</div>
              {reagent.metrics.map((m) => (
                <Badge className="bg-black text-white">
                  {m.metric.kind.label}:{m.value}
                </Badge>
              ))}
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground text-sm mt-1">Used in</p>
        <div className="flex flex-row gap-2 mt-1">
          {data?.protocolStep?.mappings.map((e) => (
            <Card className="flex flex-row p-3">
              <MikroProtocol.DetailLink object={e.protocol.id}>
                {e.protocol.name}
              </MikroProtocol.DetailLink>
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground text-sm mt-2">
          Latest Images inlcuding this step
        </p>
        <div className="flex flex-row gap-2">
          {data.protocolStep?.views?.map((view) => (
            <Card className="flex flex-row p-3">
              <MikroImage.DetailLink object={view.image.id} className="flex-1">
                {view.image.name}
              </MikroImage.DetailLink>
            </Card>
          ))}
        </div>
      </div>
    </MikroProtocolStep.ModelPage>
  );
});
