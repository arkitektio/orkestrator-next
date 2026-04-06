import { CardHeader, CardTitle } from "@/components/ui/card";
import { LokUser, MikroAcquisitionView } from "@/linkers";
import Timestamp from "react-timestamp";
import { AcquisitionViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: AcquisitionViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroAcquisitionView.Smart object={view} >
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
                  object={view.operator}
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
