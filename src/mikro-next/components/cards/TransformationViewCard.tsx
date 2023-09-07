import { MikroStage, MikroTransformationView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { AffineTransformationViewFragment } from "../../api/graphql";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  view: AffineTransformationViewFragment;
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
      <div className="text-muted-foreground">
        x: {x} y: {y} z: {z}
      </div>
      <div className="text-muted-foreground">
        xp: {xScale} yp: {yScale} zp: {zScale}
      </div>
    </>
  );
};

const CardItem = ({ view, mates }: Props) => {
  return (
    <MikroTransformationView.Smart object={view?.id} mates={mates}>
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            <MikroStage.DetailLink
              className={({ isActive } /*  */) =>
                "z-10 font-bold text-md mb-2 cursor-pointer " +
                (isActive ? "text-primary-300" : "")
              }
              object={view.stage.id}
            >
              {view.stage.name}
            </MikroStage.DetailLink>
          </CardTitle>

          <AffineInformation matrix={view.affineMatrix} />
        </CardHeader>
      </Card>
    </MikroTransformationView.Smart>
  );
};

export default CardItem;
