import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MikroPixelView
} from "@/linkers";

// "PixelView" no longer exists as a type on the backend schema; this card is
// unreachable in practice (see call sites), kept only for its narrow local shape.
interface Props {
  view: { __typename?: "PixelView"; id: string };
}

const TheCard = ({ view }: Props) => {
  return (
    <MikroPixelView.Smart object={view} >
      <Card
        className={cn(
          "cursor-pointer @container text-xs rounded-md border bg-background/80",
        )}
      >
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-xl">
              {view.id && (
                <MikroPixelView.DetailLink object={view}>
                  Pixel Meaning
                </MikroPixelView.DetailLink>
              )}
            </p>
          </CardTitle>
        </CardHeader>
      </Card>
    </MikroPixelView.Smart>
  );
};

export default TheCard;
