import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card
        className="group border border-gray-200 dark:border-gray-800 aspect-square max-h-lg"
        style={{
          backgroundSize: `${progress?.progress || 0}% 100%`,
          backgroundImage: `linear-gradient(to right, #10b981 ${progress?.progress}%, #10b981 ${progress?.progress}%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <CardHeader className="flex flex-row p-3">
          <div>
            <CardTitle className="mb-2">
              <RekuestImplementation.DetailLink object={item?.id}>
                {" "}
                {item.action.name}
              </RekuestImplementation.DetailLink>
            </CardTitle>
            <CardDescription>{item.action.description}</CardDescription>
            <p className="text-xs text-gray-500">{item.interface}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-2">
            <DialogButton name={"implementationassign"} size="sm" dialogProps={{ id: item.id }} variant={"outline"}>Assign </DialogButton>
          </div>
        </CardContent>
      </Card>
    </RekuestImplementation.Smart>
  );
};

export default TheCard;
