import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MikroStage } from "@/linkers";
import { ListStageFragment } from "../../api/graphql";

interface Props {
  stage: ListStageFragment;

}

const TheCard = ({ stage }: Props) => {
  return (
    <MikroStage.Smart object={stage} >
      <Card className={cn("aspect-square flex flex-col ")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <MikroStage.DetailLink object={stage}>
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
