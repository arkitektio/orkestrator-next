import { CardHeader, CardTitle } from "@/components/ui/card";
import { MikroInstrument, MikroOpticsView } from "@/linkers";
import { OpticsViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: OpticsViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroOpticsView.Smart object={view} >
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            {" "}
            {view.instrument && (
              <MikroInstrument.DetailLink
                className={({ isActive } /*  */) =>
                  "z-10 font-bold text-md mb-2 cursor-pointer " +
                  (isActive ? "text-primary-300" : "")
                }
                object={view.instrument}
              >
                {view.instrument.name}
              </MikroInstrument.DetailLink>
            )}
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroOpticsView.Smart>
  );
};

export default TheCard;
