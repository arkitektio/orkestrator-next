import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
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
      <Card className="group aspect-square @sm:aspect-[3/2] overflow-hidden">
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
                <ActionDescription description={item?.description} />
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
