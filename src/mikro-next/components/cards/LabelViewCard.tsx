import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroEntity,
  MikroFluorophore,
  MikroLabelView,
  MikroMetric,
} from "@/linkers";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { MateFinder } from "../../../mates/types";
import { LabelViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: LabelViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroLabelView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            {" "}
            {view.primaryAntibody && (
              <>
                <MikroEntity.DetailLink
                  className={({ isActive } /*  */) =>
                    "z-10 font-bold text-md mb-2 cursor-pointer " +
                    (isActive ? "text-primary-300" : "")
                  }
                  object={view.primaryAntibody.id}
                >
                  {view.primaryAntibody?.kind.label}
                  <p className="text-xs font-light">
                    {view.primaryAntibody.name}
                  </p>
                </MikroEntity.DetailLink>
              </>
            )}
            {view.fluorophore && (
              <>
                <MikroEntity.DetailLink
                  className={({ isActive } /*  */) =>
                    "z-10 font-bold text-md mb-2 cursor-pointer " +
                    (isActive ? "text-primary-300" : "")
                  }
                  object={view.fluorophore.id}
                >
                  {view.fluorophore?.kind.label}
                  <p className="text-xs font-light">{view.fluorophore.name}</p>
                </MikroEntity.DetailLink>
              </>
            )}
            {view.secondaryAntibody && (
              <>
                <MikroEntity.DetailLink
                  className={({ isActive } /*  */) =>
                    "z-10 font-bold text-md mb-2 cursor-pointer " +
                    (isActive ? "text-primary-300" : "")
                  }
                  object={view.secondaryAntibody.id}
                >
                  {view.secondaryAntibody?.kind.label}
                  <p className="text-xs font-light">
                    {view.secondaryAntibody.name}
                  </p>
                </MikroEntity.DetailLink>
              </>
            )}
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroLabelView.Smart>
  );
};

export default TheCard;
