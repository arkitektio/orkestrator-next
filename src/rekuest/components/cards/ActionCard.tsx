import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import { RekuestAction } from "@/linkers";
import { useReserveMate } from "@/mates/reserve/useReserveMate";
import { MateFinder } from "@/mates/types";
import { ListActionFragment } from "@/rekuest/api/graphql";
import { ActionButton } from "@/rekuest/buttons/ActionButton";
import { ReserveActionButton } from "@/rekuest/buttons/ReserveActionButton";
import { useLiveAssignation } from "@/rekuest/hooks/useAssignations";

interface Props {
  action: ListActionFragment;
  mates?: MateFinder[];
}

const TheCard = ({ action, mates }: Props) => {
  const reserveMate = useReserveMate();

  const progress = useLiveAssignation({
    assignedAction: action.id,
  });

  return (
    <RekuestAction.Smart object={action?.id} mates={[reserveMate]}>
      <Card
        className="group border border-gray-200 dark:border-gray-800 aspect-square ring ring-0 group-data-[selected=true]:ring-1  "
        style={{
          backgroundSize: `${progress?.progress || 0}% 100%`,
          backgroundImage: `linear-gradient(to right, #10b981 ${progress?.progress}%, #10b981 ${progress?.progress}%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      >
        <CardHeader className="flex flex-col justify-between p-3 h-full">
          <div className="flex-grow overflow-hidden">
            <CardTitle>
              <RekuestAction.DetailLink object={action?.id}>
                {" "}
                {action.name}
              </RekuestAction.DetailLink>
            </CardTitle>
            <CardDescription>
              {action?.description && (
                <ActionDescription description={action?.description} />
              )}
            </CardDescription>
          </div>
          <CardFooter className="flex justify-between gap-2 truncate">
            <ActionButton id={action.id}>
              <Button variant="outline" size="sm" className="flex-1 truncate">
                Assign
              </Button>
            </ActionButton>
            <ReserveActionButton id={action.id}>
              <Button variant="outline" size="sm"  className="flex-1 truncate">
                Short
              </Button>
            </ReserveActionButton>
          </CardFooter>
        </CardHeader>
      </Card>
    </RekuestAction.Smart>
  );
};

export default TheCard;
