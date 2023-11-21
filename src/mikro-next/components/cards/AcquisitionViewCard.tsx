import { MikroFluorophore, MikroAcquisitionView, LokUser } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { AcquisitionViewFragment } from "../../api/graphql";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { ViewCard } from "./meta/ViewCard";
import Timestamp from "react-timestamp";

interface Props {
  view: AcquisitionViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroAcquisitionView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            {" "}
            {view.operator && (
              <>
                <LokUser.DetailLink
                  className={({ isActive } /*  */) =>
                    "z-10 font-bold text-md mb-2 cursor-pointer " +
                    (isActive ? "text-primary-300" : "")
                  }
                  object={view.operator.sub}
                >
                  {view.operator?.sub}
                </LokUser.DetailLink>
              </>
            )}
            <div className="">
              <div className="text-xs text-muted">Acquired</div>
              <Timestamp date={view.acquiredAt} relative />
            </div>
            <div className="mt-1 flex flex-row gap-1 text-xs">
              <div className="text-muted-foreground flex flex-row gap-1">
                {view.description}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroAcquisitionView.Smart>
  );
};

export default TheCard;
