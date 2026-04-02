import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RekuestResolution } from "@/linkers";
import { ListResolutionFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListResolutionFragment;
}

const TheCard = ({ item }: Props) => {


  return (
    <RekuestResolution.Smart object={item}>
      <Card className="group">
        <CardHeader className="flex flex-row justify-between truncate ellipsis">
          <div>
            <CardTitle>
              <RekuestResolution.DetailLink object={item}>
                {" "}
                {item.name}
              </RekuestResolution.DetailLink>

            </CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
      </Card>
    </RekuestResolution.Smart>
  );
};

export default TheCard;
