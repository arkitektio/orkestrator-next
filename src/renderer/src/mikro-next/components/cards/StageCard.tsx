import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MikroStage } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListStageFragment } from "../../api/graphql";

interface Props {
  stage: ListStageFragment;
  mates?: MateFinder[];
}

const TheCard = ({ stage, mates }: Props) => {
  return (
    <MikroStage.Smart object={stage?.id} mates={mates}>
      <Card className={cn("aspect-square flex flex-col ")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <MikroStage.DetailLink object={stage?.id}>
              {" "}
              <h1 className="line-clamp-2 ellipsis">{stage.name}</h1>
              <span className="text-muted-foreground font-light ">
                {stage.id}
              </span>
            </MikroStage.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter>xxx</CardFooter>
      </Card>
    </MikroStage.Smart>
  );
};

export default TheCard;
