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
import { useUsage } from "@/rekuest/hooks/useNode";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { template } from "lodash";

interface Props {
  item: ListTemplateFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const reserveMate = useReserveMate();
  const [deleteTemplate, _] = withRekuest(useDeleteTemplateMutation)({
    variables: {
      id: item.id,
    },
  });

  const [isUsed, toggle] = useUsage({ template: item.id });

  return (
    <RekuestTemplate.Smart object={item?.id} mates={[reserveMate]}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>
              <RekuestTemplate.DetailLink object={item?.id}>
                {" "}
                {item.interface}
              </RekuestTemplate.DetailLink>
            </CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-2">
            <Button onClick={() => toggle()} variant={"outline"}>
              {isUsed ? "Stop Using" : "Use"}
            </Button>
            <Button onClick={() => deleteTemplate()} variant={"outline"}>
              Del
            </Button>
          </div>
        </CardContent>
      </Card>
    </RekuestTemplate.Smart>
  );
};

export default TheCard;
