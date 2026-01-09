import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestDashboard } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListDashboardFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListDashboardFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestDashboard.Smart object={item?.id}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestDashboard.DetailLink object={item?.id}>
              {" "}
              <h1>{item.name}</h1>
            </RekuestDashboard.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestDashboard.Smart>
  );
};

export default TheCard;
