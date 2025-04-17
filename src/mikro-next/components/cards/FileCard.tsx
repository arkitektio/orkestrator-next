import { Card, CardTitle } from "@/components/ui/card";
import { MikroFile } from "@/linkers";
import { ListFileFragment } from "../../api/graphql";
import { cn } from "@udecode/cn";

interface Props {
  file: ListFileFragment;
  className?: string;
}

const TheCard = ({ file, className }: Props) => {
  return (
    <MikroFile.Smart object={file?.id} >
      <Card className={cn("px-2 py-2 aspect-[5/3] justify-center flex items-center ", className)}>
        <CardTitle className="line-clamp-2 break-words">
          <MikroFile.DetailLink object={file.id}>
            {file.name}
          </MikroFile.DetailLink>
        </CardTitle>
      </Card>
    </MikroFile.Smart>
  );
};

export default TheCard;
