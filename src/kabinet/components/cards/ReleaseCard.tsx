import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KabinetRelease } from "@/linkers";
import {
  AssignationEventKind,
  useAssignMutation,
  usePrimaryNodesQuery
} from "@/rekuest/api/graphql";
import { useAssignations } from "@/rekuest/hooks/useAssignations";
import { useInstancId } from "@/rekuest/hooks/useInstanceId";
import { NodeDescription } from "@jhnnsrs/rekuest";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { MateFinder } from "../../../mates/types";
import { ListReleaseFragment, PortKind } from "../../api/graphql";

interface Props {
  item: ListReleaseFragment;
  mates?: MateFinder[];
}

export const useAssignProgress = (options: {
  identifier: string;
  object: string;
  node?: string;
}) => {
  const { data } = useAssignations();

  const assignations = data?.assignations.filter((a) => {
    if (a.status == AssignationEventKind.Done) {
      return false;
    }
    if (options.node) {
      if (a.node?.id != options.node) {
        return false;
      }
    }
    let matches = false;
    for (const port of a.node.args) {
      if (
        port.kind == PortKind.Structure &&
        port.identifier == options.identifier
      ) {
        if (a.args[port.key] == options.object) {
          matches = true;
          break;
        }
      }
    }

    return matches;
  });

  const latestProgress = assignations
    ?.at(0)
    ?.events.filter(
      (e) =>
        e.kind == AssignationEventKind.Progress ||
        e.kind == AssignationEventKind.Done,
    )
    .at(-1);

  return latestProgress;
};

export const AssignButton = (props: { id: string; release: string }) => {
  const [postAssign, _] = withRekuest(useAssignMutation)();

  const instanceId = useInstancId();

  const assign = async () => {
    console.log(
      await postAssign({
        variables: {
          input: {
            template: props.id,
            args: {
              release: props.release,
            },
            instanceId: instanceId,
          },
        },
      }),
    );
  };

  return (
    <Button onClick={assign} variant={"outline"} size="sm">
      Install
    </Button>
  );
};

const InstallDialog = (props: { item: ListReleaseFragment }) => {
  const { data } = withRekuest(usePrimaryNodesQuery)({
    variables: {
      identifier: "@kabinet/release",
    },
  });

  return (
    <>
      {data?.nodes
        .at(0)
        ?.templates.map((t) => (
          <AssignButton id={t.id} release={props.item.id} />
        ))}
    </>
  );
};

const TheCard = ({ item, mates }: Props) => {
  const progress = useAssignProgress({
    identifier: "@kabinet/release",
    object: item.id,
  });

  return (
    <KabinetRelease.Smart object={item?.id} mates={mates}>
      <Card
        className="group transition-all duration-300 ease-in-out"
        style={{
          backgroundSize: `${progress?.progress || 0}% 100%`,
          backgroundImage: `linear-gradient(to right, #10b981 ${progress?.progress}%, #10b981 ${progress?.progress}%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <KabinetRelease.DetailLink object={item?.id}>
                {" "}
                {item.app?.identifier}:{item.version}
              </KabinetRelease.DetailLink>
            </CardTitle>
            <CardDescription>
              {item?.description && (
                <NodeDescription description={item?.description} />
              )}
              {progress?.progress && <>{progress.progress}</>}
            </CardDescription>
          </div>
          <CardTitle>
            <InstallDialog item={item} />
          </CardTitle>
        </CardHeader>
      </Card>
    </KabinetRelease.Smart>
  );
};

export default TheCard;
