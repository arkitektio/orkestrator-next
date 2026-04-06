import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestAssignation } from "@/linkers";

import Timestamp from "react-timestamp";
import { ListAsssignationFragment } from "../../api/graphql";
interface Props {
  item: ListAsssignationFragment;

}

const TheCard = ({ item }: Props) => {
  return (
    <RekuestAssignation.Smart object={item}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestAssignation.DetailLink object={item}>
              {item.action.name}
            </RekuestAssignation.DetailLink>
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
