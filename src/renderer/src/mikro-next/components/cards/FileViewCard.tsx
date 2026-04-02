import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  MikroFile,
  MikroFileView
} from "@/linkers";
import {
  FileViewFragment
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: FileViewFragment;

}

const TheCard = ({ view }: Props) => {
  return (
    <MikroFileView.Smart object={view} >
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle className="flex flex-col">
            <p className="font-bold text-md font-light mb-1">Created from</p>
            <p className="font-bold text-xs truncate">
              {view.file && (
                <MikroFile.DetailLink object={view.file}>
                  {view.file.name}
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
