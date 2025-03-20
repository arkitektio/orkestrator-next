import {
  LokApp,
  LokClient,
  LokRelease,
  LokService,
  LokServiceInstance,
} from "@/linkers";
import { MateFinder } from "../../../mates/types";
import {
  BackendType,
  ListClientFragment,
  ListReleaseFragment,
  ListServiceFragment,
  ListServiceInstanceFragment,
} from "../../api/graphql";
import { Card } from "@/components/ui/card";

interface Props {
  item: ListReleaseFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <LokRelease.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        <LokRelease.DetailLink object={item.id} className="">
          {item.version}
          <br />
        </LokRelease.DetailLink>
      </Card>
    </LokRelease.Smart>
  );
};

export default TheCard;
