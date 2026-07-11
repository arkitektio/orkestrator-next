import { ListRender } from "@/components/layout/ListRender";
import { KraphPlotView } from "@/linkers";
import { OffsetPaginationInput } from "../../api/graphql";

// NOTE: "PlotView" no longer exists in the current backend schema (no
// PlotViewFilter / useListPlotViewsQuery / PlotViewCard remain, and grepping
// graphql.ts for "PlotView" turns up nothing). Nothing in the app currently
// renders this component. Rather than invent a replacement concept (e.g.
// silently repointing it at ScatterPlot, which is a distinct surviving type),
// this is left as an inert placeholder that renders nothing, keeping the file
// compiling until the concept either comes back under a new name or this
// component is removed for good.
export type Props = {
  pagination?: OffsetPaginationInput;
};

const List = (_props: Props) => {
  return (
    <ListRender<never>
      array={undefined}
      title={
        <KraphPlotView.ListLink className="flex-0">
          Views
        </KraphPlotView.ListLink>
      }
    >
      {() => null}
    </ListRender>
  );
};

export default List;
