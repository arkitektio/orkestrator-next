import { MikroFluorophore, MikroLabelView } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import { LabelViewFragment } from "../../api/graphql";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  view: LabelViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroLabelView.Smart object={view?.id} mates={mates}>
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            <MikroFluorophore.DetailLink
              className={({ isActive } /*  */) =>
                "z-10 font-bold text-md mb-2 cursor-pointer " +
                (isActive ? "text-primary-300" : "")
              }
              object={view.fluorophore.id}
            >
              {view.fluorophore?.name}
            </MikroFluorophore.DetailLink>
            <div className=" @xl:block hidden">
              <div className="mt-1 flex flex-row gap-1 text-xs">
                <div className="text-muted-foreground flex flex-row gap-1">
                  <ArrowDownIcon />
                  {view.fluorophore?.emissionWavelength} nm
                </div>
                <div className="text-muted-foreground flex flex-row gap-1">
                  <ArrowUpIcon /> {view.fluorophore?.excitationWavelength} nm
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </MikroLabelView.Smart>
  );
};

export default TheCard;
