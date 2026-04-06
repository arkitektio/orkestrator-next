import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MikroScene } from "@/linkers";
import { ListSceneFragment } from "../../api/graphql";

interface Props {
  scene: ListSceneFragment;

}

const TheCard = ({ scene }: Props) => {
  return (
    <MikroScene.Smart object={scene} >
      <Card className={cn("aspect-square flex flex-col ")}>
        <CardHeader className="flex-grow">
          <CardTitle>
            <MikroScene.DetailLink object={scene} >
              {" "}
              <h1 className="line-clamp-2 ellipsis">{scene.name}</h1>
              <span className="text-muted-foreground font-light ">
                {scene.id}
              </span>
            </MikroScene.DetailLink>
          </CardTitle>
        </CardHeader>
        <CardFooter>xxx</CardFooter>
      </Card>
    </MikroScene.Smart>
  );
};

export default TheCard;
