import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KABINET_INSTALL_POD_HASH } from "@/constants";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { KabinetRelease } from "@/linkers";
import {
  DemandKind,
  ListTemplateFragment,
  PortKind,
  useTemplatesQuery,
} from "@/rekuest/api/graphql";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { useTemplateAction } from "@/rekuest/hooks/useTemplateAction";
import { MateFinder } from "../../../mates/types";
import { ListReleaseFragment } from "../../api/graphql";

interface Props {
  item: ListReleaseFragment;
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
    <DropdownMenuItem onSelect={doassign} className="cursor-pointer">
      Install on {props.template.agent.name}
    </DropdownMenuItem>
  );
};

const InstallDialog = (props: { item: ListReleaseFragment }) => {
  const { data } = useTemplatesQuery({
    variables: {
      filters: {
        node: {
          demands: [
            {
              kind: DemandKind.Args,
              matches: [
                {
                  at: 0,
                  kind: PortKind.Structure,
                  identifier: "@kabinet/release",
                },
              ],
            },
            {
              kind: DemandKind.Returns,
              matches: [
                {
                  at: 0,
                  kind: PortKind.Structure,
                  identifier: "@kabinet/pod",
                },
              ],
            },
          ],
        },
      },
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Install
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        {data?.templates.length === 0 && (
          <>No installers found. Please install an engine...</>
        )}
        {data?.templates.map((t) => (
          <AssignButton template={t} release={props.item.id} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TheCard = ({ item, mates }: Props) => {
  const { progress } = useLiveAssignation({
    identifier: "@kabinet/release",
    object: item.id,
  });

  return (
    <KabinetRelease.Smart object={item?.id} mates={mates}>
      <Card
        className="group transition-all duration-300 ease-in-out aspect-square"
        style={{
          backgroundSize: `${progress || 0}% 100%`,
          backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <CardHeader className="flex flex-col justify-between h-full">
          <div className="flex-grow">
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
              {progress}
            </CardDescription>
          </div>
          <div>
            <InstallDialog item={item} />
          </div>
        </CardHeader>
      </Card>
    </KabinetRelease.Smart>
  );
};

export default TheCard;
