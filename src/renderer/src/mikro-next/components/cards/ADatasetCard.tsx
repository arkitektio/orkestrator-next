import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { MikroADataset } from "@/linkers";
import { ListADatasetFragment } from "../../api/graphql";

interface Props {
  adataset: ListADatasetFragment;
}

const TheCard = ({ adataset }: Props) => {
  return (
    <MikroADataset.Smart object={adataset}>
      <Card className="px-2 py-2 aspect-[5/3] flex flex-col justify-between">
        <CardTitle className="line-clamp-2 break-words">
          <MikroADataset.DetailLink object={adataset}>
            {adataset.name}
          </MikroADataset.DetailLink>
        </CardTitle>
        <div className="flex flex-row flex-wrap gap-1 items-center">
          <span className="text-xs text-muted-foreground font-mono">
            {adataset.dims.join(" × ")}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            ({adataset.shape.join(", ")})
          </span>
          {adataset.multiscale && (
            <Badge variant="outline" className="text-xs">
              multiscale
            </Badge>
          )}
        </div>
      </Card>
    </MikroADataset.Smart>
  );
};

export default TheCard;
