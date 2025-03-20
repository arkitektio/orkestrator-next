import {
  LokApp,
  LokClient,
  LokLayer,
  LokService,
  LokServiceInstance,
} from "@/linkers";
import { MateFinder } from "../../../mates/types";
import {
  BackendType,
  ListAppFragment,
  ListClientFragment,
  ListLayerFragment,
  ListServiceFragment,
  ListServiceInstanceFragment,
} from "../../api/graphql";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";

interface Props {
  item: ListLayerFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const resolve = useResolve();

  return (
    <LokLayer.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        <LokLayer.DetailLink object={item.id} className="">
          {item.name}
          <br />
        </LokLayer.DetailLink>
        {item.logo && <Image src={resolve(item.logo.presignedUrl)} />}
      </Card>
    </LokLayer.Smart>
  );
};

export default TheCard;
