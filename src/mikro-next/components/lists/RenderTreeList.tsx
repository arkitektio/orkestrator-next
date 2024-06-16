import { ListRender } from "@/components/layout/ListRender";
import { MikroRenderTree } from "@/linkers";
import { withMikroNext } from "@jhnnsrs/mikro-next";
import {
  ImageFilter,
  OffsetPaginationInput,
  useRenderTreesQuery,
} from "../../api/graphql";
import RenderTreeCard from "../cards/RenderTreeCard";

export type Props = {
  filters?: ImageFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withMikroNext(
    useRenderTreesQuery,
  )({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.renderTrees}
      title={
        <MikroRenderTree.ListLink className="flex-0">
          Renders
        </MikroRenderTree.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <RenderTreeCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
