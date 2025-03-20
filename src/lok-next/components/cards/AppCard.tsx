import { LokApp, LokClient, LokService, LokServiceInstance } from "@/linkers";
import { MateFinder } from "../../../mates/types";
import {
  BackendType,
  ListAppFragment,
  ListClientFragment,
  ListServiceFragment,
  ListServiceInstanceFragment,
} from "../../api/graphql";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";

interface Props {
  item: ListAppFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const resolve = useResolve();

  return (
    <LokApp.Smart object={item?.id} mates={mates}>
      <Card className="p-3">
        <LokApp.DetailLink object={item.id} className="">
          {item.identifier}
          <br />
        </LokApp.DetailLink>
        {item.logo && <Image src={resolve(item.logo.presignedUrl)} />}
      </Card>
    </LokApp.Smart>
  );
};

export default TheCard;
