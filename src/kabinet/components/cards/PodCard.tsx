import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KabinetPod } from "@/linkers";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { MateFinder } from "../../../mates/types";
import { ListPodFragment } from "../../api/graphql";

interface Props {
  item: ListPodFragment;
  mates?: MateFinder[];
}



const TheCard = ({ item, mates }: Props) => {



  return (
    <KabinetPod.Smart object={item?.id} mates={mates}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <KabinetPod.DetailLink object={item?.id}>
                {" "}
                {item.deployment.flavour.release.app.identifier}{item.deployment.flavour.release.version}

              </KabinetPod.DetailLink>
            </CardTitle>
            <CardDescription>
                {item.status} {item.backend.name}
            </CardDescription>
          </div>
          
        </CardHeader>
        <CardContent  className="flex flex-row gap-2">
          <ObjectButton object={item.id} identifier="@kabinet/pod"/>
        </CardContent>
      </Card>
    </KabinetPod.Smart>
  );
};

export default TheCard;
