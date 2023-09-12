import { MikroOpticsView, MikroInstrument } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { OpticsViewFragment } from "../../api/graphql";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  view: OpticsViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroOpticsView.Smart object={view?.id} mates={mates}>
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            {view.instrument && (
              <MikroInstrument.DetailLink
                className={({ isActive } /*  */) =>
                  "z-10 font-bold text-md mb-2 cursor-pointer " +
                  (isActive ? "text-primary-300" : "")
                }
                object={view.instrument.id}
              >
                {view.instrument.name}
              </MikroInstrument.DetailLink>
            )}
          </CardTitle>
        </CardHeader>
      </Card>
    </MikroOpticsView.Smart>
  );
};

export default TheCard;
