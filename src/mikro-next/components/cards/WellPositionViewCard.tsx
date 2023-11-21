import { MikroFluorophore, MikroLabelView, MikroMultiPositionView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { LabelViewFragment, WellPositionViewFragment } from "../../api/graphql";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: WellPositionViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroMultiPositionView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            {" "}
            {view.well && (
              <>
                <MikroFluorophore.DetailLink
                  className={({ isActive } /*  */) =>
                    "z-10 font-bold text-md mb-2 cursor-pointer " +
                    (isActive ? "text-primary-300" : "")
                  }
                  object={view.well.id}
                >
                  {view.well?.name}
                </MikroFluorophore.DetailLink>
                <div className=" @sm:block hidden">
                  <div className="mt-1 flex flex-row gap-1 text-xs">
                    <div className="text-muted-foreground flex flex-row gap-1">
                      <ArrowDownIcon />
                      {view.row} nm
                    </div>
                    <div className="text-muted-foreground flex flex-row gap-1">
                      <ArrowUpIcon /> {view.column} 
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroMultiPositionView.Smart>
  );
};

export default TheCard;
