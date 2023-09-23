import { MikroChannelView, MikroRGBContext, MikroRGBView } from "@/linkers";
import { RgbViewFragment } from "../../api/graphql";
import { MateFinder } from "@/mates/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: RgbViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroRGBView.Smart object={view?.id}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            {" "}
            <MikroRGBContext.DetailLink
              className={({ isActive } /*  */) =>
                "z-10 font-bold text-md mb-2 cursor-pointer " +
                (isActive ? "text-primary-300" : "")
              }
              object={view.context.id}
            >
              {view.context.name}
            </MikroRGBContext.DetailLink>
          </CardTitle>
          <div
            className="w-2 h-2 rounded rounded-full"
            style={{ backgroundColor: view.fullColour }}
          ></div>
        </CardHeader>
      </ViewCard>
    </MikroRGBView.Smart>
  );
};

export default TheCard;
