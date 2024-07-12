import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RekuestTemplate } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import {
  ListTemplateFragment,
  useDeleteTemplateMutation,
} from "@/rekuest/api/graphql";
import { TemplateActionButton } from "@/rekuest/buttons/TemplateActionButton";
import { useAssignProgress } from "@/rekuest/hooks/useAssignProgress";

interface Props {
  item: ListTemplateFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const reserveMate = useReserveMate();
  const [deleteTemplate, _] = useDeleteTemplateMutation({
    variables: {
      id: item.id,
    },
  });

  const progress = useAssignProgress({
    assignedTemplate: item.id,
  });

  return (
    <RekuestTemplate.Smart object={item?.id} mates={[reserveMate]}>
      <Card
        className="group"
        style={{
          backgroundSize: `${progress?.progress || 0}% 100%`,
          backgroundImage: `linear-gradient(to right, #10b981 ${progress?.progress}%, #10b981 ${progress?.progress}%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <CardHeader className="flex flex-row justify-between">
          <div>
            <p className="text-xs text-gray-500">{item.interface}</p>
            <CardTitle>
              <RekuestTemplate.DetailLink object={item?.id}>
                {" "}
                {item.node.name}
              </RekuestTemplate.DetailLink>
            </CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-2">
            <TemplateActionButton id={item.id}>
              <Button variant="outline" size="sm">
                Assign
              </Button>
            </TemplateActionButton>
          </div>
        </CardContent>
      </Card>
    </RekuestTemplate.Smart>
  );
};

export default TheCard;
