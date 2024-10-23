import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import { KabinetDefinition } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListDefinitionFragment } from "../../api/graphql";

interface Props {
  item: ListDefinitionFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <KabinetDefinition.Smart object={item?.id} mates={mates}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <KabinetDefinition.DetailLink object={item?.id}>
                {" "}
                {item.name}
              </KabinetDefinition.DetailLink>
            </CardTitle>
            <CardDescription>
              {item?.description && (
                <NodeDescription description={item?.description} />
              )}
            </CardDescription>
          </div>
          <CardTitle></CardTitle>
        </CardHeader>
      </Card>
    </KabinetDefinition.Smart>
  );
};

export default TheCard;
