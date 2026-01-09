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
  item: ListActionFragment;
}

const TheCard = ({ item }: Props) => {
  const reserveMate = useReserveMate();



  return (
    <RekuestAction.Smart object={item?.id} mates={[reserveMate]}>
      <Card
        className="group border aspect-square ring ring-0 group-data-[selected=true]:ring-1 flex flex-col justify-between"
      >
        <CardHeader className="flex flex-col justify-between h-full">
          <div className="flex-grow overflow-hidden">
            <CardTitle>
              <RekuestAction.DetailLink object={item?.id}>
                {" "}
                {item.name}
              </RekuestAction.DetailLink>
            </CardTitle>
            <CardDescription>
              {item?.description && (
                <ActionDescription description={item?.description} />
              )}
            </CardDescription>
          </div>
        </CardHeader>

          <CardFooter className="flex justify-between items-center gap-2 truncate">
            <ActionButton id={item.id}>
              <Button variant="outline" size="lg" className="flex-1 truncate">
                Assign
              </Button>
            </ActionButton>
            <ReserveActionButton id={item.id}>
              <Button variant="outline" size="lg" className="flex-1 truncate">
                Short
              </Button>
            </ReserveActionButton>
          </CardFooter>
      </Card>
    </RekuestAction.Smart>
  );
};

export default TheCard;
