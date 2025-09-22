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
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import { KabinetRelease } from "@/linkers";
import {
  DemandKind,
  ListImplementationFragment,
  PortKind,
  useImplementationsQuery,
} from "@/rekuest/api/graphql";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { useImplementationAction } from "@/rekuest/hooks/useImplementationAction";
import { MateFinder } from "../../../mates/types";
import { ListReleaseFragment } from "../../api/graphql";

interface Props {
  item: ListReleaseFragment;
  mates?: MateFinder[];
}

export const AssignButton = (props: {
  template: ListImplementationFragment;
  release: string;
}) => {
  const { assign, latestAssignation, implementation } = useImplementationAction(
    {
      id: props.template.id,
    },
  );

  const doassign = async () => {
    let argKey = implementation?.action.args.at(0)?.key;
    if (!argKey) {
      return;
    }
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
  const { data } = useImplementationsQuery({
    variables: {
      filters: {
        action: {
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
        {data?.implementations.length === 0 && (
          <>No installers found. Please install an engine...</>
        )}
        {data?.implementations.map((t) => (
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
                <ActionDescription description={item?.description} />
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
