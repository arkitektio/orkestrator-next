import { ListRender } from "@/components/layout/ListRender";
import { MikroRenderTree } from "@/linkers";
import {
  ImageFilter,
  OffsetPaginationInput,
  useListRenderedPlotsQuery,
} from "../../api/graphql";
import RenderedPlotCard from "../cards/RenderedPlotCard";

export type Props = {
  filters?: ImageFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListRenderedPlotsQuery({
    variables: {},
  });

  return (
    <ListRender
      array={data?.renderedPlots}
      title={
        <MikroRenderTree.ListLink className="flex-0">
          Renders
        </MikroRenderTree.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <RenderedPlotCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
