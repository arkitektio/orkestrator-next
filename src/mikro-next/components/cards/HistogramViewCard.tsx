import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MikroHistogramView } from "@/linkers";
import {
  Line,
  LineChart,
  XAxis
} from "recharts";
import { MateFinder } from "../../../mates/types";
import {
  HistogramViewFragment,
  useDeleteHistogramViewMutation,
} from "../../api/graphql";
import { ViewCard } from "./meta/ViewCard";

interface Props {
  view: HistogramViewFragment;
  mates?: MateFinder[];
}

const histogramViewToChartData = (view: HistogramViewFragment) => {
  return view.histogram.map((count, i) => ({
    bin: view.bins[i],
    count,
  }));
};

const chartConfig = {
  bin: {
    label: "Bin",
  },
  count: {
    label: "Count",
  },
};

const TheCard = ({ view, mates }: Props) => {
  const [deleteHistogram] = useDeleteHistogramViewMutation();

  return (
    <MikroHistogramView.Smart object={view?.id} mates={mates}>
      <ViewCard view={view}>
        <CardHeader>
          <CardTitle>
            <p className="font-bold text-xs">
              {view.id && (
                <MikroHistogramView.DetailLink object={view.id}>
                  Histogram
                </MikroHistogramView.DetailLink>
              )}
              <Button
                onClick={() => deleteHistogram({ variables: { id: view.id } })}
                variant={"outline"}
                size={"sm"}
              >
                x
              </Button>
              <div className="w-full h-[80px] mt-2">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[80px] max-h-[80px] w-full"
                >
                  <LineChart
                    accessibilityLayer
                    data={histogramViewToChartData(view)}
                  >
                    <XAxis
                      dataKey="bin"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={2}
                    />
                    <Line
                      dataKey="count"
                      type="natural"
                      className="bg-gray-800"
                      strokeWidth={1}
                      dot={false}
                      activeDot={false}
                    ></Line>

                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
              </div>
            </p>
          </CardTitle>
        </CardHeader>
      </ViewCard>
    </MikroHistogramView.Smart>
  );
};

export default TheCard;
