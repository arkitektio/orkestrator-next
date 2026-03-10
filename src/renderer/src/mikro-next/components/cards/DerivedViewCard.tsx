import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroFileView,
  MikroImage
} from "@/linkers";
import {
  DerivedViewFragment
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: DerivedViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroFileView.Smart object={view?.id} >
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-xs">
              Derived through {view.operation} from{" "}
            </p>
            <p className="font-bold text-xl">
              {view.originImage && (
                <MikroImage.DetailLink object={view.originImage?.id}>
                  {view.originImage?.name}
                </MikroImage.DetailLink>
              )}
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroFileView.Smart>
  );
};

export default TheCard;
