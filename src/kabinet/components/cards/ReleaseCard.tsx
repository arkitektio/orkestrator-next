import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { KabinetRelease } from "@/linkers";
import { useAssignMutation, usePrimaryNodesQuery } from "@/rekuest/api/graphql";
import { useAssignProgress } from "@/rekuest/hooks/useAssignProgress";
import { useInstancId } from "@/rekuest/hooks/useInstanceId";
import { MateFinder } from "../../../mates/types";
import { ListReleaseFragment } from "../../api/graphql";

interface Props {
  item: ListReleaseFragment;
  mates?: MateFinder[];
}

export const AssignButton = (props: { id: string; release: string }) => {
  const [postAssign, _] = useAssignMutation();

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
  const { data } = usePrimaryNodesQuery({
    variables: {
      identifier: "@kabinet/release",
    },
  });

  return (
    <div className="flex flex-row gap-2">
      {data?.nodes
        .at(0)
        ?.templates.map((t) => (
          <AssignButton id={t.id} release={props.item.id} />
        ))}
    </div>
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
