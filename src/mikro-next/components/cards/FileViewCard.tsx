import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroFile,
  MikroFileView
} from "@/linkers";
import { MateFinder } from "../../../mates/types";
import {
  FileViewFragment
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: FileViewFragment;
  mates?: MateFinder[];
}

const TheCard = ({ view, mates }: Props) => {
  return (
    <MikroFileView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle className="flex flex-col">
            <p className="font-bold text-md font-light mb-1">Created from</p>
            <p className="font-bold text-xs truncate">
              {view.file && (
                <MikroFile.DetailLink object={view.file?.id}>
                  {view.file?.name}
                </MikroFile.DetailLink>
              )}
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroFileView.Smart>
  );
};

export default TheCard;
