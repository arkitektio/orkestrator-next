import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormDialog, FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Editor } from "@/components/plate-ui/editor";
import { Button } from "@/components/ui/button";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import {
  KraphEntity,
  KraphProtocolEvent,
  KraphProtocolEventCategory,
  KraphReagent,
} from "@/linkers";
import { RoleValueProvider } from "@/plate/value/ValueProvider";
import { valueEditor } from "@/plate/valueEditor";
import { notEmpty } from "@/reaktion/utils";
import { HobbyKnifeIcon } from "@radix-ui/react-icons";
import { Plate, usePlateEditor } from "@udecode/plate-common/react";
import {
  ProtocolEventFragment,
  useGetProtocolEventQuery,
} from "../api/graphql";
import { SelectiveNodeViewRenderer } from "../components/renderers/NodeQueryRenderer";
import CreateNodeQueryForm from "../forms/CreateNodeQueryForm";
import { Card } from "@/components/ui/card";

export function PlateEditor({
  protocolEvent,
}: {
  protocolEvent: ProtocolEventFragment;
}) {
  const plateEditor = usePlateEditor({
    ...valueEditor,
    value: protocolEvent.category.plateChildren || [],
  });

  const leftRoleValues = protocolEvent.sourceParticipants
    .map((e) => {
      if (e.__typename === "Participant") {
        return {
          id: e.leftId,
          role: e.role,
          value: e.leftId,
        };
      }
    })
    .filter(notEmpty);

  const rightRoleValues = protocolEvent.targetParticipants
    .map((e) => {
      if (e.__typename === "Participant") {
        return {
          id: e.rightId,
          role: e.role,
          value: e.rightId,
        };
      }
    })
    .filter(notEmpty);

  const variableRoles = protocolEvent.variables
    .map((e) => {
      return {
        role: e.role,
        value: e.value,
      };
    })
    .filter(notEmpty);

  const roleValues = [...leftRoleValues, ...rightRoleValues, ...variableRoles];

  return (
    <RoleValueProvider values={roleValues}>
      <Plate editor={plateEditor}>
        <Editor />
      </Plate>
    </RoleValueProvider>
  );
}

export default asDetailQueryRoute(
  useGetProtocolEventQuery,
  ({ data, refetch }) => {
    const uploadFile = useMediaUpload();

    return (
      <KraphProtocolEvent.ModelPage
        object={data.protocolEvent.id}
        title={data?.protocolEvent.label}
        sidebars={
          <MultiSidebar
            map={{
              Comments: (
                <KraphProtocolEvent.Komments object={data.protocolEvent.id} />
              ),
            }}
          />
        }
        pageActions={
          <div className="flex flex-row gap-2">
            <>
              <FormSheet trigger={<HobbyKnifeIcon />}>
                Not implemented
              </FormSheet>
            </>
          </div>
        }
      >
        <KraphEntity.Drop
          object={data.protocolEvent.id}
          className="col-span-4 grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center p-6"
        >
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {data.protocolEvent.category.label}
            </h1>

            <p className="mt-3 text-xl text-muted-foreground"></p>
            <p className="mt-3 text-xl text-muted-foreground">
              <KraphProtocolEventCategory.DetailLink
                object={data.protocolEvent.category.id}
              >
                {data.protocolEvent.category.label}
              </KraphProtocolEventCategory.DetailLink>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <PlateEditor protocolEvent={data.protocolEvent} />
          </div>
        </KraphEntity.Drop>

        <div className="flex flex-col p-6 h-full">
          {data.protocolEvent.variables.length > 0 && (
            <div className="mt-2">
              <h2 className="text-2xl font-bold mb-2">Variables</h2>
              <div className="flex flex-wrap gap-2">
                {data.protocolEvent.variables.map((variable) => (
                  <div
                    key={variable.role + variable.value}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    <span className="font-semibold">{variable.role}:</span>{" "}
                    {variable.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.protocolEvent.sourceParticipants.length > 0 && (
            <div className="mt-2">
              <h2 className="text-2xl font-bold mb-2">Subjected</h2>
              <div className="flex flex-row flex-wrap gap-2">
                {data.protocolEvent.sourceParticipants.map((variable) => (
                  <Card
                    key={variable.id}
                    className="p-2 m-2 flex-row gap-2 flex"
                  >
                    {variable.role}
                    {variable.left.__typename == "Entity" && (
                      <KraphEntity.DetailLink
                        key={variable.id}
                        object={variable.leftId}
                        className="px-3 py-1 rounded-full text-sm"
                      >
                        {variable.left.label}
                      </KraphEntity.DetailLink>
                    )}
                    {variable.left.__typename == "Reagent" && (
                      <KraphReagent.DetailLink
                        key={variable.id}
                        object={variable.leftId}
                        className="px-3 py-1 rounded-full text-sm"
                      >
                        {variable.left.label}
                      </KraphReagent.DetailLink>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
          {data.protocolEvent.targetParticipants.length > 0 && (
            <div className="mt-2">
              <h2 className="text-2xl font-bold mb-2">Subjected</h2>
              <div className="flex flex-row flex-wrap gap-2">
                {data.protocolEvent.targetParticipants.map((variable) => (
                  <Card
                    key={variable.id}
                    className="p-2 m-2 flex-row gap-2 flex"
                  >
                    {variable.role}
                    {variable.right.__typename == "Entity" && (
                      <KraphEntity.DetailLink
                        key={variable.id}
                        object={variable.rightId}
                        className="px-3 py-1 rounded-full text-sm"
                      >
                        {variable.right.label}
                      </KraphEntity.DetailLink>
                    )}
                    {variable.right.__typename == "Reagent" && (
                      <KraphEntity.DetailLink
                        key={variable.id}
                        object={variable.rightId}
                        className="px-3 py-1 rounded-full text-sm"
                      >
                        {variable.right.label}
                      </KraphEntity.DetailLink>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-grow flex h-full w-full">
          {data.protocolEvent.bestView ? (
            <SelectiveNodeViewRenderer view={data.protocolEvent.bestView} />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-start">
              <p className="text-sm font-light mb-3">
                No Node Query yet for this event
              </p>
              <FormDialog
                trigger={<Button variant="outline">Create Query</Button>}
                onSubmit={() => refetch()}
              >
                <CreateNodeQueryForm entity={data.protocolEvent} />
              </FormDialog>
            </div>
          )}
        </div>
      </KraphProtocolEvent.ModelPage>
    );
  },
);
