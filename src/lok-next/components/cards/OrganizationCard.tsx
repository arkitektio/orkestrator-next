import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { ListOrganizationFragment } from "@/lok-next/api/graphql";

export type OrganizationCardProps = {
  item: ListOrganizationFragment;
};

const OrganizationCard = ({ item }: OrganizationCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">{item.name}</CardTitle>
        </div>
        <CardDescription className="text-sm">
          @{item.slug}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground">
          ID: {item.id}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard;
