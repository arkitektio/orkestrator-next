import { MikroHistory, RekuestAssignation } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { HistoryFragment, HistoryKind } from "../../api/graphql";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserInfo } from "@/lok-next/components/protected/UserInfo";
import Timestamp from "react-timestamp";
import { Badge } from "@/components/ui/badge";

interface HistoryCardProps {
  history: HistoryFragment;
  mates?: MateFinder[];
}






const TheCard = ({ history, mates }: HistoryCardProps) => {
  return (
    <MikroHistory.Smart
      object={history?.id}
      mates={mates}
    >
      <Card>
        <CardHeader className="flex flex-row gap-1">
          <UserInfo sub={history.user?.sub}></UserInfo> 
          <div className="flex flex-col">
          <CardTitle>{history.kind == HistoryKind.Create && "created it"} {history.kind == HistoryKind.Update && "updated"} {history.kind == HistoryKind.Delete && "deleted it"}</CardTitle>
          <CardDescription><Timestamp date={history.date} relative/></CardDescription>
          </div>

         
          
          
        </CardHeader>
        <CardContent>

        {history.effectiveChanges.map((change) => (
            <div className="flex flex-row gap-1">
            <Badge variant="outline"> {change.field}</Badge> <div className="text-xs text-muted-foreground my-auto">from</div> <div className="text-muted-xs my-auto">{change.oldValue}</div> <div className="text-xs text-muted-foreground my-auto">to</div><div className="text-xs my-auto">{change.newValue}</div>
            </div>
          ))}




        {history.during && (
          <RekuestAssignation.DetailLink
            className={({ isActive } /*  */) =>
              "z-10 font-bold text-md mb-2 cursor-pointer " +
              (isActive ? "text-primary-300" : "")
            }
            object={history.during}
          >
            <Badge > during</Badge>
          </RekuestAssignation.DetailLink>
        )}
        </CardContent>
      </Card>
    </MikroHistory.Smart>
  );
};

export default TheCard;
