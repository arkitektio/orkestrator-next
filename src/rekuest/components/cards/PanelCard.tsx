import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestPanel } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListPanelFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListPanelFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestPanel.Smart object={item?.id}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestPanel.DetailLink object={item?.id}>
              {" "}
              <h1>{item.name}</h1>
            </RekuestPanel.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestPanel.Smart>
  );
};

export default TheCard;
