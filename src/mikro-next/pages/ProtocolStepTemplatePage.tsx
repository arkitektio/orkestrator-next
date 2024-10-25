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
import { MikroProtocolStep, MikroProtocolStepTemplate } from "@/linkers";
import { plugins } from "@/plate/plugins";
import { CommentsProvider } from "@udecode/plate-comments";
import { Plate, useEditorReadOnly, useEditorRef } from "@udecode/plate-common";
import { useEffect, useState } from "react";
import {
  ProtocolStepFragment,
  ProtocolStepTemplateFragment,
  useGetProtocolStepQuery,
  useGetProtocolStepTemplateQuery,
  useUpdateProtocolStepMutation,
  useUpdateProtocolStepTemplateMutation,
} from "../api/graphql";

export type IRepresentationScreenProps = {};

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "Hello, World!" }],
  },
];

export const SafeButton = ({
  step,
}: {
  step: ProtocolStepTemplateFragment;
}) => {
  const ref = useEditorRef();
  const [update] = useUpdateProtocolStepTemplateMutation();
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
        input: { id: step.id, plateChildren: ref?.children || [] },
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

export function PlateEditor({ step }: { step: ProtocolStepTemplateFragment }) {
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

export function PlateDisplay({ step }: { step: { plateChildren: any[] } }) {
  return (
    <TooltipProvider>
      <CommentsProvider users={{}} myUserId="1">
        <Plate plugins={plugins} initialValue={step.plateChildren || []}>
          <Editor
            className="rounded-xs border-0 mt-0 ring-0 h-full w-full"
            disabled={true}
          />

          <CommentsPopover />
        </Plate>
      </CommentsProvider>
    </TooltipProvider>
  );
}

export default asDetailQueryRoute(
  useGetProtocolStepTemplateQuery,
  ({ data }) => {
    return (
      <MikroProtocolStepTemplate.ModelPage
        title={data?.protocolStepTemplate?.name}
        object={data.protocolStepTemplate.id}
        actions={
          <MikroProtocolStepTemplate.Actions
            object={data.protocolStepTemplate.id}
          />
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <MikroProtocolStepTemplate.Komments
                  object={data.protocolStepTemplate.id}
                />
              ),
            }}
          />
        }
      >
        <div className="h-full w-full flex flex-col">
          <PlateEditor step={data.protocolStepTemplate} />
        </div>
      </MikroProtocolStepTemplate.ModelPage>
    );
  },
);
