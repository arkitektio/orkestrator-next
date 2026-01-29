import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestBlok } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListBlokFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListBlokFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  return (
    <RekuestBlok.Smart object={item?.id}>
      <Card>
        <CardHeader>
          <CardTitle>
            <RekuestBlok.DetailLink object={item?.id}>
              {" "}
              <h1>{item.name}</h1>
            </RekuestBlok.DetailLink>
          </CardTitle>
        </CardHeader>
      </Card>
    </RekuestBlok.Smart>
  );
};

export default TheCard;
