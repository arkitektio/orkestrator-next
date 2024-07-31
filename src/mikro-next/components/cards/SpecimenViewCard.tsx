import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroEntity,
  MikroFluorophore,
  MikroLabelView,
  MikroMetric,
  MikroSpecimen,
  MikroSpecimenView,
} from "@/linkers";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { MateFinder } from "../../../mates/types";
import { LabelViewFragment, SpecimenViewFragment } from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: SpecimenViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroSpecimenView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            {" "}
            {view.specimen && (
              <>
                <MikroSpecimen.DetailLink
                  className={({ isActive } /*  */) =>
                    "z-10 font-bold text-md mb-2 cursor-pointer " +
                    (isActive ? "text-primary-300" : "")
                  }
                  object={view.specimen.id}
                >
                  {view.specimen.entity.name}
                  <p className="text-xs font-light">
                    {view.specimen?.entity?.kind.label}
                  </p>
                  <p className="text-xs font-light">
                    {view.specimen.protocol.id}
                  </p>
                </MikroSpecimen.DetailLink>
              </>
            )}
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroSpecimenView.Smart>
  );
};

export default TheCard;
