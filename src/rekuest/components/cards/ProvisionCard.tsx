import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestProvision } from "@/linkers";
import { useRequestMate } from "@/mates/request/useRequestMate";
import { MateFinder } from "@/mates/types";
import {
  ListProvisionFragment,
  useActivateMutation,
  useDeactivateMutation,
} from "@/rekuest/api/graphql";

interface Props {
  item: ListProvisionFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const requestMate = useRequestMate();

  const [activate] = useActivateMutation();
  const [deactive] = useDeactivateMutation();

  return (
    <RekuestProvision.Smart object={item?.id} mates={[requestMate]}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestProvision.DetailLink object={item?.id}>
              {" "}
              {item.agent.id}
              {item.status}
            </RekuestProvision.DetailLink>
          </CardTitle>
          <Button
            onClick={() => activate({ variables: { provision: item.id } })}
          >
            Activate
          </Button>
          <Button
            onClick={() => deactive({ variables: { provision: item.id } })}
          >
            Deactuve
          </Button>
        </CardHeader>
      </Card>
    </RekuestProvision.Smart>
  );
};

export default TheCard;
