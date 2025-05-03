import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestAssignation } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { PostmanAssignationFragment } from "../../api/graphql";
import Timestamp from "react-timestamp";
interface Props {
  assignation: PostmanAssignationFragment;
  mates?: MateFinder[];
}

const TheCard = ({ assignation, mates }: Props) => {
  return (
    <RekuestAssignation.Smart object={assignation?.id}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestAssignation.DetailLink object={assignation.id}>
              {assignation.action.name}
            </RekuestAssignation.DetailLink>
            <div className="text-muted-foreground font-light mt-2">
              <Timestamp date={assignation.createdAt} relative />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestAssignation.Smart>
  );
};

export default TheCard;
