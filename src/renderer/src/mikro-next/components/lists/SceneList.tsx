import { ListRender } from "@/components/layout/ListRender";
import { MikroScene, MikroStage } from "@/linkers";
import {
  DatasetFilter,
  OffsetPaginationInput,
  useGetScenesQuery,
  useGetStagesQuery,
} from "../../api/graphql";
import SceneCard from "../cards/SceneCard";

export type Props = {
  filters?: DatasetFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useGetScenesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.scenes}
      title={
        <MikroScene.ListLink className="flex-0">Scenes</MikroScene.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <SceneCard key={index} scene={ex} />}
    </ListRender>
  );
};

export default List;
