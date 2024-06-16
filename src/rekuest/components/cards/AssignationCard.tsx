import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestAssignation } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { PostmanAssignationFragment } from "../../api/graphql";
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
              {assignation.reservation.node.name}
            </RekuestAssignation.DetailLink>
            {assignation.events.at(0)?.kind}
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestAssignation.Smart>
  );
};

export default TheCard;
