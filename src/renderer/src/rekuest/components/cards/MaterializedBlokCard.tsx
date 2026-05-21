import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RekuestBlok, RekuestDashboard, RekuestMaterializedBlok } from "@/linkers";

import { ListMaterializedBlokFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListMaterializedBlokFragment;
}

const MaterializedBlokCard = ({ item }: Props) => {
  return (
    <RekuestMaterializedBlok.Smart object={item}>
      <Card className="group">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">
            <RekuestMaterializedBlok.DetailLink object={item}>
              {item.id}
            </RekuestMaterializedBlok.DetailLink>
          </CardTitle>
          <CardDescription className="flex flex-col gap-1 text-sm">
            <span>
              Blok{" "}
              <RekuestBlok.DetailLink object={item.blok}>
                {item.blok.name}
              </RekuestBlok.DetailLink>
            </span>
            <span>
              Dashboard{" "}
              <RekuestDashboard.DetailLink object={item.dashboard}>
                {item.dashboard.id}
              </RekuestDashboard.DetailLink>
            </span>
          </CardDescription>
        </CardHeader>
      </Card>
    </RekuestMaterializedBlok.Smart>
  );
};

export default MaterializedBlokCard;
