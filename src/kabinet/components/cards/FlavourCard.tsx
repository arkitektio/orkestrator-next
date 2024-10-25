import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { KabinetFlavour, KabinetRelease } from "@/linkers";
import {
  ListTemplateFragment,
  useAssignMutation,
  usePrimaryNodesQuery,
  useTemplatesQuery,
} from "@/rekuest/api/graphql";
import { useAssignProgress } from "@/rekuest/hooks/useAssignProgress";
import { useInstancId } from "@/rekuest/hooks/useInstanceId";
import { MateFinder } from "../../../mates/types";
import { ListFlavourFragment, ListReleaseFragment } from "../../api/graphql";
import { useTemplateAction } from "@/rekuest/hooks/useTemplateAction";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KABINET_INSTALL_POD_HASH } from "@/constants";

interface Props {
  item: ListFlavourFragment;
  mates?: MateFinder[];
}

export const AssignButton = (props: {
  template: ListTemplateFragment;
  release: string;
}) => {
  const { assign, latestAssignation } = useTemplateAction({
    id: props.template.id,
  });

  const doassign = async () => {
    console.log(
      await assign({
        args: {
          release: props.release,
        },
      }),
    );
  };

  return (
    <DropdownMenuItem onSelect={doassign}>
      Install on {props.template.agent.name}
    </DropdownMenuItem>
  );
};

const InstallDialog = (props: { item: { id: string } }) => {
  const { data } = useTemplatesQuery({
    variables: {
      filters: {
        nodeHash: KABINET_INSTALL_POD_HASH,
      },
    },
  });

  return (
    <div className="flex flex-row gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Install
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          {data?.templates.map((t) => (
            <AssignButton template={t} release={props.item.id} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const TheCard = ({ item, mates }: Props) => {
  const { progress } = useLiveAssignation({
    identifier: "@kabinet/flavour",
    object: item.id,
  });

  return (
    <KabinetFlavour.Smart object={item?.id} mates={mates}>
      <Card
        className="group transition-all duration-300 ease-in-out"
        style={{
          backgroundSize: `${progress || 0}% 100%`,
          backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <KabinetFlavour.DetailLink object={item?.id}>
                {" "}
                {item.release.app.identifier}:{item.release.version}-{item.name}
              </KabinetFlavour.DetailLink>
            </CardTitle>
          </div>
          <CardTitle>
            <InstallDialog item={item.release} />
          </CardTitle>
        </CardHeader>
      </Card>
    </KabinetFlavour.Smart>
  );
};

export default TheCard;
