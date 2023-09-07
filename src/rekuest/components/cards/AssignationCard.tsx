import { MikroChannelView, RekuestAssignation } from "@/linkers";
import { PostmanAssignationFragment } from "../../api/graphql";
import { MateFinder } from "@/mates/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  assignation: PostmanAssignationFragment;
  mates?: MateFinder[];
}

const TheCard = ({ assignation, mates }: Props) => {
  return (
    <RekuestAssignation.Smart
      object={assignation?.id}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestAssignation.DetailLink object={assignation.id}>
            {assignation.status}
            </RekuestAssignation.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestAssignation.Smart>
  );
};

export default TheCard;
