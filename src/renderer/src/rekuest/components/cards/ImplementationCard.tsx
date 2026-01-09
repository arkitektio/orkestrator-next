import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DialogButton } from "@/components/ui/dialogbutton";
import { useActionDescription } from "@/lib/rekuest/ActionDescription";
import { RekuestImplementation } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import {
  ListImplementationFragment,
  useDeleteImplementationMutation,
} from "@/rekuest/api/graphql";
import { ImplementationActionButton } from "@/rekuest/buttons/ImplementationActionButton";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";
import { PlayCircle } from "lucide-react";

interface Props {
  item: ListImplementationFragment;
  mates?: MateFinder[];
}

const TheCard = ({ item, mates }: Props) => {
  const reserveMate = useReserveMate();
  const [deleteImplementation, _] = useDeleteImplementationMutation({
    variables: {
      id: item.id,
    },
  });

  const progress = useLiveAssignation({
    assignedImplementation: item.id,
  });

  const description = useActionDescription({
    description: item.action.description || "",
  });

  return (
    <RekuestImplementation.Smart object={item?.id} mates={[reserveMate]}>
      <Card className="group hover:shadow-md transition-shadow overflow-hidden">
        {progress && progress.progress > 0 && (
          <Progress value={progress.progress} className="h-1 rounded-none" />
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base mb-1">
                <RekuestImplementation.DetailLink object={item?.id} className="hover:text-primary transition-colors">
                  {item.action.name}
                </RekuestImplementation.DetailLink>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {item.action.description}
              </CardDescription>
              <Badge variant="secondary" className="text-xs font-mono">
              {item.interface}
            </Badge>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">

            <DialogButton
              name={"implementationassign"}
              size="sm"
              dialogProps={{ id: item.id }}
              variant={"outline"}
              className="h-8"
            >
              <PlayCircle className="h-3 w-3 mr-1" />
              Assign
            </DialogButton>
        </CardFooter>
      </Card>
    </RekuestImplementation.Smart>
  );
};

export default TheCard;
