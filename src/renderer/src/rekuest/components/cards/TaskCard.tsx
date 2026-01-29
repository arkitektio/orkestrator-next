import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RekuestAssignation } from "@/linkers";
import Timestamp from "react-timestamp";
import { Clock } from "lucide-react";
import { ListAsssignationFragment } from "../../api/graphql";

interface Props {
  item: ListAsssignationFragment;
}

const TheCard = ({ item }: Props) => {
  return (
    <RekuestAssignation.Smart object={item?.id}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            <RekuestAssignation.DetailLink object={item.id} className="hover:text-primary transition-colors">
              {item.action.name}
            </RekuestAssignation.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-xs">
              <Timestamp date={item.createdAt} relative />
            </span>
          </div>
        </CardContent>
      </Card>
    </RekuestAssignation.Smart>
  );
};

export default TheCard;
