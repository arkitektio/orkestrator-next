import { Card, CardTitle } from "@/components/ui/card";
import { MikroMesh } from "@/linkers";
import { ListMeshFragment } from "../../api/graphql";

interface Props {
  mesh: ListMeshFragment;

}

const TheCard = ({ mesh }: Props) => {
  return (
    <MikroMesh.Smart object={mesh} >
      <Card className="px-2 py-2 aspect-[5/3]">
        <CardTitle className="line-clamp-2 break-words">
          <MikroMesh.DetailLink object={mesh}>
            {mesh.name}
          </MikroMesh.DetailLink>
        </CardTitle>
      </Card>
    </MikroMesh.Smart>
  );
};

export default TheCard;
