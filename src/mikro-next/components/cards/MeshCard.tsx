import { Card, CardTitle } from "@/components/ui/card";
import { MikroFile, MikroMesh } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListFileFragment, ListMeshFragment } from "../../api/graphql";

interface Props {
  mesh: ListMeshFragment;
  mates?: MateFinder[];
}

const TheCard = ({ mesh, mates }: Props) => {
  return (
    <MikroMesh.Smart object={mesh?.id} mates={mates}>
      <Card className="px-2 py-2 aspect-[5/3]">
        <CardTitle className="line-clamp-2 break-words">
          <MikroMesh.DetailLink object={mesh.id}>
            {mesh.name}
          </MikroMesh.DetailLink>
        </CardTitle>
      </Card>
    </MikroMesh.Smart>
  );
};

export default TheCard;
