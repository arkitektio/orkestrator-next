import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KabinetFlavour } from "@/linkers";
import {
  DemandKind,
  ListImplementationFragment,
  PortKind,
  useImplementationsQuery,
} from "@/rekuest/api/graphql";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { useImplementationAction } from "@/rekuest/hooks/useImplementationAction";
import { MateFinder } from "../../../mates/types";
import { ListFlavourFragment } from "../../api/graphql";

interface Props {
  item: ListFlavourFragment;
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
    const argKey = implementation?.action.args.at(0)?.key;
    if (!argKey) {
      return;
    }

    console.log(
      await assign({
        args: {
          [argKey]: props.release,
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
                  identifier: "@kabinet/flavour",
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
    <div className="flex flex-row gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Install
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          {data?.implementations.map((t) => (
            <AssignButton template={t} release={props.item.id} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const DelegatingSelector = (props: {
  selector: ListFlavourFragment["selectors"][0];
}) => {
  if (props.selector.__typename == "CudaSelector") {
    return <div> Cuda </div>;
  }

  if (props.selector.__typename == "RocmSelector") {
    return <div> Cpu </div>;
  }

  return <> Unknown </>;
};

const TheCard = ({ item, mates }: Props) => {
  const { progress } = useLiveAssignation({
    identifier: "@kabinet/flavour",
    object: item.id,
  });

  return (
    <KabinetFlavour.Smart object={item?.id} mates={mates}>
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
          <div>
            <CardTitle>
              <KabinetFlavour.DetailLink object={item?.id}>
                {" "}
                {item.release.app.identifier}:{item.release.version}-{item.name}
              </KabinetFlavour.DetailLink>
            </CardTitle>
            {item.selectors.map((selector) => (
              <Badge className=" text-white bg-gray-700">
                <DelegatingSelector selector={selector} />
              </Badge>
            ))}
          </div>

          <CardTitle>
            <InstallDialog item={item} />
          </CardTitle>
        </CardHeader>
      </Card>
    </KabinetFlavour.Smart>
  );
};

export default TheCard;
