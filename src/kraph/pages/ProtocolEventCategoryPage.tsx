import { Plate } from "@udecode/plate-common/react";

import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ChoicesField } from "@/components/fields/ChoicesField";
import { GraphQLListSearchField } from "@/components/fields/GraphQLListSearchField";
import { StringField } from "@/components/fields/StringField";
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
import { Form } from "@/components/ui/form";
import { DragZone } from "@/components/upload/drag";
import { useKraphUpload } from "@/datalayer/hooks/useKraphUpload";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  KraphProtocolEventCategory,
  KraphProtocolStepTemplate
} from "@/linkers";
import { editor } from "@/plate/plugins";
import {
  useEditorReadOnly,
  useEditorRef,
  usePlateEditor,
} from "@udecode/plate-common/react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  MetricKind,
  NaturalEventCategoryFragment,
  ProtocolEventCategoryFragment,
  UpdateProtocolEventCategoryMutationVariables,
  useGetProtocolEventCategoryQuery,
  useSearchEntityCategoryLazyQuery,
  useSearchTagsLazyQuery,
  useUpdateProtocolEventCategoryMutation
} from "../api/graphql";
import { RoleProvider } from "../providers/RoleProvider";
import { FormDialog } from "@/components/dialog/FormDialog";
import CreateGraphQueryForm from "../forms/CreateGraphQueryForm";
import { SelectiveGraphQueryRenderer } from "../components/renderers/GraphQueryRenderer";



export default asDetailQueryRoute(
  useGetProtocolEventCategoryQuery,
  ({ data, refetch }) => {
    const uploadFile = useKraphUpload();
    const [update] = useUpdateProtocolEventCategoryMutation();

    const resolve = useResolve();

    const createFile = async (file: File) => {
      const response = await uploadFile(file);
      if (response) {
        await update({
          variables: {
            input: {
              id: data.protocolEventCategory.id,
              image: response,
            },
          },
        });
        await refetch();
      }
    };

    return (
      <KraphProtocolEventCategory.ModelPage
        title={data?.protocolEventCategory?.label}
        object={data.protocolEventCategory.id}
        actions={
          <KraphProtocolEventCategory.Actions
            object={data.protocolEventCategory.id}
          />
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphProtocolStepTemplate.Komments
                  object={data.protocolEventCategory.id}
                />
              ),
            }}
          />
        }
      >
        <div className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.protocolEventCategory.label}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {data.protocolEventCategory.description}
            </p>
          </div>
          <div className="w-full h-full flex-row relative">
            {data.protocolEventCategory?.store?.presignedUrl && (
              <img
                src={resolve(data.protocolEventCategory?.store.presignedUrl)}
                style={{ filter: "brightness(0.7)" }}
                className="object-cover h-full w-full absolute top-0 left-0 rounded rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {data.protocolEventCategory.sourceEntityRoles.map((role) => (
            <div key={role.role}> Source Role: {role.role}</div>
          ))}
        </div>
        <div className="flex flex-col">
          {data.protocolEventCategory.targetEntityRoles.map((role) => (
            <div key={role.role}> Target Role: {role.role}</div>
          ))}
        </div>

        <DragZone uploadFile={uploadFile} createFile={createFile} />

        <div className="flex flex-col p-6 h-full">
          {data.protocolEventCategory.bestQuery ? (
            <SelectiveGraphQueryRenderer
              graphQuery={data.protocolEventCategory.bestQuery}
            />
          ) : (
            <div className="h-ful w-ull flex flex-col items-center justify-center">
              <p className="text-sm font-light mb-3">
                No Graph Query yet for this category
              </p>
              <FormDialog
                trigger={<Button variant="outline">Create Query</Button>}
                onSubmit={() => refetch()}
              >
                <CreateGraphQueryForm category={data.protocolEventCategory} />
              </FormDialog>
            </div>
          )}
        </div>



      </KraphProtocolEventCategory.ModelPage>
    );
  },
);
