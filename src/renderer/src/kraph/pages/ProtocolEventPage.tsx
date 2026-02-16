import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { FormSheet } from "@/components/dialog/FormDialog";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Editor } from "@/components/plate-ui/editor";
import { useMediaUpload } from "@/datalayer/hooks/useUpload";
import {
  KraphEntity,
  KraphProtocolEvent,
  KraphProtocolEventCategory
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

const Page = asDetailQueryRoute(
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
      </KraphProtocolEvent.ModelPage>
    );
  },
);


export default Page;
