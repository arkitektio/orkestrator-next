import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RekuestDependency } from "@/linkers";


import { ListDependencyFragment } from "@/rekuest/api/graphql";

interface Props {
  item: ListDependencyFragment;

}

const TheCard = ({ item }: Props) => {


  return (
    <RekuestDependency.Smart object={item} >
      <Card className="group">
        <CardHeader className="flex flex-row justify-between truncate ellipsis">
          <div>
            <CardTitle>
              <RekuestDependency.DetailLink object={item}>
                {" "}
                {item.key}
              </RekuestDependency.DetailLink>
            </CardTitle>
            <CardDescription></CardDescription>
          </div>
        </CardHeader>
      </Card>
    </RekuestDependency.Smart>
  );
};

export default TheCard;
