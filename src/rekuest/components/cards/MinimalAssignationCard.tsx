import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestAssignation, RekuestImplementation } from "@/linkers";
import { MateFinder } from "@/mates/types";
import Timestamp from "react-timestamp";
import { MinimalAssignationFragment, PostmanAssignationFragment } from "../../api/graphql";
interface Props {
  item: MinimalAssignationFragment;
}

const TheCard = ({ item }: Props) => {
  return (
    <RekuestAssignation.Smart object={item?.id}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestImplementation.DetailLink object={item.id}>
              {item.implementation.interface}
            </RekuestImplementation.DetailLink>
            <div className="text-muted-foreground font-light mt-2">
              <Timestamp date={item.createdAt} relative />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestAssignation.Smart>
  );
};

export default TheCard;
