import { Card, CardTitle } from "@/components/ui/card";
import { MikroFile } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { ListFileFragment } from "../../api/graphql";

interface Props {
  file: ListFileFragment;
  mates?: MateFinder[];
}

const TheCard = ({ file, mates }: Props) => {
  return (
    <MikroFile.Smart object={file?.id} mates={mates}>
      <Card className="px-2 py-2 ">
        <CardTitle className="truncate">
          <MikroFile.DetailLink object={file.id}>
            {file.name}
          </MikroFile.DetailLink>
        </CardTitle>
      </Card>
    </MikroFile.Smart>
  );
};

export default TheCard;
