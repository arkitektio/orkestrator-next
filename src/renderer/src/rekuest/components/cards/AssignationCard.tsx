import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestAssignation } from "@/linkers";

import Timestamp from "react-timestamp";
import { PostmanAssignationFragment } from "../../api/graphql";
interface Props {
  assignation: PostmanAssignationFragment;

}

const TheCard = ({ assignation }: Props) => {
  return (
    <RekuestAssignation.Smart object={assignation}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestAssignation.DetailLink object={assignation}>
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
