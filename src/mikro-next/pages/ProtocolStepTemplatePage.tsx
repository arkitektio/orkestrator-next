import { Plate } from "@udecode/plate-common/react";

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
import { MikroProtocolStepTemplate } from "@/linkers";
import { editor } from "@/plate/plugins";
import {
  useEditorReadOnly,
  useEditorRef,
  usePlateEditor,
} from "@udecode/plate-common/react";
import { useState } from "react";
import {
  ProtocolStepTemplateFragment,
  useGetProtocolStepTemplateQuery,
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
  const plateEditor = usePlateEditor({
    ...editor,
    value: step.plateChildren,
  });

  return (
    <Plate editor={plateEditor}>
      <FixedToolbar>
        <FixedToolbarButtons />
        <SafeButton step={step} />
      </FixedToolbar>

      <Editor />

      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
      <CommentsPopover />
    </Plate>
  );
}

export function PlateDisplay({ step }: { step: { plateChildren: any[] } }) {
  const plateEditor = usePlateEditor({
    ...editor,
    value: step.plateChildren,
  });
  return (
    <TooltipProvider>
      <Plate editor={plateEditor}>
        <Editor
          className="rounded-xs border-0 mt-0 ring-0 h-full w-full"
          disabled={true}
        />

        <CommentsPopover />
      </Plate>
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
