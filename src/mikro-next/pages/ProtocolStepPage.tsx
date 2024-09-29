import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MikroProtocolStep } from "@/linkers";
import { plugins } from "@/plate/plugins";
import { CommentsProvider } from "@udecode/plate-comments";
import { Plate, useEditorReadOnly, useEditorRef } from "@udecode/plate-common";
import { useEffect, useState } from "react";
import {
  ProtocolStepFragment,
  useGetProtocolStepQuery,
  useUpdateProtocolStepMutation,
} from "../api/graphql";

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
        <p className="text-muted-foreground text-sm mt-6">Used Reagent</p>
        <div className="flex flex-row">
          <Card className="flex flex-row p-3">
            <div className="flex-1 mr-1">
              {data?.protocolStep?.usedReagent?.id}
            </div>
          </Card>
        </div>

        <p className="text-muted-foreground text-sm mt-2">
          Latest Images inlcuding this step
        </p>
        <div className="flex flex-row gap-2">
          {data?.protocolStep.description}
        </div>
      </div>
    </MikroProtocolStep.ModelPage>
  );
});
