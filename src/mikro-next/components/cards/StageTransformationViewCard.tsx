import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroAffineTransformationView, MikroImage } from "@/linkers";
import { useDeleteAffineTransformationViewMate } from "@/mikro-next/mates/transformationview";
import { MateFinder } from "../../../mates/types";
import { StageFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: StageFragment["affineViews"][0];
  mates?: MateFinder[];
}

export const AffineInformation = ({ matrix }: { matrix: number[][] }) => {
  const x = matrix[0][3];
  const y = matrix[0][3];
  const z = matrix[0][3];

  const xScale = matrix[0][0];
  const yScale = matrix[1][1];
  const zScale = matrix[2][2];

  return (
    <>
      <div className="text-muted-foreground text-xs">
        x: {x.toPrecision(2)} y: {y.toPrecision(2)} z: {z.toPrecision(2)}
      </div>
      <div className="text-muted-foreground text-xs">
        xp: {xScale.toPrecision(2)} yp: {yScale.toPrecision(2)} zp:{" "}
        {zScale.toPrecision(2)}
      </div>
    </>
  );
};

const CardItem = ({ view, mates }: Props) => {
  const deleteMate = useDeleteAffineTransformationViewMate();

  return (
    <MikroAffineTransformationView.Smart object={view?.id} mates={[deleteMate]}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle className="truncate">
            {" "}
            <MikroImage.DetailLink
              className={({ isActive } /*  */) =>
                "z-10 font-bold text-md mb-2 cursor-pointer w-full  " +
                (isActive ? "text-primary-300" : "")
              }
              object={view.image.id}
            >
              {view.image.name}
            </MikroImage.DetailLink>
          </CardTitle>

          <AffineInformation matrix={view.affineMatrix} />
        </CardHeader>
      </ViewCard>
    </MikroAffineTransformationView.Smart>
  );
};

export default CardItem;
