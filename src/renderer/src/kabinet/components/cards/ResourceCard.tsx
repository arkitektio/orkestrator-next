import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KabinetResource } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListResourceFragment } from "../../api/graphql";

interface Props {
  item: ListResourceFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KabinetResource.Smart object={item?.id} mates={mates}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <KabinetResource.DetailLink object={item?.id}>
                {" "}
                {item.name}
              </KabinetResource.DetailLink>
            </CardTitle>
            <CardDescription>{item.backend.name}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-row gap-2"></CardContent>
      </Card>
    </KabinetResource.Smart>
  );
};

export default TheCard;
