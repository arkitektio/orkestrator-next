import { Card, CardTitle } from "@/components/ui/card";
import { MikroFile } from "@/linkers";
import { cn } from "@udecode/cn";
import { ListFileFragment } from "../../api/graphql";

interface Props {
  file: ListFileFragment;
  className?: string;
}

const TheCard = ({ file, className }: Props) => {
  return (
    <MikroFile.Smart object={file?.id} key={file.id}>
      <Card
        className={cn(
          "px-2 py-2 aspect-[20/3] max-h-20 justify-center flex items-center ",
          className,
        )}
      >
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
